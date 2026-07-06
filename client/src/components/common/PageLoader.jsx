const PageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-950 z-50">
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-2xl bg-primary-600 animate-pulse opacity-20" />
        <div className="absolute inset-2 rounded-xl bg-primary-600 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-white" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-primary-600 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Loading Smart Asset...</p>
    </div>
  </div>
);

export default PageLoader;
