import { motion } from 'framer-motion';
import { CheckCircle2Icon } from 'lucide-react';

interface FormStatusProps {
  title: string;
  message: string;
  onReset?: () => void;
  resetLabel?: string;
}

export function FormStatus({ title, message, onReset, resetLabel = 'Envoyer un autre message' }: FormStatusProps) {
  return (
    <motion.div
      role="status"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-3xl bg-fecam-sand p-10 text-center">
      
      <CheckCircle2Icon className="mx-auto h-10 w-10 text-fecam-orange" />
      <h3 className="mt-4 font-display text-2xl font-bold">{title}</h3>
      <p className="mt-2 text-fecam-black/65">{message}</p>
      {onReset &&
      <button type="button" onClick={onReset} className="link-draw mt-6">
          {resetLabel}
        </button>
      }
    </motion.div>);

}