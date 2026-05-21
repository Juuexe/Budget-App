import React, { useEffect, useState } from "react";
import TransactionTable from "./components/TransactionTable";
import BudgetSection from "./components/BudgetSection";
import AnalyticsSection from "./components/AnalyticsSection";
import ChartsSection from "./components/ChartsSection";
import TransactionForm from "./components/TransactionForm";
import { Transaction } from "./types";

import {
  fetchTransactionsAPI,
  addTransactionAPI,
  deleteTransactionAPI,
  fetchBudgetsAPI,
  saveBudgetAPI,
  deleteBudgetAPI,
} from "./services/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import "./App.css";



function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

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

  // Fetch transactions
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

  // Fetch Budgets
 const fetchBudgets = async () => {
  const data = await fetchBudgetsAPI();
  setBudgets(data);
};

  useEffect(() => {
    fetchTransactions();
    fetchBudgets();
  }, []);

  // Add transaction
  const addTransaction = async () => {
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

  await saveBudgetAPI(
  budgetCategory.trim(),
  Number(budgetAmount)
  );

  setBudgetCategory("");
  setBudgetAmount("");

  fetchBudgets();
};


const deleteBudget = async (category: string) => {
  await deleteBudgetAPI(category);

  fetchBudgets();
};

//Delete transaction
  const deleteTransaction = async (id: string) => {
 await deleteTransactionAPI(id);

  fetchTransactions();
};


   // Total Spending
  const totalSpending = transactions.reduce(
    (total, transaction) => total + transaction.amount,
    0
  );

  const categoryTotals: { [key: string]: number } = {};
  transactions.forEach((transaction) => {
    if (categoryTotals[transaction.category]) {
    categoryTotals[transaction.category] += transaction.amount;
  } else {
    categoryTotals[transaction.category] = transaction.amount;
  }
  });


  const [budgets, setBudgets] = useState<{ [key: string]: number }>({});

  const chartData = Object.entries(categoryTotals).map(
  ([category, total]) => ({
    name: category,
    value: total,
  })
  );

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

  const lineChartData = Object.entries(monthlyTotals).map(
  ([month, total]) => ({
    month,
    total,
  })
  );


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
  
  const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#14b8a6",
  ];

  const filteredTransactions = transactions.filter((transaction) => {
  const matchesSearch = transaction.title
    .toLowerCase()
    .includes(searchTerm.toLowerCase());

  const matchesCategory =
    selectedCategory === "All" ||
    transaction.category === selectedCategory;

  return matchesSearch && matchesCategory;
  });


  return (
    <div className="app">
      <h1 className="main-title">Smart Budget Dashboard</h1>
      {loading && <p className="status-message">Loading...</p>}

      {error && <p className="error-message">{error}</p>}


     <div className="nav-buttons">
  <button onClick={() => document.getElementById("overview")?.scrollIntoView({ behavior: "smooth" })}>
    Overview
  </button>

  <button onClick={() => document.getElementById("budgets")?.scrollIntoView({ behavior: "smooth" })}>
    Budgets
  </button>

  <button onClick={() => document.getElementById("analytics")?.scrollIntoView({ behavior: "smooth" })}>
    Analytics
  </button>

  <button onClick={() => document.getElementById("transactions")?.scrollIntoView({ behavior: "smooth" })}>
    Transactions
  </button>
</div>

      
      <div id="overview" className="summary-card">
        <h2>Total Spending</h2>
        <p>${totalSpending}</p>
      </div>

      <div className="prediction-card">
        <h2>Spending Prediction</h2>

        <p>Current Month: ${currentMonthSpending.toFixed(2)}</p>

        <p>Projected Month: ${projectedMonthlySpending.toFixed(2)}</p>

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


      <AnalyticsSection categoryTotals={categoryTotals} />


      <ChartsSection
        chartData={chartData}
        lineChartData={lineChartData}
      />


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
  );
}

export default App;