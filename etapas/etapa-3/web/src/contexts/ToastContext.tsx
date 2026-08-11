import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

type ToastActions = {
  show: (message: string) => void;
  dismiss: () => void;
};

// Dois contextos porque as frequências de mudança são opostas:
// a mensagem muda a cada aviso, as ações nunca mudam.
// `undefined` é o padrão de "sem Provider" — `null` é mensagem nenhuma, que é estado válido.
const ToastStateContext = createContext<string | null | undefined>(undefined);
const ToastActionsContext = createContext<ToastActions | null>(null);

const DURATION = 4000;

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const dismiss = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMessage(null);
  }, []);

  const show = useCallback((text: string) => {
    setMessage(text);
    if (timerRef.current) clearTimeout(timerRef.current); // aviso novo mata o timer do anterior
    timerRef.current = window.setTimeout(() => setMessage(null), DURATION);
  }, []);

  // Sem isto o objeto seria novo a cada render do Provider e todo consumidor
  // re-renderizaria por nada — mesmo com show e dismiss idênticos.
  const actions = useMemo(() => ({ show, dismiss }), [show, dismiss]);

  return (
    <ToastActionsContext.Provider value={actions}>
      <ToastStateContext.Provider value={message}>{children}</ToastStateContext.Provider>
    </ToastActionsContext.Provider>
  );
};

export const useToastState = () => {
  const message = useContext(ToastStateContext);
  if (message === undefined) {
    throw new Error('useToastState precisa estar dentro de <ToastProvider>');
  }
  return message;
};

export const useToastActions = () => {
  const actions = useContext(ToastActionsContext);
  if (!actions) {
    throw new Error('useToastActions precisa estar dentro de <ToastProvider>');
  }
  return actions;
};
