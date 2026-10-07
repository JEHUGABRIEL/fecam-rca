import { Loader2Icon, PauseIcon, PlayIcon } from 'lucide-react';
import { useRadio } from '../contexts/RadioContext';

interface RadioPlayButtonProps {
  size?: 'sm' | 'lg';
  tone?: 'blue' | 'orange';
}

export function RadioPlayButton({ size = 'sm', tone = 'blue' }: RadioPlayButtonProps) {
  const { status, toggle } = useRadio();
  const isPlaying = status === 'playing';
  const isLoading = status === 'loading';
  const dims = size === 'lg' ? 'h-20 w-20' : 'h-11 w-11';
  const icon = size === 'lg' ? 'h-8 w-8' : 'h-5 w-5';
  const colors =
  tone === 'blue' ?
  'bg-fecam-black text-white hover:bg-fecam-orange hover:text-fecam-black' :
  'bg-fecam-orange text-fecam-black hover:bg-fecam-paper';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isPlaying || isLoading ? 'Mettre la radio en pause' : 'Écouter Radio FECAM en direct'}
      className={`inline-flex shrink-0 items-center justify-center rounded-full transition-[background-color,color,transform] duration-150 active:scale-95 ${dims} ${colors}`}>
      
      {isLoading ?
      <Loader2Icon className={`${icon} animate-spin`} /> :
      isPlaying ?
      <PauseIcon className={icon} fill="currentColor" /> :

      <PlayIcon className={`${icon} translate-x-0.5`} fill="currentColor" />
      }
    </button>);

}