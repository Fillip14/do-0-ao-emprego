import styles from './TextField.module.css';

type TextFieldProps = { id: string; label: string };

export const TextField = ({ id, label }: TextFieldProps) => {
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <input id={id} />
    </div>
  );
};
