interface BudgetSectionProps {
  budgets: { [key: string]: number };
  categoryTotals: { [key: string]: number };
  budgetCategory: string;
  budgetAmount: string;
  setBudgetCategory: (value: string) => void;
  setBudgetAmount: (value: string) => void;
  updateBudget: () => void;
  deleteBudget: (category: string) => void;
}

function BudgetSection({
  budgets,
  categoryTotals,
  budgetCategory,
  budgetAmount,
  setBudgetCategory,
  setBudgetAmount,
  updateBudget,
  deleteBudget,
}: BudgetSectionProps) {
  return (
    <section id="budgets" className="section-panel budget-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Guardrails</span>
          <h2>Budget Limits</h2>
        </div>
      </div>

      <div className="budget-form">
        <input
          type="text"
          aria-label="Budget category"
          placeholder="Category"
          value={budgetCategory}
          onChange={(e) => setBudgetCategory(e.target.value)}
        />

        <input
          type="number"
          aria-label="Budget amount"
          placeholder="Budget Amount"
          value={budgetAmount}
          onChange={(e) => setBudgetAmount(e.target.value)}
        />

        <button onClick={updateBudget}>Save Budget</button>
      </div>

      {Object.keys(budgets).length === 0 && (
        <p className="empty-message">No budgets added yet.</p>
      )}

      <div className="budget-grid">
        {Object.entries(budgets).map(([category, limit]) => {
          const spent = categoryTotals[category] || 0;
          const isOverBudget = spent > limit;
          const percentUsed = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;

          return (
            <div className="budget-card" key={category}>
              <button
                className="delete-budget-button"
                aria-label={`Delete ${category} budget`}
                onClick={() => deleteBudget(category)}
              >
                Remove
              </button>

              <h3>{category}</h3>

              <p>${spent.toFixed(2)} spent</p>
              <small>${limit.toFixed(2)} limit</small>

              <div
                className={`budget-progress ${isOverBudget ? "over-budget" : ""}`}
                aria-hidden="true"
              >
                <span style={{ width: `${percentUsed}%` }} />
              </div>

              <span className={isOverBudget ? "budget-warning" : "budget-safe"}>
                {isOverBudget ? "Over Budget" : "Within Budget"}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default BudgetSection;