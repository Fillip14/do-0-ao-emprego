import { AlertCircle } from 'lucide-react';
import { Card } from '../../components/Card';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';

type ErrorTasksProps = { message: string; onRetry: () => void };

export const ErrorTasks = ({ message, onRetry }: ErrorTasksProps) => {
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
