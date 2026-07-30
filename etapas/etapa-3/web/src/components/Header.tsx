import styles from './Header.module.css';

export const Header = () => {
  return (
    <header>
      <h1 className={styles.title}>Task Manager</h1>
    </header>
  );
};
