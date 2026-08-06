import { type Task, type Status } from '../../../types/task';
import { Button } from '../../../components/Button';
import { Typography } from '../../../components/Typography';

type ItemTaskProps = { task: Task };
const statusIcon: Record<Status, string> = { todo: '⬜', doing: '🔨', done: '✅' };

export const ItemTask = ({ task }: ItemTaskProps) => {
  return (
    <li className="flex justify-between items-center bg-amber-100 rounded-lg p-2">
      <div className="flex items-center max-w-20 sm:max-w-65">
        <span aria-hidden="true">{statusIcon[task.status]}</span>
        <Typography variant="descriptionTask"> {task.description}</Typography>
      </div>

      <div className="flex flex-col gap-1 items-center">
        <Typography variant="termTask">
          <span aria-hidden="true">📅</span> {task.term ?? 'Sem prazo'}
        </Typography>
        <Button>Alterar</Button>
      </div>
    </li>
  );
};
