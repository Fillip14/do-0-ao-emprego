import { type Task } from '../../types/task';
import { TaskItem } from './TaskItem';
import { TaskSummary } from './TaskSummary';
import { TextField } from '../ui/TextField';
import { Heading } from '../ui/Heading';
import styles from './FilledTasks.module.css';

export type FilledTasksProps = {
  tasks: Task[];
};

export const FilledTasks = ({ tasks }: FilledTasksProps) => {
  const text = 'Essas são as suas tarefas, vamos completar, hein!?';
  return (
    <section className={styles.content}>
      <Heading text={text} />
      <ul className={styles.listTasks}>
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </ul>
      <TaskSummary tasks={tasks} />
      <TextField id="new-task" label="Adicionar mais uma tarefa nessa tua lista gigante?" />
    </section>
  );
};
