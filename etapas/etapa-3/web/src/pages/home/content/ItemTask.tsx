import { type Task, type Status } from '../../../types/task';
import { Button } from '../../../components/Button';
import { Typography } from '../../../components/Typography';
import { EditTitleField } from './EditTitleField';

type ItemTaskProps = {
  task: Task;
  isEditing: boolean;
  onEditingChange: (id: string | null) => void;
  onEditTask: (id: string, title: string) => void;
  onChangeTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
};
const statusIcon: Record<Status, string> = { todo: '⬜', doing: '🔨', done: '✅' };

export const ItemTask = ({
  task,
  isEditing,
  onEditingChange,
  onEditTask,
  onChangeTask,
  onDeleteTask,
}: ItemTaskProps) => {
  return (
    <li className="relative flex justify-between items-center bg-amber-100 rounded-lg p-2">
      <div className="flex items-center max-w-20 sm:max-w-65">
        <span aria-hidden="true">{statusIcon[task.status]}</span>
        {isEditing ? (
          <EditTitleField
            initialValue={task.title}
            onSave={(title) => onEditTask(task.id, title)}
            onCancel={() => onEditingChange(null)}
          />
        ) : (
          <button type="button" onClick={() => onEditingChange(task.id)}>
            <Typography variant="descriptionTask">{task.title}</Typography>
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1 items-center">
        <Typography variant="termTask">
          <span aria-hidden="true">📅</span> {task.term ?? 'Sem prazo'}
        </Typography>
        <Button
          aria-label={`Alterar status de ${task.title}`}
          onClick={() => onChangeTask(task.id)}
        >
          Alterar
        </Button>
      </div>
      <div className="absolute top-0 right-0">
        <Button aria-label={`Excluir task de ${task.title}`} onClick={() => onDeleteTask(task.id)}>
          X
        </Button>
      </div>
    </li>
  );
};
