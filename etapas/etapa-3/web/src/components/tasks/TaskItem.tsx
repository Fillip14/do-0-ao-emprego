import { type Task, type Status } from '../../types/task';
import styles from './TaskItem.module.css';

type TasksItemProps = { task: Task };
const statusIcon: Record<Status, string> = { todo: '⬜', doing: '🔨', done: '✅' };
const statusLabel: Record<Status, string> = {
  todo: 'A fazer',
  doing: 'Em andamento',
  done: 'Concluída',
};

export const TaskItem = ({ task }: TasksItemProps) => {
  return (
    <li className={styles.li}>
      <span role="img" aria-label={statusLabel[task.status]}>
        {statusIcon[task.status]}
      </span>
      <span className={styles.title}>{task.title}</span>
      <span>
        <span role="img" aria-label="Prazo">
          📅
        </span>{' '}
        {task.term ?? 'Sem prazo'}
      </span>
      <button>Change</button>
    </li>
  );
};
