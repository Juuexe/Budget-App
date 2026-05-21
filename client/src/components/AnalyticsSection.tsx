interface AnalyticsSectionProps {
  categoryTotals: { [key: string]: number };
}

function AnalyticsSection({ categoryTotals }: AnalyticsSectionProps) {
  return (
    <div id="analytics" className="analytics-section">
      <h2>Category Analytics</h2>

      <div className="analytics-grid">
        {Object.entries(categoryTotals).map(([category, total]) => (
          <div className="analytics-card" key={category}>
            <h3>{category}</h3>
            <p>${total}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnalyticsSection;