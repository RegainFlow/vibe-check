export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-indigo-950/50 rounded-lg" />
      <div className="grid md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rpg-panel h-28" />
        ))}
      </div>
      <div className="rpg-panel h-64" />
    </div>
  );
}
