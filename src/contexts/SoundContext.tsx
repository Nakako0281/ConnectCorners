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
    playLobbyBgm: () => void;
    stopLobbyBgm: () => void;
    playGameBgm: () => void;
    stopGameBgm: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Volume state (0.0 to 1.0)
    // Initialize from LocalStorage if available, otherwise default
    const [bgmVolume, setBgmVolumeState] = useState(() => {
        if (typeof window === 'undefined') return 0.3;
        const saved = localStorage.getItem('blocks-bgm-volume');
        if (saved !== null) return parseFloat(saved);

        // Legacy migration
        const savedMute = localStorage.getItem('blocks-sound-muted');
        if (savedMute && JSON.parse(savedMute)) return 0;

        return 0.3;
    });

    const [seVolume, setSeVolumeState] = useState(() => {
        if (typeof window === 'undefined') return 0.5;
        const saved = localStorage.getItem('blocks-se-volume');
        if (saved !== null) return parseFloat(saved);

        // Legacy migration
        const savedMute = localStorage.getItem('blocks-sound-muted');
        if (savedMute && JSON.parse(savedMute)) return 0;

        return 0.5;
    });

    const setBgmVolume = (vol: number) => {
        setBgmVolumeState(vol);
        localStorage.setItem('blocks-bgm-volume', vol.toString());
    };

    const setSeVolume = (vol: number) => {
        setSeVolumeState(vol);
        localStorage.setItem('blocks-se-volume', vol.toString());
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

    // BGM
    const [playLobbyBgm, { stop: stopLobbyBgm, sound: lobbyBgmSound }] = useSound('/sounds/bgm_lobby.mp3', {
        loop: true,
        volume: bgmVolume
    });

    const [playGameBgm, { stop: stopGameBgm, sound: gameBgmSound }] = useSound('/sounds/bgm_game.mp3', {
        loop: true,
        volume: bgmVolume
    });

    // Update running BGM volume when state changes
    useEffect(() => {
        if (lobbyBgmSound) {
            lobbyBgmSound.volume(bgmVolume);
        }
        if (gameBgmSound) {
            gameBgmSound.volume(bgmVolume);
        }
    }, [bgmVolume, lobbyBgmSound, gameBgmSound]);

    return (
        <SoundContext.Provider value={{
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
            playLobbyBgm,
            stopLobbyBgm,
            playGameBgm,
            stopGameBgm,
        }}>
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
