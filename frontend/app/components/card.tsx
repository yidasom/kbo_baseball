interface CardProps {
  title: string;
  children: React.ReactNode;
}

export function Card({ title, children }: CardProps) {
  return (
    <div className="rounded-xl bg-white p-2 shadow-md">
      <div className="p-4">
        <h2 className="mb-4 text-xl font-medium">{title}</h2>
        {children}
      </div>
    </div>
  );
}
