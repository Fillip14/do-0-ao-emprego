import { TextField } from '../ui/TextField';
import { Heading } from '../ui/Heading';
import styles from './EmptyTasks.module.css';

export const EmptyTasks = () => {
  const text = 'Pô amigão, fiz esse app pra tu adicionar umas tarefinhas aí!';
  return (
    <section className={styles.content}>
      <Heading text={text} />
      <TextField id="new-task" label="Adiciona uma tarefa preguiçoso" />
    </section>
  );
};
