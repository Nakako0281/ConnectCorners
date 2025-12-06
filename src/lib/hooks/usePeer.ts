import { useState, useEffect, useCallback, useRef } from 'react';
import type Peer from 'peerjs';
import type { DataConnection } from 'peerjs';
import { v4 as uuidv4 } from 'uuid';
import { PlayerColor, Coordinate } from '../game/types';

export type NetworkMessage =
    | { type: 'START_GAME', payload: { gameState?: any, players?: any[], turnIndex?: number, turnNumber?: number } }
    | { type: 'UPDATE', payload: { gameState: any, players: any[], turnIndex: number, turnNumber?: number } }
    | { type: 'MOVE', payload: { pieceId: string, shape: number[][], position: Coordinate } }
    | { type: 'JOIN', payload: { name: string, color: PlayerColor } }
    | { type: 'LOBBY_UPDATE', payload: { players: any[] } }
    | { type: 'SELECT_CHARACTER', payload: { color: PlayerColor } }
    | { type: 'SET_READY', payload: { isReady: boolean } }
    | { type: 'PASS', payload: { playerId: string } }
    | { type: 'GAME_OVER', payload: { players: any[] } };

export const usePeer = () => {
    const [peerId, setPeerId] = useState<string>('');
    const [connections, setConnections] = useState<DataConnection[]>([]);
    const [isHost, setIsHost] = useState(false);
    const peerRef = useRef<Peer | null>(null);

    // Callbacks for external handling
    const onDataRef = useRef<((data: NetworkMessage, conn: DataConnection) => void) | null>(null);
    const onConnectRef = useRef<((conn: DataConnection) => void) | null>(null);

    const onDisconnectRef = useRef<((conn: DataConnection) => void) | null>(null);

    const initializePeer = useCallback(async () => {
        if (peerRef.current) return;

        try {
            const { default: Peer } = await import('peerjs');
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
                    console.log('Connection closed:', conn.peer);
                    setConnections(prev => prev.filter(c => c.peer !== conn.peer));
                    onDisconnectRef.current?.(conn);
                });
            });

            peerRef.current = peer;
        } catch (error) {
            console.error('Failed to load PeerJS:', error);
        }
    }, []);

    const hostGame = useCallback(() => {
        setIsHost(true);
        initializePeer();
    }, [initializePeer]);

    const joinGame = useCallback(async (hostId: string) => {
        setIsHost(false);
        if (!peerRef.current) {
            try {
                const { default: Peer } = await import('peerjs');
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

                    conn.on('close', () => {
                        console.log('Connection to host closed');
                        setConnections([]);
                        onDisconnectRef.current?.(conn);
                    });

                    peerRef.current = peer;
                });
            } catch (error) {
                console.error('Failed to load PeerJS:', error);
            }
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

    const setOnDisconnect = useCallback((fn: (conn: DataConnection) => void) => {
        onDisconnectRef.current = fn;
    }, []);

    const disconnect = useCallback(() => {
        if (peerRef.current) {
            peerRef.current.destroy();
            peerRef.current = null;
        }
        setPeerId('');
        setConnections([]);
        setIsHost(false);
    }, []);

    return {
        peerId,
        isHost,
        connections,
        hostGame,
        joinGame,
        sendData,
        setOnData,
        setOnConnect,
        setOnDisconnect,
        disconnect
    };
};
