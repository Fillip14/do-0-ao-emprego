import { AlertCircle } from 'lucide-react';
import { AnimatePresence, m } from 'motion/react';
import { Typography } from './Typography';
import { Button } from './Button';
import { useToastActions, useToastState } from '../contexts/ToastContext';
import { duration, easing } from '../utils/motion';

export const Toast = () => {
  const message = useToastState();
  const { dismiss } = useToastActions();

  // A região viva fica sempre no DOM: o leitor de tela só anuncia mudança
  // dentro de um aria-live que já existia antes da mensagem chegar.
  return (
    <div role="status" aria-live="polite" className="flex items-center gap-2 justify-center mb-2">
      <AnimatePresence>
        {message && (
          <m.div
            key="toast"
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: duration.fast, ease: easing.enter }}
          >
            <AlertCircle aria-hidden />
            <Typography variant="mediumText">{message}</Typography>
            <Button onClick={dismiss}>Fechar</Button>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};
