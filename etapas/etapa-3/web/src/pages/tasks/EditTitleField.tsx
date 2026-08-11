import { useEffect, useRef, useState } from 'react';

type EditTitleFieldProps = {
  initialValue: string;
  onSave: (title: string) => void;
  onCancel: () => void;
};

export const EditTitleField = ({ initialValue, onSave, onCancel }: EditTitleFieldProps) => {
  const [draft, setDraft] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  // O autoFocus dá o foco; o select() é o que deixa sobrescrever direto.
  useEffect(() => {
    inputRef.current?.select();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSave(draft);
    if (e.key === 'Escape') onCancel();
  };

  return (
    <input
      ref={inputRef}
      autoFocus
      type="text"
      aria-label="Editar título da tarefa"
      className="w-full text-xs border-2 pb-px border-transparent outline-none focus-visible:border-black pl-3 rounded-full bg-amber-50"
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onKeyDown={handleKeyDown}
    />
  );
};
