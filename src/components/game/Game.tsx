"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Board } from './Board';
import { Hand } from './Hand';
import { PieceView } from './Piece';
import { Lobby } from './Lobby';
import { GameResultModal } from './GameResultModal';
import { ScorePopup } from './ScorePopup';
import { Button } from '@/components/ui/button';
import {
    PlayerColor,
    Piece,
    Coordinate,
    Player,
    BoardState,
    Move,
    LobbyPlayer
} from '@/lib/game/types';
import {
    createInitialBoard,
    isValidMove,
    placePiece,
    getTransformedPiece,
    getAllValidMoves
} from '@/lib/game/logic';
import {
    getInitialPieces,
    ALL_COLORS,
    CORNER_POSITIONS,
    BONUS_SQUARES,
    TOTAL_PIECES_COUNT,
    TOTAL_SQUARES
} from '@/lib/game/constants';
import { CHARACTERS } from '@/lib/game/characters';
import { getAIMove } from '@/lib/game/ai';
import { usePeer, NetworkMessage } from '@/lib/hooks/usePeer';
import { RefreshCw, Trophy, HelpCircle } from 'lucide-react';
import { PlayerList } from './PlayerList';
import { SelectedPiecePanel } from './SelectedPiecePanel';


import { useSoundContext } from '@/contexts/SoundContext';
import { GameControls } from './GameControls';
import { getStats, updateStats, Achievement } from '@/lib/achievements';
import { getUserName } from '@/lib/utils/storage';
import { GameStartOverlay } from './GameStartOverlay';
import { GameEndOverlay } from './GameEndOverlay';
import { TurnNotification } from './TurnNotification';
import { SpecialPieceCutIn } from './SpecialPieceCutIn';

const createPlayer = (id: string, color: PlayerColor, isHuman: boolean): Player => ({
    id,
    color,
    pieces: getInitialPieces(color),
    isHuman,
    hasPassed: false,
    bonusScore: 0
});

export const Game: React.FC = () => {
    // Sound Context
    const { playClick, playTurnStart, playPlace, playError, playGameBgm, stopGameBgm } = useSoundContext();

    // P2P State
    const { peerId, isHost, hostGame, joinGame, sendData, setOnData, setOnConnect, setOnDisconnect, disconnect, connections } = usePeer();
    const [isMultiplayer, setIsMultiplayer] = useState(false);

    const [connectedPlayers, setConnectedPlayers] = useState<LobbyPlayer[]>([]);
    const [myPlayerColor, setMyPlayerColor] = useState<PlayerColor>('BLUE'); // Default for single player
    const [isHostDisconnected, setIsHostDisconnected] = useState(false);

    // Update Host ID in connectedPlayers when PeerID is generated
    useEffect(() => {
        if (isHost && peerId) {
            setConnectedPlayers(prev => {
                const hostIndex = prev.findIndex(p => p.isHost);
                if (hostIndex !== -1 && prev[hostIndex].id !== peerId) {
                    const newPlayers = [...prev];
                    newPlayers[hostIndex] = { ...newPlayers[hostIndex], id: peerId };
                    return newPlayers;
                }
                return prev;
            });
        }
    }, [isHost, peerId]);

    // Game State
    const [board, setBoard] = useState(createInitialBoard());
    const [players, setPlayers] = useState<Player[]>([]);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [turnNumber, setTurnNumber] = useState(1);
    const [gameStatus, setGameStatus] = useState<'lobby' | 'playing' | 'finished'>('lobby');

    const [isResultModalOpen, setIsResultModalOpen] = useState(false);
    const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
    const [gameHistory, setGameHistory] = useState<Move[]>([]);

    // Interaction State
    const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
    const [rotation, setRotation] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [hoverPos, setHoverPos] = useState<Coordinate | null>(null);

    // Visual Effects State
    const [isStarting, setIsStarting] = useState(false);
    const [isFinishing, setIsFinishing] = useState(false);
    const [specialPieceCutIn, setSpecialPieceCutIn] = useState<PlayerColor | null>(null);

    // Score Animation State
    interface ScorePopupData {
        id: string;
        score: number;
        x: number;
        y: number;
        hasBonus: boolean;
    }
    const [scorePopups, setScorePopups] = useState<ScorePopupData[]>([]);

    // BGM Control
    useEffect(() => {
        if (gameStatus === 'playing') {
            playGameBgm();
        } else {
            stopGameBgm();
        }
        return () => {
            stopGameBgm();
        };
    }, [gameStatus, playGameBgm, stopGameBgm]);

    // Initialize Single Player Game
    const initSinglePlayer = (playerColor: PlayerColor) => {
        playClick();

        // Reset Board and Interaction State
        setBoard(createInitialBoard());
        setSelectedPieceId(null);
        setRotation(0);
        setIsFlipped(false);
        setHoverPos(null);
        setScorePopups([]);

        // Get unlocked characters for CPU selection
        const stats = getStats();
        const unlockedAchievements = stats.unlockedAchievements;

        // Define unlock conditions (duplicated from Lobby, ideally shared)
        const UNLOCK_CONDITIONS: Record<PlayerColor, string | null> = {
            BLUE: null,
            RED: null,
            GREEN: null,
            YELLOW: null,
            LIGHTBLUE: 'first_win',
            PINK: 'perfect_game',
            ORANGE: 'veteran',
            PURPLE: 'win_streak_5',
        };

        // Filter available colors for CPU
        const availableColors = ALL_COLORS.filter(c => {
            if (c === playerColor) return false;
            const condition = UNLOCK_CONDITIONS[c];
            return !condition || unlockedAchievements.includes(condition);
        });

        // Select 3 random opponents from available colors
        const opponents: PlayerColor[] = [];
        const shuffled = [...availableColors].sort(() => 0.5 - Math.random());
        opponents.push(...shuffled.slice(0, 3));

        const newPlayers: Player[] = [
            createPlayer('p1', playerColor, true),
            createPlayer('cpu1', opponents[0], false),
            createPlayer('cpu2', opponents[1], false),
            createPlayer('cpu3', opponents[2], false),
        ];

        setPlayers(newPlayers);
        setCurrentPlayerIndex(0);
        setGameStatus('playing');
        setIsStarting(true); // Start animation
        setIsMultiplayer(false);
        setMyPlayerColor(playerColor);
        setTurnNumber(1);
        setGameHistory([]);
        playTurnStart();
    };

    // Initialize Multiplayer Game (Host)
    const startMultiplayerGame = () => {
        playClick();
        if (!isHost) return;

        // Get Host Color from Lobby State
        const hostLobbyPlayer = connectedPlayers.find(p => p.id === peerId);
        const hostColor = hostLobbyPlayer?.color || 'BLUE';
        setMyPlayerColor(hostColor);

        // Map connected players to game players
        const gamePlayers: Player[] = [];

        // 1. Host
        gamePlayers.push({
            id: peerId,
            color: hostColor,
            pieces: getInitialPieces(hostColor),
            isHuman: true,
            hasPassed: false,
            bonusScore: 0
        });

        // 2. Guests (from connectedPlayers)
        // 2. Guests (from connectedPlayers)
        const guests = connectedPlayers.filter(p => p.id !== peerId);
        const usedColors = new Set<PlayerColor>([hostColor]);

        guests.forEach(guest => {
            let guestColor = guest.color || 'BLUE'; // Fallback if null (shouldn't happen if ready)

            // If color is taken, find first available (Safety check)
            if (usedColors.has(guestColor)) {
                const available = ALL_COLORS.find(c => !usedColors.has(c));
                if (available) {
                    guestColor = available;
                }
            }

            usedColors.add(guestColor);

            gamePlayers.push({
                id: guest.id,
                color: guestColor,
                pieces: getInitialPieces(guestColor),
                isHuman: true,
                hasPassed: false,
                bonusScore: 0
            });
        });

        // 3. Fill remaining slots with AI (up to 4 players total)
        const remainingSlots = 4 - gamePlayers.length;
        const remainingColors = ALL_COLORS.filter(c => !usedColors.has(c));

        for (let i = 0; i < remainingSlots; i++) {
            if (i < remainingColors.length) {
                const color = remainingColors[i];
                gamePlayers.push({
                    id: `AI-${color}`,
                    color: color,
                    pieces: getInitialPieces(color),
                    isHuman: false,
                    hasPassed: false,
                    bonusScore: 0
                });
            }
        }

        setPlayers(gamePlayers);
        setGameStatus('playing');
        setIsStarting(true); // Start animation
        setIsMultiplayer(true);

        // Broadcast Start
        const gameState = {
            board: createInitialBoard(),
            players: gamePlayers,
            turnIndex: 0
        };

        sendData({
            type: 'START_GAME',
            payload: {
                gameState: gameState.board,
                players: gamePlayers,
                turnIndex: 0
            }
        });
        // We still broadcast update for good measure, or we can skip it if we trust START_GAME
        broadcastUpdate(gameState.board, gamePlayers, 0);
    };

    // Broadcast Update (Host only)
    const broadcastUpdate = (newBoard: BoardState, newPlayers: Player[], newTurnIndex: number) => {
        sendData({
            type: 'UPDATE',
            payload: {
                gameState: newBoard,
                players: newPlayers,
                turnIndex: newTurnIndex
            }
        });
    };

    const nextTurnIndex = (currentPlayers: Player[], currentIndex: number) => {
        let nextIndex = (currentIndex + 1) % 4;
        let attempts = 0;
        while (currentPlayers[nextIndex].hasPassed && attempts < 4) {
            nextIndex = (nextIndex + 1) % 4;
            attempts++;
        }
        if (attempts === 4) {
            handleGameEnd(currentPlayers);
        }
        return nextIndex;
    };

    const handleGameEnd = (finalPlayers: Player[]) => {
        setGameStatus('finished');

        // Calculate winner and stats
        const playersWithScores = finalPlayers.map(p => {
            const remainingSquares = p.pieces.reduce((acc, piece) => acc + piece.value, 0);
            const score = TOTAL_SQUARES - remainingSquares + (p.pieces.length === 0 ? 15 : 0) + (p.bonusScore || 0);
            const isPerfect = p.pieces.length === 0;
            return { ...p, score, isPerfect };
        }).sort((a, b) => b.score - a.score);

        const winner = playersWithScores[0];

        const myPlayer = playersWithScores.find(p => p.color === myPlayerColor);

        if (myPlayer) {
            const isWin = winner.color === myPlayerColor;
            const isPerfect = myPlayer.isPerfect;

            const { newAchievements } = updateStats({
                isWin,
                isPerfect,
                isMultiplayer
            });

            if (newAchievements.length > 0) {
                setNewAchievements(newAchievements);
            }
        }

        setIsFinishing(true); // Start finish animation
        // setIsResultModalOpen(true); // Will be called after animation

        if (isMultiplayer && isHost) {
            sendData({
                type: 'GAME_OVER',
                payload: { players: finalPlayers }
            });
        }
    };

    // Handle Incoming Data
    useEffect(() => {
        setOnConnect((conn) => {
            if (isHost) {
                setConnectedPlayers(prev => {
                    if (prev.some(p => p.id === conn.peer)) return prev;
                    // Add new guest
                    const newGuest: LobbyPlayer = {
                        id: conn.peer,
                        color: null,
                        name: `Guest-${conn.peer.substring(0, 4)}`, // Temp name until JOIN
                        isReady: false,
                        isHost: false
                    };
                    const newPlayers = [...prev, newGuest];

                    // Broadcast new lobby state
                    setTimeout(() => {
                        sendData({ type: 'LOBBY_UPDATE', payload: { players: newPlayers } });
                    }, 500); // Small delay to ensure connection is ready

                    return newPlayers;
                });
            }
        });

        setOnData((data, conn) => {
            if (data.type === 'START_GAME') {
                if (data.payload.players && data.payload.gameState) {
                    setBoard(data.payload.gameState as BoardState);
                    setPlayers(data.payload.players);
                    setCurrentPlayerIndex(data.payload.turnIndex || 0);

                    // Determine my color immediately if possible
                    const me = data.payload.players.find((p: Player) => p.id === peerId);
                    if (me) setMyPlayerColor(me.color);
                }
                setGameStatus('playing');
                setIsStarting(true); // Start animation
                setIsMultiplayer(true);
            }
            else if (data.type === 'JOIN') {
                const { name, color } = data.payload;
                if (isHost) {
                    setConnectedPlayers(prev => {
                        const newPlayers = prev.map(p => p.id === conn.peer ? { ...p, name } : p); // Don't set color yet
                        sendData({ type: 'LOBBY_UPDATE', payload: { players: newPlayers } });
                        return newPlayers;
                    });
                }
            }
            else if (data.type === 'LOBBY_UPDATE') {
                // Guest receiving lobby update
                console.log(`[GUEST] Received LOBBY_UPDATE:`, data.payload.players);
                setConnectedPlayers(data.payload.players);
            }
            else if (data.type === 'SELECT_CHARACTER') {
                // Host receiving character selection request
                if (isHost) {
                    const { color } = data.payload;
                    console.log(`[HOST] Received SELECT_CHARACTER from ${conn.peer}: ${color}`);
                    // Check if taken
                    const isTaken = connectedPlayers.some(p => p.color === color && p.id !== conn.peer);
                    console.log(`[HOST] isTaken: ${isTaken}`, connectedPlayers);

                    if (!isTaken) {
                        setConnectedPlayers(prev => {
                            const newPlayers = prev.map(p => p.id === conn.peer ? { ...p, color, isReady: false } : p);
                            console.log(`[HOST] Updating connectedPlayers:`, newPlayers);
                            sendData({ type: 'LOBBY_UPDATE', payload: { players: newPlayers } });
                            return newPlayers;
                        });
                    }
                }
            }
            else if (data.type === 'SET_READY') {
                if (isHost) {
                    const { isReady } = data.payload;
                    setConnectedPlayers(prev => {
                        const newPlayers = prev.map(p => p.id === conn.peer ? { ...p, isReady } : p);
                        sendData({ type: 'LOBBY_UPDATE', payload: { players: newPlayers } });
                        return newPlayers;
                    });
                }
            }
            else if (data.type === 'UPDATE') {
                // Guest receiving update
                setBoard(data.payload.gameState as BoardState);
                setPlayers(data.payload.players);
                setCurrentPlayerIndex(data.payload.turnIndex);

                // Determine my color
                const me = data.payload.players.find((p: Player) => p.id === peerId);
                if (me) setMyPlayerColor(me.color);
            }
            else if (data.type === 'MOVE') {
                // Host receiving move request
                if (!isHost) return;

                const { pieceId, shape, position } = data.payload;
                const playerIndex = players.findIndex(p => p.id === conn.peer);

                if (playerIndex !== currentPlayerIndex) return; // Not their turn

                const player = players[playerIndex];
                const piece = player.pieces.find(p => p.id === pieceId);

                if (piece) {
                    // Validate on Host
                    const isFirstMove = piece.value === 0;
                    // Actually we need to check if it's the first move for THIS player.
                    const isFirst = player.pieces.length === TOTAL_PIECES_COUNT;
                    const startPos = CORNER_POSITIONS[playerIndex];

                    if (isValidMove(board, shape, position, player.color, isFirst, startPos)) {
                        handlePlacePiece(piece, shape, position); // Use common handler
                    }
                }
            }
            else if (data.type === 'PASS') {
                // Host receiving pass notification
                if (!isHost) return;

                const { playerId } = data.payload;
                const playerIndex = players.findIndex(p => p.id === playerId);

                if (playerIndex !== currentPlayerIndex) return; // Not their turn

                // Execute Pass
                const newPlayers = [...players];
                newPlayers[playerIndex].hasPassed = true;
                setPlayers(newPlayers);

                const nextIdx = nextTurnIndex(newPlayers, currentPlayerIndex);
                setCurrentPlayerIndex(nextIdx);

                broadcastUpdate(board, newPlayers, nextIdx);
            }
            else if (data.type === 'GAME_OVER') {
                handleGameEnd(data.payload.players);
            }
        });
    }, [isHost, players, board, currentPlayerIndex, peerId, setOnConnect, setOnData, sendData, connectedPlayers]);

    // Handle Disconnection
    useEffect(() => {
        setOnDisconnect((conn) => {
            if (isHost) {
                // Host handling guest disconnection
                console.log(`Player ${conn.peer} disconnected`);

                setPlayers(prevPlayers => {
                    const disconnectedPlayerIndex = prevPlayers.findIndex(p => p.id === conn.peer);
                    if (disconnectedPlayerIndex === -1) return prevPlayers;

                    const newPlayers = [...prevPlayers];
                    const disconnectedPlayer = newPlayers[disconnectedPlayerIndex];

                    // Convert to AI
                    newPlayers[disconnectedPlayerIndex] = {
                        ...disconnectedPlayer,
                        id: `AI-${disconnectedPlayer.color}`, // Change ID to AI format
                        isHuman: false
                    };

                    // Broadcast the update to remaining players
                    // We need to use the NEW players list for broadcast
                    // Note: We can't easily access the latest 'board' or 'currentPlayerIndex' here inside the callback 
                    // without adding them to dependency array, which might be okay.
                    // However, setPlayers functional update is safer for state, but we need the value for broadcast.
                    // Let's use a ref or just rely on the fact that if we update state, we should trigger a broadcast effect?
                    // Or just use the current state from closure if we add dependencies.

                    return newPlayers;
                });

                setConnectedPlayers(prev => prev.filter(p => p.id !== conn.peer));

                // We need to broadcast this change. 
                // Since we are inside a callback, we might not have the absolute latest board/turnIndex if we don't add them to deps.
                // But we can try to broadcast with current state.
                // To be safe, let's trigger a broadcast in a separate effect or just use the values we have.
                // Actually, the simplest way is to force a re-render and let an effect handle it, 
                // OR just use the values from the closure (adding them to deps).
            } else {
                // Guest handling host disconnection
                console.log("Host disconnected");
                setIsHostDisconnected(true);
            }
        });
    }, [isHost, setOnDisconnect, setPlayers, setConnectedPlayers, setIsHostDisconnected]);

    // Effect to broadcast player changes when a player disconnects (Host only)
    // This is a bit tricky because setPlayers is async. 
    // Let's just do it inside the callback but we need access to 'board' and 'currentPlayerIndex'.
    // We can add them to the dependency array of the useEffect above.
    useEffect(() => {
        setOnDisconnect((conn) => {
            if (isHost) {
                console.log(`Player ${conn.peer} disconnected`);

                // 1. Update Connected Players
                setConnectedPlayers(prev => prev.filter(p => p.id !== conn.peer));

                // 2. Update Game Players (Convert to AI)
                let newPlayers: Player[] = [];
                let updated = false;

                setPlayers(currentPlayers => {
                    const idx = currentPlayers.findIndex(p => p.id === conn.peer);
                    if (idx === -1) {
                        newPlayers = currentPlayers;
                        return currentPlayers;
                    }

                    updated = true;
                    newPlayers = [...currentPlayers];
                    newPlayers[idx] = {
                        ...newPlayers[idx],
                        id: `AI-${newPlayers[idx].color}`,
                        isHuman: false
                    };
                    return newPlayers;
                });

                // 3. Broadcast if updated
                if (updated) {
                    // We need to wait for the state update to reflect? 
                    // Actually, we calculated 'newPlayers' locally, so we can broadcast that.
                    // We use the current 'board' and 'currentPlayerIndex' from closure.
                    broadcastUpdate(board, newPlayers, currentPlayerIndex);

                    // Optional: Show a toast or log
                    // alert(`Player disconnected. Switched to AI.`); // Too intrusive?
                }
            } else {
                console.log("Host disconnected");
                setIsHostDisconnected(true);
            }
        });
    }, [isHost, board, currentPlayerIndex, broadcastUpdate, setOnDisconnect]);
    const [hasSentJoin, setHasSentJoin] = useState(false);

    useEffect(() => {
        if (!isHost && gameStatus === 'lobby' && peerId && !hasSentJoin && connections.length > 0) {
            console.log("Sending JOIN message to host");
            sendData({
                type: 'JOIN',
                payload: {
                    name: getUserName() || `Guest-${peerId.substring(0, 4)}`,
                    color: 'BLUE' // Dummy color, will select in lobby
                }
            });
            setHasSentJoin(true);
        }
    }, [isHost, gameStatus, peerId, hasSentJoin, connections, myPlayerColor, sendData]);

    const currentPlayer = players[currentPlayerIndex];
    const selectedPiece = currentPlayer?.pieces.find(p => p.id === selectedPieceId);
    const isMyTurn = currentPlayer?.id === (isMultiplayer ? peerId : 'BLUE') || (!isMultiplayer && currentPlayer?.isHuman);

    // AI Turn Handler (Host only or Single Player)
    useEffect(() => {
        if (gameStatus !== 'playing') return;

        // If Multiplayer: Host handles AI turns
        // If Singleplayer: We handle AI turns (we are effectively host)
        const shouldHandleAI = isMultiplayer ? isHost : true;

        if (shouldHandleAI && currentPlayer && !currentPlayer.isHuman && !currentPlayer.hasPassed) {
            const timer = setTimeout(() => {
                const isFirstMove = currentPlayer.pieces.length === TOTAL_PIECES_COUNT;
                const startPos = CORNER_POSITIONS[currentPlayerIndex];
                const move = getAIMove(board, currentPlayer.pieces, currentPlayer.color, isFirstMove, startPos);

                if (move) {
                    // Apply AI move locally then broadcast if host
                    playPlace();
                    const newBoard = placePiece(board, move.shape, move.position, currentPlayer.color);
                    const newPlayers = [...players];
                    newPlayers[currentPlayerIndex] = {
                        ...currentPlayer,
                        pieces: currentPlayer.pieces.filter(p => p.id !== move.piece.id)
                    };

                    setBoard(newBoard);
                    setPlayers(newPlayers);

                    const nextIdx = nextTurnIndex(newPlayers, currentPlayerIndex);
                    setCurrentPlayerIndex(nextIdx);

                    if (isMultiplayer && isHost) {
                        broadcastUpdate(newBoard, newPlayers, nextIdx);
                    }
                } else {
                    // Pass
                    const newPlayers = [...players];
                    newPlayers[currentPlayerIndex].hasPassed = true;
                    setPlayers(newPlayers);
                    const nextIdx = nextTurnIndex(newPlayers, currentPlayerIndex);
                    setCurrentPlayerIndex(nextIdx);

                    if (isMultiplayer && isHost) {
                        broadcastUpdate(board, newPlayers, nextIdx); // Board didn't change
                    }
                }
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [currentPlayerIndex, gameStatus, board, players, isHost, isMultiplayer, currentPlayer]);

    // Auto-pass for human players with no valid moves
    useEffect(() => {
        if (gameStatus !== 'playing') return;
        if (!currentPlayer || currentPlayer.hasPassed) return;
        if (!isMyTurn) return; // Only check for my turn

        // Check if player has any valid moves
        const isFirstMove = currentPlayer.pieces.length === TOTAL_PIECES_COUNT;
        const startPos = CORNER_POSITIONS[currentPlayerIndex];
        const validMoves = getAllValidMoves(board, currentPlayer.pieces, currentPlayer.color, isFirstMove, startPos);

        if (validMoves.length === 0) {
            // Automatically pass if no valid moves
            console.log(`${currentPlayer.color} has no valid moves. Auto-passing...`);
            setTimeout(() => {
                handlePass();
            }, 1000); // 1 second delay so user can see what happened
        }
    }, [currentPlayerIndex, gameStatus, board, currentPlayer, isMyTurn]);

    const handlePlacePiece = (piece: Piece, shape: number[][], position: Coordinate) => {
        playPlace();

        // Special Piece Cut-in Trigger
        if (piece.id === 'special') {
            setSpecialPieceCutIn(currentPlayer.color);
        }

        // Calculate Score & Show Popup (Common for both)
        const bonusPoints = calculateBonusPoints(shape, position);
        let totalScore = piece.value + bonusPoints;
        let pointsToAdd = bonusPoints;

        // Double score for Special Piece
        if (piece.id === 'special') {
            totalScore *= 2;
            pointsToAdd = piece.value + (bonusPoints * 2);
        }

        const boardElement = document.getElementById('game-board');
        if (boardElement) {
            const boardRect = boardElement.getBoundingClientRect();
            const cellSize = boardRect.width / 20; // BOARD_SIZE = 20

            // Find center of placed piece
            let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
            shape.forEach((row, dy) => {
                row.forEach((cell, dx) => {
                    if (cell) {
                        minX = Math.min(minX, dx);
                        maxX = Math.max(maxX, dx);
                        minY = Math.min(minY, dy);
                        maxY = Math.max(maxY, dy);
                    }
                });
            });

            const centerX = position.x + (minX + maxX) / 2;
            const centerY = position.y + (minY + maxY) / 2;
            const screenX = boardRect.left + centerX * cellSize;
            const screenY = boardRect.top + centerY * cellSize;

            const popupId = `${Date.now()}-${Math.random()}`;
            setScorePopups(prev => [...prev, {
                id: popupId,
                score: totalScore,
                x: screenX,
                y: screenY,
                hasBonus: bonusPoints > 0
            }]);
        }

        // Reset selection (Common)
        setSelectedPieceId(null);
        setRotation(0);
        setIsFlipped(false);

        if (isMultiplayer && !isHost) {
            // Guest: Send move to Host
            sendData({
                type: 'MOVE',
                payload: {
                    pieceId: piece.id,
                    shape,
                    position
                }
            });
        } else {
            // Host or Single Player: Apply locally
            const newBoard = placePiece(board, shape, position, currentPlayer.color);

            setBoard(newBoard);

            const newPlayers = [...players];
            newPlayers[currentPlayerIndex] = {
                ...currentPlayer,
                pieces: currentPlayer.pieces.filter(p => p.id !== piece.id),
                bonusScore: currentPlayer.bonusScore + pointsToAdd
            };
            setPlayers(newPlayers);

            const nextIdx = nextTurnIndex(newPlayers, currentPlayerIndex);
            setCurrentPlayerIndex(nextIdx);

            if (isMultiplayer && isHost) {
                broadcastUpdate(newBoard, newPlayers, nextIdx);
            }
        }
    };

    const calculateBonusPoints = (shape: number[][], position: Coordinate): number => {
        let points = 0;
        shape.forEach((row, dy) => {
            row.forEach((cell, dx) => {
                if (cell) {
                    const x = position.x + dx;
                    const y = position.y + dy;
                    if (BONUS_SQUARES.some(bs => bs.x === x && bs.y === y)) {
                        points++;
                    }
                }
            });
        });
        return points;
    };

    const handlePass = () => {
        playClick();
        if (isMultiplayer && !isHost) {
            sendData({
                type: 'PASS',
                payload: { playerId: peerId }
            });
        } else {
            const newPlayers = [...players];
            newPlayers[currentPlayerIndex].hasPassed = true;
            setPlayers(newPlayers);
            setSelectedPieceId(null);
            const nextIdx = nextTurnIndex(newPlayers, currentPlayerIndex);
            setCurrentPlayerIndex(nextIdx);
            if (isMultiplayer && isHost) {
                broadcastUpdate(board, newPlayers, nextIdx);
            }
        }
    };

    const resetGameState = () => {
        setGameStatus('lobby');
        setBoard(createInitialBoard());
        setPlayers([]);
        setIsMultiplayer(false);
        setIsResultModalOpen(false);
        setNewAchievements([]);
    };

    const handleReset = () => {
        playClick();
        resetGameState();
    };

    const handleBack = () => {
        playClick();
        disconnect(); // Disconnect from PeerJS
        resetGameState();
        setConnectedPlayers([]);
        setHasSentJoin(false);
    };

    const handleRestart = () => {
        playClick();
        if (isMultiplayer) {
            handleReset();
        } else {
            initSinglePlayer(myPlayerColor);
            setIsResultModalOpen(false);
            setNewAchievements([]);
        }
    };

    const onBoardClick = useCallback((pos: Coordinate) => {
        if (!isMyTurn || !selectedPiece || isStarting || isFinishing || specialPieceCutIn) return;

        const shape = getTransformedPiece(selectedPiece, rotation, isFlipped);
        const isFirstMove = currentPlayer.pieces.length === TOTAL_PIECES_COUNT;
        const startPos = CORNER_POSITIONS[currentPlayerIndex];

        if (isValidMove(board, shape, pos, currentPlayer.color, isFirstMove, startPos)) {
            handlePlacePiece(selectedPiece, shape, pos);
        } else {
            playError();
        }
    }, [isMyTurn, selectedPiece, rotation, isFlipped, currentPlayer, board, handlePlacePiece]);

    const onBoardHover = useCallback((pos: Coordinate) => {
        setHoverPos(pos);
    }, []);

    // Preview Logic
    const previewShape = selectedPiece ? getTransformedPiece(selectedPiece, rotation, isFlipped) : undefined;
    const isFirstMove = currentPlayer?.pieces.length === TOTAL_PIECES_COUNT;
    const startPos = currentPlayer ? CORNER_POSITIONS[currentPlayerIndex] : undefined;
    const isValidPreview = selectedPiece && hoverPos && currentPlayer
        ? isValidMove(board, previewShape!, hoverPos, currentPlayer.color, isFirstMove, startPos)
        : false;

    if (gameStatus === 'lobby') {
        return (
            <Lobby
                peerId={peerId}
                isHost={isHost}
                connectedPlayers={connectedPlayers}
                onHost={(color) => {
                    // Initialize Host in Lobby
                    const myName = getUserName() || 'Host';
                    setConnectedPlayers([{
                        id: peerId,
                        name: myName,
                        color: color,
                        isReady: false,
                        isHost: true
                    }]);
                    hostGame();
                }}
                onJoin={(hostId, color) => {
                    joinGame(hostId);
                }}
                onStart={startMultiplayerGame}
                onSinglePlayer={(color) => {
                    setMyPlayerColor(color);
                    initSinglePlayer(color);
                }}
                onBack={handleBack}
                onSelectCharacter={(color) => {
                    if (isHost) {
                        console.log(`[HOST] Selecting character locally: ${color}`);
                        setConnectedPlayers(prev => {
                            const newPlayers = prev.map(p => p.id === peerId ? { ...p, color, isReady: false } : p);
                            console.log(`[HOST] New players list:`, newPlayers);
                            sendData({ type: 'LOBBY_UPDATE', payload: { players: newPlayers } });
                            return newPlayers;
                        });
                    } else {
                        console.log(`[GUEST] Sending SELECT_CHARACTER: ${color}`);
                        sendData({ type: 'SELECT_CHARACTER', payload: { color } });
                    }
                }}
                onSetReady={(isReady) => {
                    if (isHost) {
                        setConnectedPlayers(prev => {
                            const newPlayers = prev.map(p => p.id === peerId ? { ...p, isReady } : p);
                            sendData({ type: 'LOBBY_UPDATE', payload: { players: newPlayers } });
                            return newPlayers;
                        });
                    } else {
                        sendData({ type: 'SET_READY', payload: { isReady } });
                    }
                }}
                myLobbyPlayer={connectedPlayers.find(p => p.id === peerId) || null}
            />
        );
    }

    // Loading state check
    if (gameStatus === 'playing' && (!players.length || !currentPlayer)) {
        return (
            <div className="flex items-center justify-center h-screen w-full bg-slate-950 text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p>Loading game data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center p-8 h-screen w-full overflow-hidden relative">

            {/* Top Right Controls */}
            <GameControls>
                <Button variant="ghost" size="sm" onClick={handleReset} className="text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                    <RefreshCw className="w-4 h-4 mr-2" /> Quit Game
                </Button>
            </GameControls>

            {/* Left Panel: Game Info & Controls */}
            <div className="flex flex-col gap-6 w-full lg:w-80 h-full overflow-y-auto pr-2">
                <div className="glass-panel p-6 rounded-xl flex-shrink-0">
                    <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2 tracking-tight">
                        CONNECT CORNERS
                    </h1>
                    <div className="flex items-center gap-2 mb-4">
                        <div className={`w-4 h-4 rounded-full bg-${currentPlayer.color.toLowerCase()}-500 shadow-[0_0_10px_currentColor]`} style={{ color: `var(--color-${currentPlayer.color.toLowerCase()}-500)` }} />
                        <span className="font-medium text-slate-300">
                            Turn {turnNumber}: <span style={{ color: currentPlayer.color }} className="font-bold">{CHARACTERS[currentPlayer.color].japaneseName}</span>
                            {isMyTurn ? " (You)" : " (Waiting...)"}
                            {currentPlayer.hasPassed && <span className="ml-2 text-red-400 font-bold">(PASSED)</span>}
                        </span>
                    </div>

                    {/* Player Status List */}
                    <PlayerList players={players} currentPlayerId={currentPlayer?.id} />
                </div>
            </div>

            {/* Center: Board */}
            <div className="flex-shrink-0 glass-panel p-4 rounded-xl h-fit max-h-full overflow-hidden relative group"
                onMouseLeave={() => setHoverPos(null)}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                <Board
                    id="game-board"
                    board={board}
                    onCellClick={onBoardClick}
                    onCellHover={onBoardHover}
                    previewShape={isMyTurn ? previewShape : undefined}
                    previewPos={isMyTurn ? hoverPos : null}
                    previewColor={currentPlayer.color}
                    isValidPreview={isValidPreview}
                    startPositions={players.reduce((acc, p, i) => ({ ...acc, [p.color]: CORNER_POSITIONS[i] }), {} as Record<PlayerColor, Coordinate>)}
                    onContextMenu={() => {
                        if (isMyTurn && selectedPiece) {
                            setRotation((r) => (r + 90) % 360);
                        }
                    }}
                />
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-4 w-full lg:w-96 h-full overflow-hidden">
                {/* Selected Piece Controls */}
                <SelectedPiecePanel
                    selectedPiece={selectedPiece}
                    previewShape={previewShape}
                    color={currentPlayer.color}
                    isMyTurn={isMyTurn}
                    onRotate={() => setRotation((r) => (r + 90) % 360)}
                    onFlip={() => setIsFlipped((f) => !f)}
                />

                {/* Hand */}
                <div className="glass-panel p-6 rounded-xl flex-1 overflow-hidden flex flex-col">
                    <h3 className="font-semibold text-slate-300 mb-4 flex justify-between items-center flex-shrink-0 uppercase tracking-wider text-sm">
                        <span>{isMyTurn ? "Your Pieces" : `${CHARACTERS[currentPlayer.color].japaneseName}'s Pieces`}</span>
                        {currentPlayer.hasPassed && <span className="text-xs bg-red-900/50 text-red-400 px-2 py-1 rounded border border-red-500/30">PASSED</span>}
                    </h3>
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        <Hand
                            pieces={currentPlayer.pieces}
                            playerColor={currentPlayer.color}
                            selectedPieceId={selectedPieceId}
                            onSelectPiece={(p) => {
                                if (isMyTurn) {
                                    // Special Piece Restriction: Score >= 20
                                    if (p.id === 'special') {
                                        const remainingSquares = currentPlayer.pieces.reduce((acc, piece) => acc + piece.value, 0);
                                        // Note: Total squares is 89 + 6 (special) = 95? Or is special included in pieces?
                                        // Assuming pieces includes special.
                                        // Let's calculate score dynamically.
                                        // Actually, we can just calculate the score the same way as handleGameEnd
                                        // But we don't know the exact total squares if we don't hardcode or sum initial.
                                        // Let's assume 89 is standard + special (6) = 95 total?
                                        // Wait, standard pieces = 89 squares. Special = 6 squares.
                                        // If special is in the hand, it counts towards remaining.
                                        // Score = (Total Initial Squares - Remaining Squares) + Bonus
                                        // Total Initial = 89 (standard) + 6 (special) = 95.
                                        const currentScore = TOTAL_SQUARES - remainingSquares + currentPlayer.bonusScore;

                                        if (currentScore < 20) {
                                            playError();
                                            return;
                                        }
                                    }

                                    setSelectedPieceId(p.id);
                                    setRotation(0);
                                    setIsFlipped(false);
                                }
                            }}
                            canUseSpecial={(TOTAL_SQUARES - currentPlayer.pieces.reduce((acc, piece) => acc + piece.value, 0) + currentPlayer.bonusScore) >= 20}
                        />
                    </div>
                    {!isMyTurn && (
                        <div className="text-center text-slate-500 mt-4 flex-shrink-0 italic">
                            Waiting for {CHARACTERS[currentPlayer.color].japaneseName}...
                        </div>
                    )}
                </div>
            </div>

            {/* Visual Effects */}
            {isStarting && <GameStartOverlay onComplete={() => setIsStarting(false)} />}
            {isFinishing && <GameEndOverlay onComplete={() => {
                setIsFinishing(false);
                setIsResultModalOpen(true);
            }} />}
            <TurnNotification isMyTurn={isMyTurn && !isStarting && !isFinishing} />
            {specialPieceCutIn && (
                <SpecialPieceCutIn
                    character={CHARACTERS[specialPieceCutIn]}
                    onComplete={() => setSpecialPieceCutIn(null)}
                />
            )}

            {/* Game Result Modal */}
            <GameResultModal
                isOpen={isResultModalOpen}
                onClose={() => setIsResultModalOpen(false)}
                players={players}
                onPlayAgain={handleRestart}
                onBackToTitle={handleBack}
                newAchievements={newAchievements}
            />

            {/* Score Popups */}
            {scorePopups.map((popup) => (
                <ScorePopup
                    key={popup.id}
                    score={popup.score}
                    x={popup.x}
                    y={popup.y}
                    hasBonus={popup.hasBonus}
                    onComplete={() => setScorePopups(prev => prev.filter(p => p.id !== popup.id))}
                />
            ))}

            {/* Host Disconnected Modal */}
            {isHostDisconnected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-700 p-8 rounded-xl max-w-md w-full text-center shadow-2xl">
                        <h2 className="text-2xl font-bold text-red-500 mb-4">Connection Lost</h2>
                        <p className="text-slate-300 mb-8">
                            The host has disconnected. The game session has ended.
                        </p>
                        <Button
                            onClick={handleBack}
                            className="w-full bg-slate-700 hover:bg-slate-600 text-white"
                        >
                            Return to Lobby
                        </Button>
                    </div>
                </div>
            )}

        </div>
    );
};
