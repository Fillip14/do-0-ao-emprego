import styles from './Heading.module.css';
type HeadingProps = { text: string };

export const Heading = ({ text }: HeadingProps) => {
  return <h2 className={styles.title}>{text}</h2>;
};
