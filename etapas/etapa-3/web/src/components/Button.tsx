import { classNames } from '../utils/classNames';

type ButtonProps = React.ComponentProps<'button'>;

export const Button = ({ children, ...rest }: ButtonProps) => {
  return (
    <button
      type="button"
      className={classNames([
        'flex',
        'rounded-full',
        'px-2 py-1',
        'cursor-pointer',
        'border-2 outline-none border-transparent',
        'focus-visible:border-black',
        'bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300',
        'text-xs',
      ])}
      {...rest}
    >
      {children}
    </button>
  );
};
/* 
altura:
grande 40px
medio 36px
pequeno 32px
mini 24px

padding 2:1
border-radius
cor da borda
sombreamento
feedback mouse hover
feedback mouse press

*/
