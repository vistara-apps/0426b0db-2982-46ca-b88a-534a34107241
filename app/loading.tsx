import { Activity } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Skeleton */}
      <div className="glass-card border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center animate-glow">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-textPrimary">HealthSync</h1>
                <p className="text-xs text-textSecondary">Loading...</p>
              </div>
            </div>
            <div className="hidden md:flex space-x-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton h-10 w-24 rounded-lg" />
              ))}
            </div>
            <div className="skeleton h-10 w-32 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8 animate-fadeIn">
          {/* Welcome Section Skeleton */}
          <div className="glass-card p-6 rounded-lg shimmer">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="skeleton-title mb-2" />
                <div className="skeleton-text w-2/3" />
              </div>
              <div className="skeleton h-12 w-32 rounded-lg" />
            </div>
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-card p-6 rounded-lg shimmer">
                <div className="flex items-center justify-between mb-4">
                  <div className="skeleton h-8 w-8 rounded-lg" />
                  <div className="skeleton h-4 w-16 rounded" />
                </div>
                <div className="skeleton h-8 w-20 rounded mb-2" />
                <div className="skeleton-text w-3/4" />
              </div>
            ))}
          </div>

          {/* Chart Section Skeleton */}
          <div className="glass-card p-6 rounded-lg shimmer">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="skeleton h-6 w-48 rounded mb-2" />
                <div className="skeleton-text w-1/3" />
              </div>
              <div className="skeleton h-10 w-24 rounded-lg" />
            </div>
            <div className="skeleton h-64 w-full rounded-lg" />
          </div>

          {/* Recent Activity Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-lg shimmer">
              <div className="skeleton h-6 w-40 rounded mb-4" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="skeleton-avatar" />
                    <div className="flex-1">
                      <div className="skeleton h-4 w-3/4 rounded mb-2" />
                      <div className="skeleton h-3 w-1/2 rounded" />
                    </div>
                    <div className="skeleton h-6 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 rounded-lg shimmer">
              <div className="skeleton h-6 w-32 rounded mb-4" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="skeleton h-4 w-4 rounded" />
                      <div className="skeleton h-4 w-32 rounded" />
                    </div>
                    <div className="skeleton h-4 w-16 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        <div className="fixed bottom-8 right-8">
          <div className="glass-card p-4 rounded-lg shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-textSecondary">Loading your health data...</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
