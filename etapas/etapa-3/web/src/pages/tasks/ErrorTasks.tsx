import { AlertCircle } from 'lucide-react';
import { Card } from '../../components/Card';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';

type ErrorTasksProps = { message: string; showcase: boolean; onRetry: () => void };

export const ErrorTasks = ({ message, showcase, onRetry }: ErrorTasksProps) => {
  if (showcase) {
    return (
      <Card role="alert" className="justify-center items-center gap-2">
        <div className="flex items-center justify-center gap-2">
          <AlertCircle aria-hidden />
          <Typography variant="titleTask">Esta é uma demonstração do front-end.</Typography>
        </div>
        <Typography variant="descriptionTask">
          A API deste projeto roda localmente e ainda não está publicada, então a lista de tarefas
          não carrega aqui.
        </Typography>
      </Card>
    );
  }

  return (
    <Card role="alert" className="justify-center items-center gap-2">
      <div className="flex items-center justify-center gap-2">
        <AlertCircle aria-hidden />
        <Typography variant="titleTask">{message}</Typography>
      </div>
      <Button onClick={onRetry}>Tentar de novo</Button>
    </Card>
  );
};
