import styles from './CustomButton.module.css';

type CustomButtonProps = React.ComponentProps<'button'>;

export const CustomButton = ({ children, ...rest }: CustomButtonProps) => {
  return (
    <button type="button" {...rest} className={styles.button}>
      {children}
    </button>
  );
};
