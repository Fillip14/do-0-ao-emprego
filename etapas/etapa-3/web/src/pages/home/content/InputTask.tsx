import { useState } from 'react';
import { Button } from '../../../components/Button';

type InputTaskProps = { onAddTask: (text: string) => void };

export const InputTask = ({ onAddTask }: InputTaskProps) => {
  const [text, setText] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const trimmed = text.trim();
        if (!trimmed) return;
        onAddTask(trimmed);
        setText('');
      }}
      className="flex w-fit mx-auto gap-2 sticky bottom-0 mt-2 z-1 p-2 bg-amber-200 rounded-xl"
    >
      <input
        aria-label="Nova tarefa"
        className="w-27 sm:w-auto text-xs border-2 pb-px border-transparent outline-none focus-visible:border-black pl-3 rounded-full bg-amber-50"
        placeholder="Mais uma tarefinha?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button type="submit" aria-label="Adicionar nova task">
        Adicionar
      </Button>
    </form>
  );
};
