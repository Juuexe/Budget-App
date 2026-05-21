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
    <div id="budgets" className="budget-section">
      <h2>Budget Limits</h2>

      <div className="budget-form">
        <input
          type="text"
          placeholder="Category"
          value={budgetCategory}
          onChange={(e) => setBudgetCategory(e.target.value)}
        />

        <input
          type="number"
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

          return (
            <div className="budget-card" key={category}>
              <button
                className="delete-budget-button"
                onClick={() => deleteBudget(category)}
              >
                ×
              </button>

              <h3>{category}</h3>

              <p>
                ${spent} / ${limit}
              </p>

              <span className={isOverBudget ? "budget-warning" : "budget-safe"}>
                {isOverBudget ? "Over Budget" : "Within Budget"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BudgetSection;