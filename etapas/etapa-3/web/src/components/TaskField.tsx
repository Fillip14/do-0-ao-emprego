import { Typography } from './Typography';

const fieldClass =
  'w-27 sm:w-auto text-xs border-2 pb-px border-transparent outline-none focus-visible:border-black pl-3 rounded-full bg-amber-50';

type TaskFieldProps = {
  id: string;
  label: string;
  value: string;
  error?: string | undefined;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
};

export const TaskField = ({
  id,
  label,
  value,
  error,
  onChange,
  type,
  placeholder,
}: TaskFieldProps) => {
  const errorId = `task-${id}-error`;
  return (
    <>
      <label htmlFor={`task-${id}`}>
        <Typography variant="mediumText">{label}</Typography>
      </label>
      <input
        id={`task-${id}`}
        placeholder={placeholder}
        className={fieldClass}
        type={type}
        value={value}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && (
        <p id={errorId} role="alert">
          {error}
        </p>
      )}
    </>
  );
};
