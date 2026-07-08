export default function DeskGridView({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {children}
    </div>
  );
}
