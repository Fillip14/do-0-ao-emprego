import { type Task, type Status } from '../../types/task';
import { useState } from 'react';
import { m } from 'motion/react';
import { Button } from '../../components/Button';
import { Typography } from '../../components/Typography';
import { EditTitleField } from './EditTitleField';
import { Link } from 'react-router';
import { enterTransition, exitTransition } from '../../utils/motion';

type ItemTaskProps = {
  task: Task;
  animateLayout: boolean;
  isEditing: boolean;
  onEditingChange: (id: string | null) => void;
  onEditTask: (id: string, title: string) => void;
  onChangeTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
};
const statusIcon: Record<Status, string> = { todo: '⬜', doing: '🔨', done: '✅' };

// Um estado com as fases que existem, em vez de um booleano por fase (T14, tópico 11).
type Gesture = 'idle' | 'dragging' | 'deleting';

// Distância OU velocidade: um empurrão curto e rápido conta tanto quanto um arrasto longo.
const DELETE_OFFSET = 120;
const DELETE_VELOCITY = 500;

export const ItemTask = ({
  task,
  animateLayout,
  isEditing,
  onEditingChange,
  onEditTask,
  onChangeTask,
  onDeleteTask,
}: ItemTaskProps) => {
  const [gesture, setGesture] = useState<Gesture>('idle');

  return (
    <m.li
      // `layoutId` atravessa a troca de coluna: para o React são dois elementos
      // (desmontou de um <ul>, montou em outro), para a lib é o mesmo viajando.
      layout={animateLayout}
      layoutId={task.id}
      // A entrada é só transform: nenhum quadro com o item já no DOM e invisível.
      initial={{ y: -8, scale: 0.98 }}
      animate={{ y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, transition: exitTransition }}
      transition={enterTransition}
      // `false` enquanto apaga: a tarefa já foi, arrastar de novo não faz sentido.
      drag={gesture === 'deleting' ? false : 'x'}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.6}
      dragSnapToOrigin
      whileDrag={{ scale: 1.02 }}
      onDragStart={() => setGesture('dragging')}
      onDragEnd={(_event, info) => {
        const shouldDelete = info.offset.x > DELETE_OFFSET || info.velocity.x > DELETE_VELOCITY;
        setGesture(shouldDelete ? 'deleting' : 'idle');
        if (shouldDelete) onDeleteTask(task.id);
      }}
      // `touch-pan-y`: sem isso o dedo rola a página em vez de arrastar o item.
      className="relative flex justify-between items-center bg-amber-100 rounded-lg p-2 touch-pan-y"
    >
      <div className="flex items-center max-w-20 sm:max-w-65">
        <span aria-hidden="true">{statusIcon[task.status]}</span>
        {isEditing ? (
          <EditTitleField
            initialValue={task.title}
            onSave={(title) => onEditTask(task.id, title)}
            onCancel={() => onEditingChange(null)}
          />
        ) : (
          <div className="flex gap-2">
            <button type="button" onClick={() => onEditingChange(task.id)}>
              <Typography variant="descriptionTask">{task.title}</Typography>
            </button>
            <Link to={`/tasks/${task.id}`}>Abrir</Link>
          </div>
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
    </m.li>
  );
};
