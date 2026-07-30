import { type Task } from '../../types/task';
import styles from './TaskSummary.module.css';

type TaskSummaryProps = { tasks: Task[] };

export const TaskSummary = ({ tasks }: TaskSummaryProps) => {
  const done = tasks.filter((t) => t.status === 'done').length;
  const doing = tasks.filter((t) => t.status === 'doing').length;
  const todo = tasks.filter((t) => t.status === 'todo').length;
  return (
    <div className={styles.field}>
      {done > 0 && <p className={styles.done}>Meus parabens, você tem {done} tarefas concluída</p>}
      {doing > 0 && (
        <p className={styles.doing}>Vamos lá, força guerreiro, {doing} tarefas para terminar!!</p>
      )}
      {todo > 0 && (
        <p className={styles.todo}>
          Humm olha, {todo} tarefas sem iniciar ainda, ta... tudo bem? Quer conversar?
        </p>
      )}
    </div>
  );
};
