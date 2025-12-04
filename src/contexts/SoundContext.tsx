"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import useSound from 'use-sound';

interface SoundContextType {
    bgmVolume: number;
    seVolume: number;
    setBgmVolume: (volume: number) => void;
    setSeVolume: (volume: number) => void;
    playClick: () => void;
    playHover: () => void;
    playOpen: () => void;
    playPickup: () => void;
    playRotate: () => void;
    playPlace: () => void;
    playError: () => void;
    playTurnStart: () => void;
    playGameOver: () => void;
    playPieceSpecial: () => void;
    playGameFinish: () => void;
    playLobbyBgm: () => void;
    stopLobbyBgm: () => void;
    playGameBgm: () => void;
    stopGameBgm: () => void;
    playResultBgm: () => void;
    stopResultBgm: () => void;
    playRouletteTick: () => void;
    playDecidedFirst: () => void;
    playStoryBgm: () => void;
    stopStoryBgm: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Volume state (0.0 to 1.0)
    // Initialize from LocalStorage if available, otherwise default
    const [bgmVolume, setBgmVolumeState] = useState(() => {
        if (typeof window === 'undefined') return 0.3;
        const saved = localStorage.getItem('connect-corners-bgm-volume');
        if (saved !== null) return parseFloat(saved);

        // Legacy migration
        const savedMute = localStorage.getItem('connect-corners-sound-muted');
        if (savedMute && JSON.parse(savedMute)) return 0;

        return 0.3;
    });

    const [seVolume, setSeVolumeState] = useState(() => {
        if (typeof window === 'undefined') return 0.5;
        const saved = localStorage.getItem('connect-corners-se-volume');
        if (saved !== null) return parseFloat(saved);

        // Legacy migration
        const savedMute = localStorage.getItem('connect-corners-sound-muted');
        if (savedMute && JSON.parse(savedMute)) return 0;

        return 0.5;
    });

    const setBgmVolume = (vol: number) => {
        setBgmVolumeState(vol);
        localStorage.setItem('connect-corners-bgm-volume', vol.toString());
    };

    const setSeVolume = (vol: number) => {
        setSeVolumeState(vol);
        localStorage.setItem('connect-corners-se-volume', vol.toString());
    };

    // SE Sounds
    const [playClick] = useSound('/sounds/ui_click.mp3', { volume: seVolume });
    const [playHover] = useSound('/sounds/ui_hover.mp3', { volume: seVolume * 0.2 });
    const [playOpen] = useSound('/sounds/ui_open.mp3', { volume: seVolume });

    const [playPickup] = useSound('/sounds/piece_pickup.mp3', { volume: seVolume * 0.8 });
    const [playRotate] = useSound('/sounds/piece_rotate.mp3', { volume: seVolume * 0.8 });
    const [playPlace] = useSound('/sounds/piece_place.mp3', { volume: seVolume });
    const [playError] = useSound('/sounds/piece_error.mp3', { volume: seVolume * 0.6 });
    const [playTurnStart] = useSound('/sounds/turn_start.mp3', { volume: seVolume });
    const [playGameOver] = useSound('/sounds/game_over.mp3', { volume: seVolume });
    const [playPieceSpecial] = useSound('/sounds/piece_special.mp3', { volume: seVolume });
    const [playGameFinish] = useSound('/sounds/game_finish.mp3', { volume: seVolume });
    const [playRouletteTick] = useSound('/sounds/roulette_tick.mp3', { volume: seVolume });
    const [playDecidedFirst] = useSound('/sounds/decided_first.mp3', { volume: seVolume });

    // BGM
    const [activeBgm, setActiveBgm] = useState<'lobby' | 'game' | 'result' | 'story' | null>(null);
    const [previousBgm, setPreviousBgm] = useState<'lobby' | 'game' | 'result' | null>(null);

    // Refs to hold current state for access inside stable callbacks
    const activeBgmRef = React.useRef(activeBgm);
    const previousBgmRef = React.useRef(previousBgm);

    // Helper to update state and ref immediately
    const setActiveBgmHelper = React.useCallback((newState: 'lobby' | 'game' | 'result' | 'story' | null) => {
        console.log(`[SoundContext] setActiveBgm: ${activeBgmRef.current} -> ${newState}`);
        activeBgmRef.current = newState;
        setActiveBgm(newState);
    }, []);

    const setPreviousBgmHelper = React.useCallback((newState: 'lobby' | 'game' | 'result' | null) => {
        console.log(`[SoundContext] setPreviousBgm: ${previousBgmRef.current} -> ${newState}`);
        previousBgmRef.current = newState;
        setPreviousBgm(newState);
    }, []);

    const [playLobbyBgmRaw, { stop: stopLobbyBgmRaw, sound: lobbyBgmSound }] = useSound('/sounds/bgm_lobby.mp3', {
        loop: true,
        volume: bgmVolume
    });

    const [playGameBgmRaw, { stop: stopGameBgmRaw, sound: gameBgmSound }] = useSound('/sounds/bgm_game.mp3', {
        loop: true,
        volume: bgmVolume
    });

    const [playResultBgmRaw, { stop: stopResultBgmRaw, sound: resultBgmSound }] = useSound('/sounds/bgm_result.mp3', {
        loop: true,
        volume: bgmVolume
    });

    const [playStoryBgmRaw, { stop: stopStoryBgmRaw, sound: storyBgmSound }] = useSound('/sounds/story.mp3', {
        loop: true,
        volume: bgmVolume
    });

    const stopAllBgm = React.useCallback(() => {
        stopLobbyBgmRaw();
        stopGameBgmRaw();
        stopResultBgmRaw();
        stopStoryBgmRaw();
    }, [stopLobbyBgmRaw, stopGameBgmRaw, stopResultBgmRaw, stopStoryBgmRaw]);

    const playLobbyBgm = React.useCallback(() => {
        if (activeBgmRef.current === 'lobby') return;
        stopAllBgm();
        playLobbyBgmRaw();
        setActiveBgmHelper('lobby');
    }, [stopAllBgm, playLobbyBgmRaw, setActiveBgmHelper]);

    const stopLobbyBgm = React.useCallback(() => {
        if (activeBgmRef.current === 'lobby') {
            stopLobbyBgmRaw();
            setActiveBgmHelper(null);
        }
    }, [stopLobbyBgmRaw, setActiveBgmHelper]);

    const playGameBgm = React.useCallback(() => {
        if (activeBgmRef.current === 'game') return;
        stopAllBgm();
        playGameBgmRaw();
        setActiveBgmHelper('game');
    }, [stopAllBgm, playGameBgmRaw, setActiveBgmHelper]);

    const stopGameBgm = React.useCallback(() => {
        if (activeBgmRef.current === 'game') {
            stopGameBgmRaw();
            setActiveBgmHelper(null);
        }
    }, [stopGameBgmRaw, setActiveBgmHelper]);

    const playResultBgm = React.useCallback(() => {
        if (activeBgmRef.current === 'result') return;
        stopAllBgm();
        playResultBgmRaw();
        setActiveBgmHelper('result');
    }, [stopAllBgm, playResultBgmRaw, setActiveBgmHelper]);

    const stopResultBgm = React.useCallback(() => {
        if (activeBgmRef.current === 'result') {
            stopResultBgmRaw();
            setActiveBgmHelper(null);
        }
    }, [stopResultBgmRaw, setActiveBgmHelper]);

    const playStoryBgm = React.useCallback(() => {
        if (activeBgmRef.current === 'story') return;

        // Save current BGM as previous if it's not story
        if (activeBgmRef.current) {
            setPreviousBgmHelper(activeBgmRef.current as 'lobby' | 'game' | 'result');
        }

        stopAllBgm();
        playStoryBgmRaw();
        setActiveBgmHelper('story');
    }, [stopAllBgm, playStoryBgmRaw, setActiveBgmHelper, setPreviousBgmHelper]);

    const stopStoryBgm = React.useCallback(() => {
        if (activeBgmRef.current === 'story') {
            stopStoryBgmRaw();
            setActiveBgmHelper(null);

            // Resume previous BGM
            const prev = previousBgmRef.current;
            if (prev === 'lobby') {
                playLobbyBgmRaw();
                setActiveBgmHelper('lobby');
            } else if (prev === 'game') {
                playGameBgmRaw();
                setActiveBgmHelper('game');
            } else if (prev === 'result') {
                playResultBgmRaw();
                setActiveBgmHelper('result');
            }
            setPreviousBgmHelper(null);
        }
    }, [stopStoryBgmRaw, playLobbyBgmRaw, playGameBgmRaw, playResultBgmRaw, setActiveBgmHelper, setPreviousBgmHelper]);

    // Resume Audio Context on interaction
    useEffect(() => {
        const handleInteraction = () => {
            // Check if we expect BGM to be playing but it's not
            if (activeBgmRef.current === 'lobby' && lobbyBgmSound && !lobbyBgmSound.playing()) {
                playLobbyBgmRaw();
            } else if (activeBgmRef.current === 'game' && gameBgmSound && !gameBgmSound.playing()) {
                playGameBgmRaw();
            } else if (activeBgmRef.current === 'result' && resultBgmSound && !resultBgmSound.playing()) {
                playResultBgmRaw();
            } else if (activeBgmRef.current === 'story' && storyBgmSound && !storyBgmSound.playing()) {
                playStoryBgmRaw();
            }
        };

        window.addEventListener('click', handleInteraction);
        window.addEventListener('keydown', handleInteraction);

        return () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
        };
    }, [
        lobbyBgmSound, playLobbyBgmRaw,
        gameBgmSound, playGameBgmRaw,
        resultBgmSound, playResultBgmRaw,
        storyBgmSound, playStoryBgmRaw
    ]);

    // Update running BGM volume when state changes
    useEffect(() => {
        if (lobbyBgmSound) {
            lobbyBgmSound.volume(bgmVolume);
        }
        if (gameBgmSound) {
            gameBgmSound.volume(bgmVolume);
        }
        if (resultBgmSound) {
            resultBgmSound.volume(bgmVolume);
        }
        if (storyBgmSound) {
            storyBgmSound.volume(bgmVolume);
        }
    }, [bgmVolume, lobbyBgmSound, gameBgmSound, resultBgmSound, storyBgmSound]);

    const contextValue = React.useMemo(() => ({
        bgmVolume,
        seVolume,
        setBgmVolume,
        setSeVolume,
        playClick,
        playHover,
        playOpen,
        playPickup,
        playRotate,
        playPlace,
        playError,
        playTurnStart,
        playGameOver,
        playPieceSpecial,
        playGameFinish,
        playLobbyBgm,
        stopLobbyBgm,
        playGameBgm,
        stopGameBgm,
        playResultBgm,
        stopResultBgm,
        playRouletteTick,
        playDecidedFirst,
        playStoryBgm,
        stopStoryBgm,
    }), [
        bgmVolume, seVolume,
        playClick, playHover, playOpen, playPickup, playRotate, playPlace, playError,
        playTurnStart, playGameOver, playPieceSpecial, playGameFinish, playRouletteTick, playDecidedFirst,
        playLobbyBgm, stopLobbyBgm, playGameBgm, stopGameBgm, playResultBgm, stopResultBgm, playStoryBgm, stopStoryBgm
    ]);

    return (
        <SoundContext.Provider value={contextValue}>
            {children}
        </SoundContext.Provider>
    );
};

export const useSoundContext = () => {
    const context = useContext(SoundContext);
    if (context === undefined) {
        throw new Error('useSoundContext must be used within a SoundProvider');
    }
    return context;
};
