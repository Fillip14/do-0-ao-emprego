import { useState } from 'react';

type EditTitleFieldProps = {
  initialValue: string;
  onSave: (title: string) => void;
  onCancel: () => void;
};

export const EditTitleField = ({ initialValue, onSave, onCancel }: EditTitleFieldProps) => {
  const [draft, setDraft] = useState(initialValue);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSave(draft);
    if (e.key === 'Escape') onCancel();
  };

  return (
    <input
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
