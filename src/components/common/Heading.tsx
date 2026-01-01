export type THeadingProps = {
  title: string;
  description?: string;
  className?: string;
};

export const Heading = ({ title, description, className }: THeadingProps) => {
  return (
    <div className={className}>
      <h2 className="text-sm font-bold t sm:text-xl xs:hidden">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};
