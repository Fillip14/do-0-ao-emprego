import { type Task, type Status } from '../../types/task';

type TasksItemProps = { task: Task; showTerm?: boolean };
const statusIcon: Record<Status, string> = { todo: '⬜', doing: '🔨', done: '✅' };

export const TaskItem = ({ task, showTerm = true }: TasksItemProps) => {
  return (
    <li className="task-item">
      <span className={`task-${task.status}`}>{statusIcon[task.status]}</span>
      <span className="task-title">{task.title}</span>
      {showTerm && <span className="task-term">{task.term ?? 'Sem prazo'}</span>}
      <button className="change-status">Change</button>
    </li>
  );
};
