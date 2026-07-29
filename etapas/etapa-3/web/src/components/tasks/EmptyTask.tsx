import { AddTaskField } from './AddTaskField';

export const EmptyTask = () => {
  return (
    <div className="empty-task">
      <p>Pô amigão, fiz esse app pra tu adicionar umas tarrefinhas aí!</p>
      <AddTaskField text="Adiciona uma tarefa preguiçoso" />
    </div>
  );
};
