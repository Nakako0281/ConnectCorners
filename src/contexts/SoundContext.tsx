"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import useSound from 'use-sound';

interface SoundContextType {
    isMuted: boolean;
    toggleMute: () => void;
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
    const [isMuted, setIsMuted] = useState(false);

    // Load mute state from local storage
    useEffect(() => {
        const savedMute = localStorage.getItem('blocks-sound-muted');
        if (savedMute) {
            setIsMuted(JSON.parse(savedMute));
        }
    }, []);

    const toggleMute = () => {
        setIsMuted(prev => {
            const newState = !prev;
            localStorage.setItem('blocks-sound-muted', JSON.stringify(newState));
            return newState;
        });
    };

    const soundOptions = { soundEnabled: !isMuted };

    // UI Sounds
    const [playClick] = useSound('/sounds/ui_click.mp3', { ...soundOptions, volume: 0.5 });
    const [playHover] = useSound('/sounds/ui_hover.mp3', { ...soundOptions, volume: 0.1 }); // Lower volume for hover
    const [playOpen] = useSound('/sounds/ui_open.mp3', { ...soundOptions, volume: 0.5 });

    // Game Sounds
    const [playPickup] = useSound('/sounds/piece_pickup.mp3', { ...soundOptions, volume: 0.4 });
    const [playRotate] = useSound('/sounds/piece_rotate.mp3', { ...soundOptions, volume: 0.4 });
    const [playPlace] = useSound('/sounds/piece_place.mp3', { ...soundOptions, volume: 0.6 });
    const [playError] = useSound('/sounds/piece_error.mp3', { ...soundOptions, volume: 0.3 });
    const [playTurnStart] = useSound('/sounds/turn_start.mp3', { ...soundOptions, volume: 0.5 });
    const [playGameOver] = useSound('/sounds/game_over.mp3', { ...soundOptions, volume: 0.6 });
    // BGM
    const [playLobbyBgm, { stop: stopLobbyBgm }] = useSound('/sounds/bgm_lobby.mp3', { ...soundOptions, loop: true, volume: 0.3 });
    const [playGameBgm, { stop: stopGameBgm }] = useSound('/sounds/bgm_game.mp3', { ...soundOptions, loop: true, volume: 0.3 });

    return (
        <SoundContext.Provider value={{
            isMuted,
            toggleMute,
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
