export function Stats() {
  return (
    <section className="py-16 bg-white dark:bg-black">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="stat-card">
            <p className="text-4xl md:text-5xl  mb-2 text-black dark:text-white">
              5K+
            </p>
            <p className="text-sm text-muted-foreground font-sans">
              Active Users
            </p>
          </div>
          <div className="stat-card">
            <p className="text-4xl md:text-5xl mb-2 text-black dark:text-white">
              12K+
            </p>
            <p className="text-sm text-muted-foreground font-sans">
              Books Shared
            </p>
          </div>
          <div className="stat-card">
            <p className="text-4xl md:text-5xl mb-2 text-black dark:text-white">
              8K+
            </p>
            <p className="text-sm text-muted-foreground font-sans">Exchanges</p>
          </div>
          <div className="stat-card">
            <p className="text-4xl md:text-5xl mb-2 text-black dark:text-white">
              250+
            </p>
            <p className="text-sm text-muted-foreground font-sans">Cities</p>
          </div>
        </div>
      </div>
    </section>
  );
}
