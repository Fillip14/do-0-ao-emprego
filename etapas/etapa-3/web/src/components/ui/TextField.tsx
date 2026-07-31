import styles from './TextField.module.css';
import { CustomButton } from './CustomButton';

type TextFieldProps = { id: string; label: string; textButton: string };

export const TextField = ({ id, label, textButton }: TextFieldProps) => {
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <input id={id} />
      <CustomButton>{textButton}</CustomButton>
    </div>
  );
};
