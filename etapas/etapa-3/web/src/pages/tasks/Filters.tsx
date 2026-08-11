import type { Status } from '../../types/task';

type FiltersProps = {
  q: string;
  status: string;
  onChange: (key: 'q' | 'status', value: string) => void;
};

const options: { value: '' | Status; label: string }[] = [
  { value: '', label: 'Todas' },
  { value: 'todo', label: 'A fazer' },
  { value: 'doing', label: 'Fazendo' },
  { value: 'done', label: 'Feitas' },
];

export const Filters = ({ q, status, onChange }: FiltersProps) => {
  return (
    <div className="flex gap-2 items-center justify-center p-2">
      <label htmlFor="search">Buscar</label>
      <input
        id="search"
        type="search"
        value={q}
        onChange={(e) => onChange('q', e.target.value)}
        placeholder="Título da tarefa"
      />

      <label htmlFor="status">Status</label>
      <select id="status" value={status} onChange={(e) => onChange('status', e.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
