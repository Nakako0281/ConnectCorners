import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Copy, Gamepad2, Check, HelpCircle, CheckCircle2, Trophy, Edit2, X, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSoundContext } from '@/contexts/SoundContext';
import { ALL_COLORS } from '@/lib/game/constants';
import { PlayerColor } from '@/lib/game/types';
import { CHARACTERS } from '@/lib/game/characters';
import { PieceView } from './Piece';
import { GameControls } from './GameControls';
import { getStats, ACHIEVEMENTS } from '@/lib/achievements';
import { Lock } from 'lucide-react';
import { getUserName, setUserName } from '@/lib/utils/storage';
import { LobbyPlayer } from '@/lib/game/types';

const UNLOCK_CONDITIONS: Record<PlayerColor, string | null> = {
    BLUE: null,
    RED: null,
    GREEN: null,
    YELLOW: null,
    LIGHTBLUE: 'first_win',
    PINK: 'perfect_game',
    ORANGE: 'veteran',
    PURPLE: 'win_streak_5',
    BROWN: 'hidden_high_scorer',
    SILVER: 'hidden_connect_master',
    GOLD: 'hidden_perfect_master',
    BLACK: 'complete_all',
};

const BG_COLOR_MAP: Record<PlayerColor, string> = {
    BLUE: 'bg-blue-500',
    RED: 'bg-red-500',
    GREEN: 'bg-green-500',
    YELLOW: 'bg-yellow-500',
    LIGHTBLUE: 'bg-sky-500',
    PINK: 'bg-pink-500',
    ORANGE: 'bg-orange-500',
    PURPLE: 'bg-purple-500',
    BROWN: 'bg-amber-700',
    SILVER: 'bg-slate-400',
    GOLD: 'bg-yellow-400',
    BLACK: 'bg-slate-900',
};

const SHADOW_COLOR_MAP: Record<PlayerColor, string> = {
    BLUE: '#3b82f6',
    RED: '#ef4444',
    GREEN: '#22c55e',
    YELLOW: '#eab308',
    LIGHTBLUE: '#0ea5e9',
    PINK: '#ec4899',
    ORANGE: '#f97316',
    PURPLE: '#a855f7',
    BROWN: '#b45309',
    SILVER: '#94a3b8',
    GOLD: '#facc15',
    BLACK: '#0f172a',
};

interface LobbyProps {
    peerId: string;
    isHost: boolean;
    connectedPlayers: LobbyPlayer[];
    onHost: (color: PlayerColor) => void;
    onJoin: (hostId: string, color: PlayerColor) => void;
    onStart: () => void;
    onSinglePlayer: (color: PlayerColor) => void;
    onBack: () => void;
    onSelectCharacter: (color: PlayerColor) => void;
    onSetReady: (isReady: boolean) => void;
    myLobbyPlayer: LobbyPlayer | null;
    isConnectedToHost?: boolean;
}

export const Lobby: React.FC<LobbyProps> = ({
    peerId,
    isHost,
    connectedPlayers,
    onHost,
    onJoin,
    onStart,
    onSinglePlayer,
    onBack,
    onSelectCharacter,
    onSetReady,
    myLobbyPlayer,
    isConnectedToHost = false
}) => {
    const [joinId, setJoinId] = useState('');
    const [copied, setCopied] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);

    // User Name State
    const [userName, setUserNameState] = useState('');
    const [isNameSet, setIsNameSet] = useState(false);

    // Calculate allBaseUnlocked


    // Calculate allBaseUnlocked
    const baseAchievementIds = ACHIEVEMENTS.filter(a => !a.isHidden).map(a => a.id);
    const allBaseUnlocked = baseAchievementIds.every(id => unlockedAchievements.includes(id));

    // Streamer Mode: Room ID Visibility
    const [isRoomIdVisible, setIsRoomIdVisible] = useState(false);
    const [isJoinIdVisible, setIsJoinIdVisible] = useState(false);


    // View Mode for Single Player Setup
    const [viewMode, setViewMode] = useState<'menu' | 'single_player_setup'>('menu');
    const [singlePlayerColor, setSinglePlayerColor] = useState<PlayerColor>('BLUE');

    const { playClick, playOpen, playLobbyBgm, stopLobbyBgm } = useSoundContext();

    React.useEffect(() => {
        const stats = getStats();
        setUnlockedAchievements(stats.unlockedAchievements);

        // Load saved name
        const savedName = getUserName();
        if (savedName) {
            setUserNameState(savedName);
            setIsNameSet(true);
        }
    }, []);

    React.useEffect(() => {
        setMounted(true);
        playLobbyBgm();
        return () => {
            stopLobbyBgm();
        };
    }, [playLobbyBgm, stopLobbyBgm]);

    const handleSetUserName = () => {
        if (!userName.trim()) return;
        playClick();
        setUserName(userName.trim());
        setIsNameSet(true);
    };

    const copyToClipboard = () => {
        playClick();
        navigator.clipboard.writeText(isHost ? peerId : joinId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSinglePlayer = () => {
        playClick();
        setViewMode('single_player_setup');
    };

    const handleStartSinglePlayer = () => {
        playClick();
        onSinglePlayer(singlePlayerColor);
    };

    const handleHost = () => {
        playClick();
        onHost('BLUE'); // Initial color, will be changeable in lobby
    };

    const handleJoin = () => {
        playClick();
        onJoin(joinId, 'BLUE'); // Initial color
    };

    const handleStart = () => {
        playClick();
        onStart();
    };

    const handleBack = () => {
        playClick();
        onBack();
    };



    // --- Render Helpers ---

    // 0. Connecting State
    if (isConnectedToHost && connectedPlayers.length === 0) {
        return (
            <div className="relative w-full max-w-md mx-auto flex flex-col items-center justify-center min-h-[80vh] z-10">
                <GameControls />
                <Card className="glass-panel border-0 bg-black/40 text-slate-100 w-full">
                    <CardContent className="flex flex-col items-center gap-6 p-8">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold text-white">Connecting to Lobby...</h2>
                            <p className="text-slate-400">Waiting for host response</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // 1. Name Entry Screen
    if (!isNameSet) {
        const hasSavedName = !!getUserName();

        return (
            <div className="relative w-full max-w-md mx-auto flex flex-col items-center justify-center min-h-[80vh] z-10">
                <GameControls />
                <Card className="glass-panel border-0 bg-black/40 text-slate-100 w-full">
                    <CardContent className="flex flex-col gap-6 p-8">
                        <div className="text-center space-y-2 relative">
                            {hasSavedName && (
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="absolute -top-2 -right-2 text-slate-400 hover:text-white hover:bg-white/10"
                                    onClick={() => setIsNameSet(true)}
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            )}
                            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                                {hasSavedName ? 'Edit Name' : 'Welcome'}
                            </h2>
                            <p className="text-slate-400">Enter your name to start</p>
                        </div>
                        <Input
                            placeholder="Your Name"
                            value={userName}
                            onChange={(e) => setUserNameState(e.target.value)}
                            className="h-12 bg-slate-900/50 border-slate-700 text-center text-lg"
                            maxLength={12}
                        />
                        <Button
                            size="lg"
                            onClick={handleSetUserName}
                            disabled={!userName.trim()}
                            className="w-full h-12 bg-blue-600 hover:bg-blue-500"
                        >
                            Continue
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // 2. Main Lobby (Connected)
    if (peerId && (isHost || connectedPlayers.length > 0)) {
        const allReady = connectedPlayers.length > 0 && connectedPlayers.every(p => p.isReady);
        const canStart = isHost && allReady && connectedPlayers.length >= 1; // At least 1 other player? Or just host?

        return (
            <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[80vh] z-10 p-4">
                {/* Header: Room ID */}
                <div className="absolute top-4 left-4 z-50 flex items-center gap-2 bg-black/40 backdrop-blur-md p-2 rounded-lg border border-white/10">
                    <span className="text-slate-400 text-sm font-mono">ROOM ID:</span>
                    <code className="text-blue-400 font-mono font-bold min-w-[6ch] text-center">
                        {isRoomIdVisible ? (isHost ? peerId : joinId) : '******'}
                    </code>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 text-slate-400 hover:text-white"
                        onClick={() => {
                            playClick();
                            setIsRoomIdVisible(!isRoomIdVisible);
                        }}
                        title={isRoomIdVisible ? "Hide Room ID" : "Show Room ID"}
                    >
                        {isRoomIdVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </Button>
                    <div className="w-px h-4 bg-white/10" />
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 text-slate-400 hover:text-white"
                        onClick={copyToClipboard}
                        title="Copy Room ID"
                    >
                        {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    </Button>
                </div>

                {/* Top Right Controls */}
                <GameControls />

                {/* Player Slots */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-8 mt-16">
                    {[0, 1, 2, 3].map(index => {
                        const player = connectedPlayers[index];
                        return (
                            <div key={index} className={`
                                relative aspect-[3/4] rounded-xl border-2 overflow-hidden transition-all
                                ${player ? 'border-slate-600 bg-slate-800/50' : 'border-dashed border-slate-800 bg-black/20'}
                                ${player?.isReady ? 'ring-2 ring-green-500 ring-offset-2 ring-offset-black' : ''}
                            `}>
                                {player ? (
                                    <>
                                        {/* Character Image */}
                                        {player.color ? (
                                            <img
                                                src={CHARACTERS[player.color].imagePath}
                                                alt={player.color}
                                                className="absolute inset-0 w-full h-full object-cover opacity-80"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-slate-600">
                                                <HelpCircle className="w-12 h-12" />
                                            </div>
                                        )}

                                        {/* Info Overlay */}
                                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-4 pt-12 flex flex-col items-center">
                                            <span className="font-bold text-white text-lg truncate max-w-full">{player.name}</span>
                                            {player.isHost && <span className="text-xs text-yellow-400 font-mono mb-1">HOST</span>}
                                            {player.isReady ? (
                                                <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full font-bold tracking-wider">READY</span>
                                            ) : (
                                                <span className="text-xs text-slate-400 animate-pulse">Selecting...</span>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-600">
                                        <span className="text-sm font-mono">Waiting...</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Character Selection Grid */}
                <div className="w-full max-w-3xl glass-panel p-6 rounded-xl mb-8">
                    <h3 className="text-center text-slate-400 mb-4 uppercase tracking-widest text-sm font-semibold">Select Character</h3>
                    <div className="grid grid-cols-6 gap-3">
                        {ALL_COLORS.map((color) => {
                            const unlockCondition = UNLOCK_CONDITIONS[color];
                            const isLocked = !!(unlockCondition && !unlockedAchievements.includes(unlockCondition));

                            // Check if taken by OTHER players
                            const takenBy = connectedPlayers.find(p => p.color === color && p.id !== myLobbyPlayer?.id);
                            const isTaken = !!takenBy;
                            if (color === 'BLUE') {
                                console.log(`[Lobby] Checking BLUE. MyID: ${myLobbyPlayer?.id}`);
                                console.log(`[Lobby] ConnectedPlayers:`, connectedPlayers);
                                console.log(`[Lobby] TakenBy:`, takenBy);
                            }
                            const isSelected = myLobbyPlayer?.color === color;

                            const achievement = unlockCondition ? ACHIEVEMENTS.find(a => a.id === unlockCondition) : null;

                            // Hide if hidden achievement and not unlocked (unless all base achievements are unlocked)
                            if (achievement?.isHidden && !allBaseUnlocked && isLocked) {
                                return null;
                            }

                            return (
                                <button
                                    key={color}
                                    onClick={() => {
                                        if (!isLocked && !isTaken && !myLobbyPlayer?.isReady) {
                                            playClick();
                                            onSelectCharacter(color);
                                        }
                                    }}
                                    disabled={isLocked || isTaken || myLobbyPlayer?.isReady}
                                    className={`
                                        relative group aspect-square rounded-xl transition-all duration-200
                                        ${isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-black/50 scale-105 z-10' : ''}
                                        ${(isLocked || isTaken) ? 'opacity-40 grayscale cursor-not-allowed' : 'hover:scale-105 opacity-90 hover:opacity-100'}
                                        ${myLobbyPlayer?.isReady ? 'cursor-default' : ''}
                                    `}
                                    style={{
                                        boxShadow: isSelected ? `0 0 15px ${SHADOW_COLOR_MAP[color]}` : 'none'
                                    }}
                                >
                                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                                        <div className={`absolute inset-0 opacity-20 ${BG_COLOR_MAP[color]} mix-blend-overlay`} />
                                        <img
                                            src={CHARACTERS[color].imagePath}
                                            alt={CHARACTERS[color].name}
                                            className="w-full h-full object-cover"
                                        />
                                        {isTaken && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                <span className="text-xs font-bold text-white bg-black/50 px-1 rounded">{takenBy?.name.substring(0, 3)}</span>
                                            </div>
                                        )}
                                        {isLocked && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                <Lock className="w-4 h-4 text-white/50" />
                                            </div>
                                        )}
                                    </div>

                                    {isLocked && (
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-black/90 border border-slate-700 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                            <div className="text-xs font-bold text-yellow-400 mb-1 flex items-center gap-1">
                                                <Lock className="w-3 h-3" />
                                                LOCKED
                                            </div>
                                            {achievement ? (
                                                <>
                                                    <div className="text-xs text-white font-bold">{achievement.title}</div>
                                                    <div className="text-[10px] text-slate-200">{achievement.description}</div>
                                                </>
                                            ) : (
                                                <div className="text-xs text-slate-400">Unknown condition</div>
                                            )}
                                            {/* Arrow */}
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/90" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <Button
                        variant="ghost"
                        size="lg"
                        onClick={handleBack}
                        className="h-14 px-8 border-slate-800 bg-slate-800 hover:bg-slate-600 text-slate-200"
                    >
                        Leave
                    </Button>

                    <Button
                        size="lg"
                        onClick={() => {
                            playClick();
                            onSetReady(!myLobbyPlayer?.isReady);
                        }}
                        disabled={!myLobbyPlayer?.color}
                        className={`h-14 px-12 text-lg font-bold transition-all ${myLobbyPlayer?.isReady
                            ? 'bg-yellow-600 hover:bg-yellow-500 text-white'
                            : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                            }`}
                    >
                        {myLobbyPlayer?.isReady ? 'Cancel Ready' : 'Ready!'}
                    </Button>

                    {isHost && (
                        <Button
                            size="lg"
                            onClick={handleStart}
                            disabled={!canStart} // Needs logic: at least 2 players? or just host ready?
                            className={`h-14 px-12 text-lg font-bold transition-all ${canStart
                                ? 'bg-green-600 hover:bg-green-500 shadow-lg shadow-green-900/20 animate-pulse'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                }`}
                        >
                            Start Game
                        </Button>
                    )}
                </div>
            </div>
        );
    }



    // 3. Single Player Setup
    if (viewMode === 'single_player_setup') {
        return (
            <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[80vh] z-10 p-4">
                <GameControls />
                <div className="w-full max-w-3xl glass-panel p-6 rounded-xl mb-8">
                    <h2 className="text-3xl font-bold text-center text-white mb-2">キャラクター選択</h2>
                    <p className="text-center text-slate-400 mb-8">好きなキャラクターを選ぼう</p>

                    <div className="grid grid-cols-6 gap-3">
                        {ALL_COLORS.map((color) => {
                            const unlockCondition = UNLOCK_CONDITIONS[color];
                            const isLocked = !!(unlockCondition && !unlockedAchievements.includes(unlockCondition));
                            const isSelected = singlePlayerColor === color;

                            const achievement = unlockCondition ? ACHIEVEMENTS.find(a => a.id === unlockCondition) : null;

                            // Hide if hidden achievement and not unlocked (unless all base achievements are unlocked)
                            if (achievement?.isHidden && !allBaseUnlocked && isLocked) {
                                return null;
                            }

                            return (
                                <button
                                    key={color}
                                    onClick={() => {
                                        if (!isLocked) {
                                            playClick();
                                            setSinglePlayerColor(color);
                                        }
                                    }}
                                    disabled={isLocked}
                                    className={`
                                        relative group aspect-square rounded-xl transition-all duration-200
                                        ${isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-black/50 scale-105 z-10' : ''}
                                        ${isLocked ? 'opacity-40 grayscale cursor-not-allowed' : 'hover:scale-105 opacity-90 hover:opacity-100'}
                                    `}
                                    style={{
                                        boxShadow: isSelected ? `0 0 15px ${SHADOW_COLOR_MAP[color]}` : 'none'
                                    }}
                                >
                                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                                        <div className={`absolute inset-0 opacity-20 ${BG_COLOR_MAP[color]} mix-blend-overlay`} />
                                        <img
                                            src={CHARACTERS[color].imagePath}
                                            alt={CHARACTERS[color].name}
                                            className="w-full h-full object-cover"
                                        />
                                        {isLocked && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                <Lock className="w-4 h-4 text-white/50" />
                                            </div>
                                        )}
                                    </div>

                                    {isLocked && (
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-black border border-slate-700 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                            <div className="text-xs font-bold text-yellow-400 mb-1 flex items-center gap-1">
                                                <Lock className="w-3 h-3" />
                                                LOCKED
                                            </div>
                                            {achievement ? (
                                                <>
                                                    <div className="text-xs text-white font-bold">{achievement.title}</div>
                                                    <div className="text-[10px] text-slate-200">{achievement.description}</div>
                                                </>
                                            ) : (
                                                <div className="text-xs text-slate-400">Unknown condition</div>
                                            )}
                                            {/* Arrow */}
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/90" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Selected Character Preview & Actions */}
                <div className="flex flex-col items-center gap-8 w-full max-w-md">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-white mb-1">{CHARACTERS[singlePlayerColor].japaneseName}</h3>
                        <p className="text-slate-400 text-sm mb-6">{CHARACTERS[singlePlayerColor].name}</p>

                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex flex-col items-center gap-2">
                            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Special Piece</span>
                            <div className="p-2 h-[140px] flex items-center justify-center">
                                <PieceView
                                    shape={CHARACTERS[singlePlayerColor].specialPieceShape}
                                    color={singlePlayerColor}
                                    cellSize={24}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 w-full">
                        <Button
                            variant="ghost"
                            size="lg"
                            onClick={() => {
                                playClick();
                                setViewMode('menu');
                            }}
                            className="flex-1 h-14 px-8 border-slate-800 bg-slate-800 hover:bg-slate-600 text-slate-200"
                        >
                            Back
                        </Button>

                        <Button
                            size="lg"
                            onClick={handleStartSinglePlayer}
                            className="flex-[2] h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-lg shadow-blue-900/20"
                        >
                            Start Game
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // 4. Initial Entry (Host/Join/Single)
    return (
        <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[80vh] z-10">
            <GameControls />
            {/* ... (Keep existing background elements and title) ... */}
            {mounted && (
                <div className="inset-0 overflow-hidden pointer-events-none -z-10">
                    {[...Array(15)].map((_, i) => (
                        <BackgroundPiece key={i} index={i} />
                    ))}
                </div>
            )}

            {/* Title */}
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="text-center mb-12 mt-20 md:mt-0"
            >
                <img src="title_logo.png" alt="Title Logo" />
                <p className="text-slate-400 mt-4 text-xl flex items-center justify-center gap-3">
                    <span>Welcome, <span className="text-white font-bold">{userName}</span></span>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                        onClick={() => {
                            playClick();
                            setIsNameSet(false);
                        }}
                    >
                        <Edit2 className="w-4 h-4" />
                    </Button>
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="glass-panel border-0 bg-black/40 text-slate-100">
                    <CardContent className="flex flex-col gap-6 p-8">
                        <Button
                            size="lg"
                            onClick={handleSinglePlayer}
                            className="w-full h-16 text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 border-0 shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02]"
                        >
                            <Gamepad2 className="w-6 h-6 mr-3" />
                            Single Player
                        </Button>

                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-slate-700"></div>
                            <span className="flex-shrink-0 mx-4 text-slate-500 text-sm font-mono">MULTIPLAYER</span>
                            <div className="flex-grow border-t border-slate-700"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={handleHost}
                                className="h-14 border-slate-700 bg-slate-800/50 hover:bg-slate-700 hover:text-white transition-all"
                            >
                                <Users className="w-5 h-5 mr-2" />
                                Host Game
                            </Button>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Input
                                        type={isJoinIdVisible ? "text" : "password"}
                                        placeholder="Room ID"
                                        value={joinId}
                                        onChange={(e) => setJoinId(e.target.value)}
                                        className="h-14 bg-slate-900/50 border-slate-700 text-slate-100 placeholder:text-slate-600 pr-10"
                                    />
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10"
                                        onClick={() => {
                                            playClick();
                                            setIsJoinIdVisible(!isJoinIdVisible);
                                        }}
                                        title={isJoinIdVisible ? "Hide Room ID" : "Show Room ID"}
                                    >
                                        {isJoinIdVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </Button>
                                </div>
                                <Button
                                    size="lg"
                                    onClick={handleJoin}
                                    disabled={!joinId}
                                    className="h-14 px-4 bg-slate-700 hover:bg-slate-600"
                                >
                                    Join
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* ... (Keep existing modals) ... */}
        </div>
    );
};

// Component for background piece to avoid inline Math.random in render
const BackgroundPiece = ({ index }: { index: number }) => {
    // Generate random values once on mount
    const [initialState] = useState(() => ({
        x: Math.random() * 1000 - 500,
        y: Math.random() * 1000 - 500,
        scale: Math.random() * 0.5 + 0.5,
        duration: 20 + Math.random() * 10
    }));

    return (
        <motion.div
            className="absolute opacity-10"
            initial={{
                x: initialState.x,
                y: initialState.y,
                rotate: 0,
                scale: initialState.scale
            }}
            animate={{
                y: [0, -100, 0],
                rotate: [0, 360],
            }}
            transition={{
                duration: initialState.duration,
                repeat: Infinity,
                ease: "linear"
            }}
        >
            <div className={`w-16 h-16 ${['bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-yellow-500'][index % 4]} rounded-md`} />
        </motion.div>
    );
};
