import { type Task } from '../../types/task';
import { TaskItem } from './TaskItem';
import { Section } from '../Section';
import { AddTaskField } from './AddTaskField';
import { TaskSummary } from './TaskSummary';

export type TaskListProps = {
  tasks: Task[];
};

export const TaskList = ({ tasks }: TaskListProps) => {
  return (
    <Section>
      <p>Essas são as suas tarefas, completar-las-emos vagabundo?</p>
      <ul className="task-list">
        <li className="task-header">
          <span>Status</span>
          <span>Tarefa</span>
          <span>Previsão</span>
          <span>Alterar status</span>
        </li>
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </ul>
      <TaskSummary tasks={tasks} />
      <AddTaskField text="Adicionar mais uma tarefa nessa tua lista gigante?" />
    </Section>
  );
};
