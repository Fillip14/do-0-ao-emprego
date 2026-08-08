import { Typography } from './Typography';

const fieldClass =
  'w-27 sm:w-auto text-xs border-2 pb-px border-transparent outline-none focus-visible:border-black pl-3 rounded-full bg-amber-50';

type TaskFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
};

export const TaskField = ({ id, label, value, onChange, type, placeholder }: TaskFieldProps) => {
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
        onChange={(e) => onChange(e.target.value)}
      />
    </>
  );
};
