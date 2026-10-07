import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { site } from '../data/site';

export type RadioStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

interface RadioContextValue {
  status: RadioStatus;
  volume: number;
  muted: boolean;
  toggle: () => void;
  setVolume: (value: number) => void;
  toggleMute: () => void;
  barVisible: boolean;
  hideBar: () => void;
}

const RadioContext = createContext<RadioContextValue | null>(null);

export function RadioProvider({ children }: {children: React.ReactNode;}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [status, setStatus] = useState<RadioStatus>('idle');
  const [volume, setVolumeState] = useState(0.8);
  const [muted, setMuted] = useState(false);
  // Vrai quand l'utilisateur a fermé le bandeau avec la croix
  const [barDismissed, setBarDismissed] = useState(false);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'none';
    audioRef.current = audio;
    const onPlaying = () => setStatus('playing');
    const onWaiting = () => setStatus('loading');
    const onError = () => setStatus('error');
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('error', onError);
    return () => {
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('error', onError);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
    audioRef.current.muted = muted;
  }, [volume, muted]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (status === 'playing' || status === 'loading') {
      audio.pause();
      setStatus('paused');
      return;
    }
    setStatus('loading');
    // Recharger le flux pour reprendre le direct et non un tampon ancien
    audio.src = site.radioStreamUrl;
    audio.load();
    audio.play().catch((err: Error) => {
      if (err.name !== 'AbortError') setStatus('error');
    });
  }, [status]);

  const setVolume = useCallback((value: number) => {
    setVolumeState(value);
    if (value > 0) setMuted(false);
  }, []);

  const toggleMute = useCallback(() => setMuted((m) => !m), []);

  // Bandeau visible pendant la lecture ou en cas d'erreur de flux, masqué en pause/inactif
  const barActive = status === 'playing' || status === 'loading' || status === 'error';
  const barVisible = barActive && !barDismissed;

  // Si l'utilisateur relance la radio après avoir fermé le bandeau, celui-ci doit réapparaître
  useEffect(() => {
    if (barActive) setBarDismissed(false);
  }, [barActive]);

  const hideBar = useCallback(() => {
    const audio = audioRef.current;
    if (audio && (status === 'playing' || status === 'loading')) {
      audio.pause();
      setStatus('paused');
    }
    setBarDismissed(true);
  }, [status]);

  return (
    <RadioContext.Provider value={{ status, volume, muted, toggle, setVolume, toggleMute, barVisible, hideBar }}>
      {children}
    </RadioContext.Provider>);

}

export function useRadio(): RadioContextValue {
  const ctx = useContext(RadioContext);
  if (!ctx) throw new Error('useRadio doit être utilisé dans RadioProvider');
  return ctx;
}