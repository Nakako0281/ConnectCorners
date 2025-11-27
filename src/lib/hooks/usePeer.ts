import { useEffect, useState, useCallback, useRef } from 'react';
import Peer, { DataConnection } from 'peerjs';
import { v4 as uuidv4 } from 'uuid';

export type NetworkMessage =
    | { type: 'JOIN', payload: { name: string } }
    | { type: 'WELCOME', payload: { gameState: any, players: any[] } }
    | { type: 'MOVE', payload: { pieceId: string, shape: number[][], position: { x: number, y: number } } }
    | { type: 'UPDATE', payload: { gameState: any, players: any[], turnIndex: number } }
    | { type: 'START_GAME', payload: {} };

export const usePeer = () => {
    const [peerId, setPeerId] = useState<string>('');
    const [connections, setConnections] = useState<DataConnection[]>([]);
    const [isHost, setIsHost] = useState(false);
    const peerRef = useRef<Peer | null>(null);

    // Callbacks for external handling
    const onDataRef = useRef<((data: NetworkMessage, conn: DataConnection) => void) | null>(null);
    const onConnectRef = useRef<((conn: DataConnection) => void) | null>(null);

    const initializePeer = useCallback(() => {
        if (peerRef.current) return;

        const id = uuidv4().substring(0, 6).toUpperCase(); // Short ID for easier sharing
        const peer = new Peer(id);

        peer.on('open', (id) => {
            console.log('My peer ID is: ' + id);
            setPeerId(id);
        });

        peer.on('connection', (conn) => {
            console.log('Incoming connection:', conn.peer);

            conn.on('open', () => {
                setConnections(prev => [...prev, conn]);
                onConnectRef.current?.(conn);
            });

            conn.on('data', (data) => {
                console.log('Received data:', data);
                onDataRef.current?.(data as NetworkMessage, conn);
            });

            conn.on('close', () => {
                setConnections(prev => prev.filter(c => c.peer !== conn.peer));
            });
        });

        peerRef.current = peer;
    }, []);

    const hostGame = useCallback(() => {
        setIsHost(true);
        initializePeer();
    }, [initializePeer]);

    const joinGame = useCallback((hostId: string) => {
        setIsHost(false);
        if (!peerRef.current) {
            // If joining, we can let PeerJS generate a random ID or use a persistent one
            // For simplicity, let's generate one.
            const id = uuidv4();
            const peer = new Peer(id);

            peer.on('open', (myId) => {
                setPeerId(myId);
                const conn = peer.connect(hostId);

                conn.on('open', () => {
                    setConnections([conn]);
                    onConnectRef.current?.(conn);
                });

                conn.on('data', (data) => {
                    onDataRef.current?.(data as NetworkMessage, conn);
                });

                peerRef.current = peer;
            });
        } else {
            // Already initialized (maybe failed previous join)
            const conn = peerRef.current.connect(hostId);
            conn.on('open', () => {
                setConnections([conn]);
                onConnectRef.current?.(conn);
            });
            conn.on('data', (data) => {
                onDataRef.current?.(data as NetworkMessage, conn);
            });
        }
    }, []);

    const sendData = useCallback((data: NetworkMessage) => {
        connections.forEach(conn => {
            if (conn.open) {
                conn.send(data);
            }
        });
    }, [connections]);

    const setOnData = useCallback((fn: (data: NetworkMessage, conn: DataConnection) => void) => {
        onDataRef.current = fn;
    }, []);

    const setOnConnect = useCallback((fn: (conn: DataConnection) => void) => {
        onConnectRef.current = fn;
    }, []);

    return {
        peerId,
        isHost,
        connections,
        hostGame,
        joinGame,
        sendData,
        setOnData,
        setOnConnect
    };
};
