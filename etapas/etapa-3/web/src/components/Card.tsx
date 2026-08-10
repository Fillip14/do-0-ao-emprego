import { classNames } from '../utils/classNames';

type CardProps = React.ComponentProps<'div'>;

export const Card = ({ children, className, ...rest }: CardProps) => {
  return (
    <div
      className={classNames([
        'flex flex-col py-4 px-3 w-50 h-60 sm:w-100 sm:h-120 bg-amber-200 rounded-2xl shadow-lg overflow-y-auto overflow-hidden scrollbar-gutter-both scrollbar-thin scrollbar-thumb-amber-600/40',
        className ?? '',
      ])}
      {...rest}
    >
      {children}
    </div>
  );
};
