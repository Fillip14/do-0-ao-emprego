import { type Task } from '../types/task';

export type TasksState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; tasks: Task[] };

export type Action =
  | { type: 'loaded'; tasks: Task[] }
  | { type: 'failed'; message: string }
  | { type: 'created'; task: Task }
  | { type: 'updated'; task: Task }
  | { type: 'removed'; id: string };

export const tasksReducer = (state: TasksState, action: Action): TasksState => {
  switch (action.type) {
    case 'loaded':
      return { status: 'success', tasks: action.tasks };

    case 'failed':
      return { status: 'error', message: action.message };

    case 'created':
      if (state.status !== 'success') return state;
      return { ...state, tasks: [...state.tasks, action.task] };

    case 'updated':
      if (state.status !== 'success') return state;
      return {
        ...state,
        tasks: state.tasks.map((task) => (task.id === action.task.id ? action.task : task)),
      };

    case 'removed':
      if (state.status !== 'success') return state;
      return { ...state, tasks: state.tasks.filter((task) => task.id !== action.id) };

    default:
      action satisfies never; // alarme de compilação: action nova sem case
      return state;
  }
};
