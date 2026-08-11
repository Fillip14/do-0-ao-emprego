import { AlertCircle } from 'lucide-react';
import { Typography } from './Typography';
import { Button } from './Button';
import { useToastActions, useToastState } from '../contexts/ToastContext';

export const Toast = () => {
  const message = useToastState();
  const { dismiss } = useToastActions();

  // A região viva fica sempre no DOM: leitor de tela só anuncia mudança
  // dentro de um aria-live que já existia antes da mensagem chegar.
  return (
    <div role="status" aria-live="polite" className="flex items-center gap-2 justify-center mb-2">
      {message && (
        <>
          <AlertCircle aria-hidden />
          <Typography variant="mediumText">{message}</Typography>
          <Button onClick={dismiss}>Fechar</Button>
        </>
      )}
    </div>
  );
};
