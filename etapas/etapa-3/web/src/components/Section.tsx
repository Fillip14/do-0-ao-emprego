type SectionProps = {
  children: React.ReactNode;
};

export const Section = ({ children }: SectionProps) => {
  return <section className="section">{children}</section>;
};
