interface AnalyticsSectionProps {
  categoryTotals: { [key: string]: number };
}

function AnalyticsSection({ categoryTotals }: AnalyticsSectionProps) {
  return (
    <section id="analytics" className="section-panel analytics-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Insights</span>
          <h2>Category Analytics</h2>
        </div>
      </div>

      <div className="analytics-grid">
        {Object.keys(categoryTotals).length === 0 ? (
          <p className="empty-message">Category totals will appear here.</p>
        ) : (
          Object.entries(categoryTotals).map(([category, total]) => (
            <div className="analytics-card" key={category}>
              <h3>{category}</h3>
              <p>${total.toFixed(2)}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default AnalyticsSection;