export default function DashboardHomePage() {
  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-6 md:gap-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Bem-vindo ao sistema de gestão. Use o menu lateral para navegar entre
          as seções.
        </p>
      </div>
    </div>
  );
}
