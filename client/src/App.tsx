import React, { useEffect, useState } from "react";
import TransactionTable from "./components/TransactionTable";
import BudgetSection from "./components/BudgetSection";
import AnalyticsSection from "./components/AnalyticsSection";
import ChartsSection from "./components/ChartsSection";
import TransactionForm from "./components/TransactionForm";
import { Transaction } from "./types";
import Sidebar from "./components/Sidebar";

import {
  fetchTransactionsAPI,
  addTransactionAPI,
  deleteTransactionAPI,
  fetchBudgetsAPI,
  saveBudgetAPI,
  deleteBudgetAPI,
} from "./services/api";
import "./App.css";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<{ [key: string]: number }>({});

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [budgetCategory, setBudgetCategory] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await fetchTransactionsAPI();
      setTransactions(data);
      setError("");
    } catch {
      setError("Could not load transactions. Make sure Flask is running.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBudgets = async () => {
    try {
      const data = await fetchBudgetsAPI();
      setBudgets(data);
    } catch {
      setBudgets({});
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchBudgets();
  }, []);

  const addTransaction = async () => {
    if (!title || !amount || !category || !date) return;

    await addTransactionAPI({
      title,
      amount: Number(amount),
      category: category.trim(),
      date,
    });

    setTitle("");
    setAmount("");
    setCategory("");
    setDate("");

    fetchTransactions();
  };

  const updateBudget = async () => {
    if (!budgetCategory || !budgetAmount) return;

    await saveBudgetAPI(budgetCategory.trim(), Number(budgetAmount));

    setBudgetCategory("");
    setBudgetAmount("");

    fetchBudgets();
  };

  const deleteBudget = async (category: string) => {
    await deleteBudgetAPI(category);
    fetchBudgets();
  };

  const deleteTransaction = async (id: string) => {
    await deleteTransactionAPI(id);
    fetchTransactions();
  };

  const totalSpending = transactions.reduce(
    (total, transaction) => total + transaction.amount,
    0,
  );

  const categoryTotals: { [key: string]: number } = {};
  transactions.forEach((transaction) => {
    if (categoryTotals[transaction.category]) {
      categoryTotals[transaction.category] += transaction.amount;
    } else {
      categoryTotals[transaction.category] = transaction.amount;
    }
  });

  const chartData = Object.entries(categoryTotals).map(([category, total]) => ({
    name: category,
    value: total,
  }));

  const monthlyTotals: { [key: string]: number } = {};

  transactions.forEach((transaction) => {
    if (!transaction.date) return;

    const month = new Date(transaction.date).toLocaleString("default", {
      month: "short",
    });

    if (monthlyTotals[month]) {
      monthlyTotals[month] += transaction.amount;
    } else {
      monthlyTotals[month] = transaction.amount;
    }
  });

  const lineChartData = Object.entries(monthlyTotals).map(([month, total]) => ({
    month,
    total,
  }));

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const currentDay = currentDate.getDate();

  const currentMonthSpending = transactions
    .filter((transaction) => {
      const transactionDate = new Date(transaction.date);

      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    })
    .reduce((total, transaction) => total + transaction.amount, 0);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const projectedMonthlySpending =
    currentDay > 0
      ? (currentMonthSpending / currentDay) * daysInMonth
      : currentMonthSpending;

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || transaction.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const budgetEntries = Object.entries(budgets);
  const budgetLimitTotal = budgetEntries.reduce((total, [, limit]) => total + limit, 0);
  const budgetSpentTotal = budgetEntries.reduce(
    (total, [budgetCategory]) => total + (categoryTotals[budgetCategory] || 0),
    0,
  );
  const overBudgetCount = budgetEntries.filter(
    ([budgetCategory, limit]) => (categoryTotals[budgetCategory] || 0) > limit,
  ).length;
  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="main-content">
        <div className="app">
          <div className="dashboard-header">
            <div>
              <p className="eyebrow">Personal finance dashboard</p>

              <h1 className="main-title">Smart Budget</h1>

              <p className="dashboard-subtitle">
                Track spending, budget limits, and the monthly trend in one calm workspace.
              </p>
            </div>

            <p className="dashboard-date">{formattedDate}</p>
          </div>

          {loading && <p className="status-message">Loading...</p>}

          {error && <p className="error-message">{error}</p>}

          <div id="overview" className="top-grid">
            <div className="summary-card">
              <span className="metric-label">Total spending</span>
              <strong>{currencyFormatter.format(totalSpending)}</strong>
              <small>{transactions.length} transactions recorded</small>
            </div>

            <div className="prediction-card">
              <span className="metric-label">Monthly outlook</span>

              <div className="prediction-values">
                <p>
                  <span>Current</span>
                  <strong>{currencyFormatter.format(currentMonthSpending)}</strong>
                </p>

                <p>
                  <span>Projected</span>
                  <strong>{currencyFormatter.format(projectedMonthlySpending)}</strong>
                </p>
              </div>

              <span
                className={
                  projectedMonthlySpending > currentMonthSpending * 1.5
                    ? "prediction-warning"
                    : "prediction-safe"
                }
              >
                {projectedMonthlySpending > currentMonthSpending * 1.5
                  ? "High spending risk"
                  : "Spending looks normal"}
              </span>
            </div>

            <div className="summary-card accent-card">
              <span className="metric-label">Budget health</span>
              <strong>
                {budgetLimitTotal > 0
                  ? `${Math.min((budgetSpentTotal / budgetLimitTotal) * 100, 999).toFixed(0)}%`
                  : "0%"}
              </strong>
              <small>
                {overBudgetCount > 0
                  ? `${overBudgetCount} categories over limit`
                  : "No categories over limit"}
              </small>
            </div>

            <div className="summary-card">
              <span className="metric-label">Top category</span>
              <strong>{topCategory ? topCategory[0] : "None yet"}</strong>
              <small>
                {topCategory
                  ? currencyFormatter.format(topCategory[1])
                  : "Add a transaction to see insights"}
              </small>
            </div>
          </div>

          <div className="middle-grid">
            <BudgetSection
              budgets={budgets}
              categoryTotals={categoryTotals}
              budgetCategory={budgetCategory}
              budgetAmount={budgetAmount}
              setBudgetCategory={setBudgetCategory}
              setBudgetAmount={setBudgetAmount}
              updateBudget={updateBudget}
              deleteBudget={deleteBudget}
            />

            <AnalyticsSection categoryTotals={categoryTotals} />
          </div>

          <section className="section-panel">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Quick add</span>
                <h2>Add Transaction</h2>
              </div>
            </div>

            <TransactionForm
              title={title}
              amount={amount}
              category={category}
              date={date}
              setTitle={setTitle}
              setAmount={setAmount}
              setCategory={setCategory}
              setDate={setDate}
              addTransaction={addTransaction}
            />
          </section>

          <ChartsSection chartData={chartData} lineChartData={lineChartData} />

          <div id="transactions" className="transactions-section">
            <h2>Recent Transactions</h2>

            <div className="transaction-controls">
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">All Categories</option>

                {Object.keys(categoryTotals).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {filteredTransactions.length === 0 ? (
              <p className="empty-message">No transactions found.</p>
            ) : (
              <TransactionTable
                transactions={filteredTransactions}
                deleteTransaction={deleteTransaction}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;