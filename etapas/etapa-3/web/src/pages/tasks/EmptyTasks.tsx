import { Typography } from '../../components/Typography';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

type EmptyTasksProps = {
  filtered: boolean;
  onClear: () => void;
};

export const EmptyTasks = ({ filtered, onClear }: EmptyTasksProps) => {
  if (filtered) {
    return (
      <Card>
        <Typography variant="titleTask">Nenhuma tarefa com esse filtro.</Typography>
        <Button onClick={onClear}>Limpar filtros</Button>
      </Card>
    );
  }

  return (
    <Card>
      <Typography variant="titleTask">Pô amigão, adiciona umas tarefinhas aí!</Typography>
    </Card>
  );
};
