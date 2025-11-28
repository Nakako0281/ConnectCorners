import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Copy, Gamepad2, Check, HelpCircle, Volume2, VolumeX, CheckCircle2, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSoundContext } from '@/contexts/SoundContext';
import { ALL_COLORS } from '@/lib/game/constants';
import { PlayerColor } from '@/lib/game/types';
import { CHARACTERS } from '@/lib/game/characters';
import { PieceView } from './Piece';
import { HowToPlayModal } from './HowToPlayModal';
import { AchievementModal } from './AchievementModal';

interface LobbyProps {
    peerId: string;
    isHost: boolean;
    connectedPlayers: string[]; // List of connected peer IDs or names
    onHost: (color: PlayerColor) => void;
    onJoin: (hostId: string, color: PlayerColor) => void;
    onStart: () => void;
    onSinglePlayer: (color: PlayerColor) => void;
}

export const Lobby: React.FC<LobbyProps> = ({
    peerId,
    isHost,
    connectedPlayers,
    onHost,
    onJoin,
    onStart,
    onSinglePlayer
}) => {
    const [joinId, setJoinId] = useState('');
    const [copied, setCopied] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
    const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
    const [selectedColor, setSelectedColor] = useState<PlayerColor>('BLUE');
    const { isMuted, toggleMute, playClick, playOpen, playLobbyBgm, stopLobbyBgm } = useSoundContext();

    React.useEffect(() => {
        setMounted(true);
        playLobbyBgm();
        return () => {
            stopLobbyBgm();
        };
    }, [playLobbyBgm, stopLobbyBgm]);

    const copyToClipboard = () => {
        playClick();
        navigator.clipboard.writeText(peerId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSinglePlayer = () => {
        playClick();
        onSinglePlayer(selectedColor);
    };

    const handleHost = () => {
        playClick();
        onHost(selectedColor);
    };

    const handleJoin = () => {
        playClick();
        onJoin(joinId, selectedColor);
    };

    const handleStart = () => {
        playClick();
        onStart();
    };

    const handleOpenHowToPlay = () => {
        playOpen();
        setIsHowToPlayOpen(true);
    };

    const handleOpenAchievements = () => {
        playOpen();
        setIsAchievementsOpen(true);
    };

    return (
        <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[80vh] z-10">
            {/* Animated Background Elements (Floating Pieces) - Client Only */}
            {mounted && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                    {[...Array(15)].map((_, i) => (
                        <BackgroundPiece key={i} index={i} />
                    ))}
                </div>
            )}

            {/* Top Right Controls */}
            <div className="absolute top-0 right-0 p-4 flex gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="text-slate-400 hover:text-white hover:bg-white/10"
                >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleOpenAchievements}
                    className="text-slate-400 hover:text-white hover:bg-white/10 gap-2"
                >
                    <Trophy className="w-5 h-5" />
                    <span className="hidden sm:inline">Trophies</span>
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleOpenHowToPlay}
                    className="text-slate-400 hover:text-white hover:bg-white/10 gap-2"
                >
                    <HelpCircle className="w-5 h-5" />
                    <span className="hidden sm:inline">How to Play</span>
                </Button>
            </div>

            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="text-center mb-12"
            >
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 drop-shadow-2xl filter">
                    CONNECT
                    <br />
                    CORNERS
                </h1>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="glass-panel border-0 bg-black/40 text-slate-100">
                    <CardContent className="flex flex-col gap-6 p-8">
                        {!isHost && !connectedPlayers.length ? (
                            <>
                                {/* Character Selection */}
                                <div className="space-y-4">
                                    <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">Select Your Character</label>

                                    {/* Selected Character Preview */}
                                    <div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 border-white/10">
                                            <img
                                                src={CHARACTERS[selectedColor].imagePath}
                                                alt={CHARACTERS[selectedColor].name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-xl font-bold text-white">{CHARACTERS[selectedColor].japaneseName}</h3>
                                                <span className="text-xs font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700">
                                                    {CHARACTERS[selectedColor].name}
                                                </span>
                                            </div>

                                            <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                                                <div className="text-xs text-slate-400 mb-2 uppercase tracking-wider font-semibold">Special Piece</div>
                                                <div className="flex justify-center h-[80px] items-center">
                                                    <PieceView
                                                        shape={CHARACTERS[selectedColor].specialPieceShape}
                                                        color={selectedColor}
                                                        cellSize={16}
                                                        className="drop-shadow-lg"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Character Grid */}
                                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                                        {ALL_COLORS.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => { playClick(); setSelectedColor(color); }}
                                                className={`
                                                    relative group aspect-square rounded-xl overflow-hidden transition-all duration-300
                                                    ${selectedColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-black/50 scale-105 z-10' : 'hover:scale-105 opacity-60 hover:opacity-100'}
                                                `}
                                                style={{
                                                    boxShadow: selectedColor === color ? `0 0 15px var(--color-${color.toLowerCase()}-500, ${color.toLowerCase()})` : 'none'
                                                }}
                                            >
                                                <div className={`absolute inset-0 opacity-20 bg-${color.toLowerCase()}-500 mix-blend-overlay`} />
                                                <img
                                                    src={CHARACTERS[color].imagePath}
                                                    alt={CHARACTERS[color].name}
                                                    className="w-full h-full object-cover"
                                                />
                                                {selectedColor === color && (
                                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                                        <CheckCircle2 className="w-5 h-5 text-white drop-shadow-md" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="h-px bg-slate-800/50 w-full" />
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
                                        <Input
                                            placeholder="Room ID"
                                            value={joinId}
                                            onChange={(e) => setJoinId(e.target.value)}
                                            className="h-14 bg-slate-900/50 border-slate-700 text-slate-100 placeholder:text-slate-600"
                                        />
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
                            </>
                        ) : (
                            <div className="flex flex-col gap-6 items-center py-4">
                                <div className="text-center space-y-2">
                                    <h3 className="text-xl font-bold text-slate-200">Lobby</h3>
                                    <div className="flex items-center justify-center gap-2 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                                        <code className="text-blue-400 font-mono text-lg tracking-wider">{peerId}</code>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-slate-400 hover:text-white"
                                            onClick={copyToClipboard}
                                        >
                                            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                        </Button>
                                    </div>
                                    <p className="text-sm text-slate-500">Share this ID with your friends</p>
                                </div>

                                <div className="w-full space-y-3">
                                    <div className="flex justify-between items-center text-sm text-slate-400 px-1">
                                        <span>Players</span>
                                        <span>{connectedPlayers.length + 1}/4</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-lg border border-slate-700/30">
                                            <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                            <span className="font-medium text-slate-200">You (Host)</span>
                                        </div>
                                        {connectedPlayers.map((pid, idx) => (
                                            <div key={pid} className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-lg border border-slate-700/30">
                                                <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                                <span className="font-medium text-slate-200">Player {idx + 2}</span>
                                            </div>
                                        ))}
                                        {[...Array(3 - connectedPlayers.length)].map((_, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 border border-dashed border-slate-800 rounded-lg opacity-50">
                                                <div className="w-3 h-3 rounded-full bg-slate-700" />
                                                <span className="text-slate-500 italic">Waiting...</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {isHost && (
                                    <Button
                                        size="lg"
                                        onClick={handleStart}
                                        className="w-full h-14 text-lg font-bold bg-green-600 hover:bg-green-500 shadow-lg shadow-green-900/20 mt-2"
                                    >
                                        Start Game
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            <HowToPlayModal isOpen={isHowToPlayOpen} onClose={() => setIsHowToPlayOpen(false)} />
            <AchievementModal isOpen={isAchievementsOpen} onClose={() => setIsAchievementsOpen(false)} />
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
