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
    BoardState
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
    TOTAL_PIECES_COUNT
} from '@/lib/game/constants';
import { CHARACTERS } from '@/lib/game/characters';
import { getAIMove } from '@/lib/game/ai';
import { usePeer, NetworkMessage } from '@/lib/hooks/usePeer';
import { RefreshCw, Volume2, VolumeX } from 'lucide-react';
import { PlayerList } from './PlayerList';
import { SelectedPiecePanel } from './SelectedPiecePanel';
import { useSoundContext } from '@/contexts/SoundContext';

export const Game: React.FC = () => {
    // Sound Context
    const { isMuted, toggleMute, playClick, playTurnStart, playPlace, playError } = useSoundContext();

    // P2P State
    const { peerId, isHost, hostGame, joinGame, sendData, setOnData, setOnConnect } = usePeer();
    const [isMultiplayer, setIsMultiplayer] = useState(false);
    const [connectedPlayerIds, setConnectedPlayerIds] = useState<string[]>([]);
    const [myPlayerColor, setMyPlayerColor] = useState<PlayerColor>('BLUE'); // Default for single player

    // Game State
    const [board, setBoard] = useState(createInitialBoard());
    const [players, setPlayers] = useState<Player[]>([]);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [turnNumber, setTurnNumber] = useState(1);
    const [gameStatus, setGameStatus] = useState<'lobby' | 'playing' | 'finished'>('lobby');
    const [isResultModalOpen, setIsResultModalOpen] = useState(false);

    // Interaction State
    const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
    const [rotation, setRotation] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [hoverPos, setHoverPos] = useState<Coordinate | null>(null);

    // Score Animation State
    interface ScorePopupData {
        id: string;
        score: number;
        x: number;
        y: number;
        hasBonus: boolean;
    }
    const [scorePopups, setScorePopups] = useState<ScorePopupData[]>([]);

    // Initialize Single Player Game
    const initSinglePlayer = (selectedColor: PlayerColor) => {
        playClick();

        // Create player list: Human (selected) + 3 AI (random/remaining)
        const aiColors = ALL_COLORS.filter(c => c !== selectedColor)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

        const gameColors = [selectedColor, ...aiColors];

        const initialPlayers: Player[] = gameColors.map((color, index) => ({
            id: color,
            color: color as PlayerColor,
            pieces: getInitialPieces(color as PlayerColor),
            isHuman: index === 0,
            hasPassed: false,
            bonusScore: 0
        }));
        setBoard(createInitialBoard());
        setPlayers(initialPlayers);
        setCurrentPlayerIndex(0);
        setGameStatus('playing');
        setIsMultiplayer(false);
        setMyPlayerColor(selectedColor);
        playTurnStart();
    };


    // Initialize Multiplayer Game (Host)
    const startMultiplayerGame = () => {
        playClick();
        if (!isHost) return;

        const hostColor = myPlayerColor;

        // Pick 3 other colors
        const otherColors = ALL_COLORS.filter(c => c !== hostColor).slice(0, 3);
        const gameColors = [hostColor, ...otherColors];

        const initialPlayers: Player[] = gameColors.map((color, index) => {
            const conn = connections[index - 1]; // connections[0] is Guest1
            return {
                id: index === 0 ? peerId : (conn ? conn.peer : `AI-${color}`),
                color: color as PlayerColor,
                pieces: getInitialPieces(color as PlayerColor),
                isHuman: index === 0 || !!conn, // AI if no connection
                hasPassed: false,
                bonusScore: 0
            };
        });

        setPlayers(initialPlayers);
        setGameStatus('playing');

        // Broadcast Start
        const gameState = {
            board: createInitialBoard(),
            players: initialPlayers,
            turnIndex: 0
        };

        sendData({ type: 'START_GAME', payload: {} });
        broadcastUpdate(gameState.board, initialPlayers, 0);
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

    // Handle Incoming Data
    useEffect(() => {
        setOnConnect((conn) => {
            setConnectedPlayerIds(prev => [...prev, conn.peer]);
        });

        setOnData((data, conn) => {
            if (data.type === 'START_GAME') {
                setGameStatus('playing');
                setIsMultiplayer(true);
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
                        // Apply move
                        const newBoard = placePiece(board, shape, position, player.color);
                        const newPlayers = [...players];
                        newPlayers[playerIndex] = {
                            ...player,
                            pieces: player.pieces.filter(p => p.id !== pieceId)
                        };

                        setBoard(newBoard);
                        setPlayers(newPlayers);

                        // Next turn
                        const nextIdx = nextTurnIndex(newPlayers, playerIndex);
                        setCurrentPlayerIndex(nextIdx);

                        // Broadcast
                        broadcastUpdate(newBoard, newPlayers, nextIdx);
                    }
                }
            }
        });
    }, [isHost, players, board, currentPlayerIndex, peerId]);

    const nextTurnIndex = (currentPlayers: Player[], currentIndex: number) => {
        let nextIndex = (currentIndex + 1) % 4;
        let attempts = 0;
        while (currentPlayers[nextIndex].hasPassed && attempts < 4) {
            nextIndex = (nextIndex + 1) % 4;
            attempts++;
        }
        if (attempts === 4) {
            setGameStatus('finished');
            setIsResultModalOpen(true);
        }
        return nextIndex;
    };

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
    }, [currentPlayerIndex, gameStatus, board, players, isHost, isMultiplayer]);

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
            // Optimistic update? No, wait for update.
            setSelectedPieceId(null);
        } else {
            // Host or Single Player: Apply locally
            const newBoard = placePiece(board, shape, position, currentPlayer.color);
            const bonusPoints = calculateBonusPoints(shape, position);
            const totalScore = piece.value + bonusPoints;

            setBoard(newBoard);

            const newPlayers = [...players];
            newPlayers[currentPlayerIndex] = {
                ...currentPlayer,
                pieces: currentPlayer.pieces.filter(p => p.id !== piece.id),
                bonusScore: currentPlayer.bonusScore + bonusPoints
            };
            setPlayers(newPlayers);
            setSelectedPieceId(null);
            setRotation(0);
            setIsFlipped(false);

            // Create score popup animation
            // Calculate center position of the placed piece in screen coordinates
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
            // Send PASS message (TODO)
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

    const handleReset = () => {
        playClick();
        setGameStatus('lobby');
        setBoard(createInitialBoard());
        setPlayers([]);
        setIsMultiplayer(false);
        setIsResultModalOpen(false);
    };

    const handleRestart = () => {
        playClick();
        if (isMultiplayer) {
            handleReset();
        } else {
            initSinglePlayer(myPlayerColor);
            setIsResultModalOpen(false);
        }
    };

    const onBoardClick = useCallback((pos: Coordinate) => {
        if (!isMyTurn || !selectedPiece) return;

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
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <Lobby
                    peerId={peerId}
                    isHost={isHost}
                    connectedPlayers={connectedPlayerIds}
                    onHost={(color) => { playClick(); setMyPlayerColor(color); hostGame(); }}
                    onJoin={(id, color) => { playClick(); setMyPlayerColor(color); joinGame(id); }}
                    onStart={startMultiplayerGame}
                    onSinglePlayer={initSinglePlayer}
                />
            </div>
        );
    }

    if (!currentPlayer) return <div className="flex items-center justify-center h-screen text-white">Loading...</div>;

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center p-8 h-screen w-full overflow-hidden relative">

            {/* Top Right Controls */}
            <div className="absolute top-4 right-4 z-10 flex gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="text-slate-400 hover:text-white hover:bg-white/10"
                >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleReset} className="text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                    <RefreshCw className="w-4 h-4 mr-2" /> Quit Game
                </Button>
            </div>

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
                                    setSelectedPieceId(p.id);
                                    setRotation(0);
                                    setIsFlipped(false);
                                }
                            }}
                        />
                    </div>
                    {!isMyTurn && (
                        <div className="text-center text-slate-500 mt-4 flex-shrink-0 italic">
                            Waiting for {CHARACTERS[currentPlayer.color].japaneseName}...
                        </div>
                    )}
                </div>
            </div>

            {/* Game Result Modal */}
            <GameResultModal
                isOpen={isResultModalOpen}
                players={players}
                onPlayAgain={handleRestart}
                onClose={() => setIsResultModalOpen(false)}
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

        </div>
    );
};
