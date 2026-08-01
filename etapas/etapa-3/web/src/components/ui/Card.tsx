type CardProps = { children: React.ReactNode };

export const Card = ({ children }: CardProps) => {
  return (
    <div className="bg-amber-50 p-6 rounded-2xl shadow-lg border-2 border-amber-100 max-w-1/2 min-w-2xl max-sm:min-w-screen">
      {children}
    </div>
  );
};
