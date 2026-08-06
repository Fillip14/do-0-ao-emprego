import { Typography } from '../../components/Typography';
import { classNames } from '../../utils/classNames';
import { Menu } from 'lucide-react';

export const Header = () => {
  return (
    <>
      <header
        className={classNames([
          'sticky top-0',
          'flex items-center pl-2 gap-2 py-1 mb-2',
          'z-10 min-h-14 w-full',
          'bg-amber-300 border-none outline-none rounded-b-sm',
        ])}
      >
        <button
          type="button"
          className="border-2 border-transparent outline-none focus-visible:border-black rounded-md cursor-pointer active:bg-amber-200"
          aria-label="Menu"
        >
          <Menu className="size-9 sm:size-10" />
        </button>
        <div>
          <Typography variant="titleHeader">Notations</Typography>
          <Typography variant="bodyHeader">Sua ferramenta de anotacões</Typography>
        </div>
      </header>
    </>
  );
};
