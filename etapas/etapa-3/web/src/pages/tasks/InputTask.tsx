import { useState } from 'react';
import { Button } from '../../components/Button';
import type { FieldErrors, Status, TaskForm } from '../../types/task';
import { Typography } from '../../components/Typography';
import { TaskField } from '../../components/TaskField';
import { validateTaskForm } from '../../utils/taskRules';
import { ApiError } from '../../api/http';

type InputTaskProps = { onAddTask: (form: TaskForm) => Promise<void> };
const emptyForm: TaskForm = { title: '', status: 'todo', term: '' };

export const InputTask = ({ onAddTask }: InputTaskProps) => {
  const [form, setForm] = useState<TaskForm>(emptyForm);
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const errorInput = validateTaskForm(form);
    if (Object.keys(errorInput).length > 0) {
      setErrors(errorInput);
      return;
    }

    setErrors({});
    setFormError(null);

    setIsSubmitting(true);
    try {
      await onAddTask({ ...form, title: form.title.trim() });
      setForm(emptyForm);
      setIsOpen(false);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Não conseguimos falar com o servidor.');
    } finally {
      setIsSubmitting(false);
    }
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
          error={errors.title}
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
        {formError && (
          <Typography variant="mediumText" aria-live="polite">
            {formError}
          </Typography>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adicionando…' : 'Adicionar'}
        </Button>
      </div>
    </form>
  );
};
