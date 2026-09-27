export default function LoadingSkeleton({ type = 'dashboard' }: { type?: 'dashboard' | 'table' | 'cards' | 'chart' }) {
  if (type === 'table') {
    return (
      <div className="glass-card p-6 space-y-4 animate-pulse">
        <div className="h-6 bg-dark-800 rounded-lg w-1/4" />
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 bg-dark-800/60 rounded-xl w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card p-6 h-32 space-y-3">
            <div className="h-4 bg-dark-800 rounded w-1/2" />
            <div className="h-8 bg-dark-700 rounded w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className="glass-card p-6 h-80 flex flex-col justify-between animate-pulse">
        <div className="h-6 bg-dark-800 rounded w-1/3" />
        <div className="h-56 bg-dark-800/40 rounded-xl w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 bg-dark-800 rounded-lg w-64" />
          <div className="h-4 bg-dark-800/60 rounded w-96" />
        </div>
        <div className="h-10 bg-dark-800 rounded-xl w-32" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card p-6 h-32 space-y-3">
            <div className="h-4 bg-dark-800 rounded w-1/2" />
            <div className="h-8 bg-dark-700 rounded w-3/4" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 h-80" />
        <div className="glass-card p-6 h-80" />
      </div>
    </div>
  );
}
