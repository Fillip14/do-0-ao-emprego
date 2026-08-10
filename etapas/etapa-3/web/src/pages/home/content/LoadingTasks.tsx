import { Typography } from '../../../components/Typography';
import { Card } from '../../../components/Card';
import { Loader2 } from 'lucide-react';

export const LoadingTasks = () => {
  return (
    <Card className="flex justify-center items-center gap-2">
      <Loader2 className="animate-spin" />
      <Typography variant="titleTask">Carregando suas tarefas</Typography>
    </Card>
  );
};
