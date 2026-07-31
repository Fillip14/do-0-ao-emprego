import { type Task, type Status } from '../../types/task';
import { CustomButton } from '../ui/CustomButton';
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
      <div className={styles.main}>
        <span role="img" aria-label={statusLabel[task.status]}>
          {statusIcon[task.status]}
        </span>
        <span className={styles.title}>{task.title}</span>
      </div>
      <div className={styles.actions}>
        <span>
          <span role="img" aria-label="Prazo">
            📅
          </span>{' '}
          {task.term ?? 'Sem prazo'}
        </span>
        <CustomButton>Alterar</CustomButton>
      </div>
    </li>
  );
};
