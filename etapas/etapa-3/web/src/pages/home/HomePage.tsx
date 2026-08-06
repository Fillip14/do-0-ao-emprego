import { InputTask } from '../../layout/InputTask';
import { Header } from '../../layout/header/Header';
import { Content } from './content';

export const HomePage = () => {
  return (
    <div className="flex flex-col font-sans min-h-dvh w-full bg-amber-600">
      <Header />
      <Content />
      <InputTask />
      <footer></footer>
    </div>
  );
};
