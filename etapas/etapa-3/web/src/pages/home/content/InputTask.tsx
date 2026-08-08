import { useState } from 'react';
import { Button } from '../../../components/Button';
import type { Status, TaskForm } from '../../../types/task';
import { Typography } from '../../../components/Typography';
import { TaskField } from '../../../components/TaskField';

type InputTaskProps = { onAddTask: (form: TaskForm) => void };
const emptyForm: TaskForm = { title: '', status: 'todo', term: '' };

export const InputTask = ({ onAddTask }: InputTaskProps) => {
  const [form, setForm] = useState<TaskForm>(emptyForm);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = form.title.trim();
    if (!trimmed) return;
    onAddTask({ ...form, title: trimmed });
    setForm(emptyForm);
    setIsOpen(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      onFocus={() => setIsOpen(true)}
      className="flex w-fit mx-auto gap-2 sticky bottom-0 mt-2 z-1 p-2 bg-amber-200 rounded-xl"
    >
      <div className="flex justify-center items-center flex-wrap gap-2">
        <TaskField
          id="title"
          label="Tarefa"
          placeholder="Titulo da tarefa"
          value={form.title}
          onChange={(value) => setForm((prev) => ({ ...prev, title: value }))}
        />

        {isOpen && (
          <>
            <label htmlFor="task-status">
              <Typography variant="mediumText">Status</Typography>
            </label>
            <select
              id="task-status"
              className="w-27 sm:w-auto text-xs border-2 pb-px border-transparent outline-none focus-visible:border-black pl-3 rounded-full bg-amber-50"
              value={form.status}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as Status }))}
            >
              <option value="todo">A fazer</option>
              <option value="doing">Em andamento</option>
              <option value="done">Feito</option>
            </select>
            <TaskField
              id="term"
              label="Prazo"
              type="date"
              value={form.term}
              onChange={(value) => setForm((prev) => ({ ...prev, term: value }))}
            />
          </>
        )}

        <Button type="submit">Adicionar</Button>
      </div>
    </form>
  );
};
