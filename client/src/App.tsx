import React, { useEffect, useState } from "react";
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

interface Transaction {
  id?: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [budgetCategory, setBudgetCategory] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");

  // Fetch transactions
  const fetchTransactions = async () => {
    const response = await fetch("http://127.0.0.1:5000/api/transactions");
    const data = await response.json();
    setTransactions(data);
  };

  // Fetch Budgets
  const fetchBudgets = async () => {
  const response = await fetch("http://127.0.0.1:5000/api/budgets");
  const data = await response.json();
  setBudgets(data);
};

  useEffect(() => {
    fetchTransactions();
    fetchBudgets();
  }, []);

  // Add transaction
  const addTransaction = async () => {
    await fetch("http://127.0.0.1:5000/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        amount: Number(amount),
        category,
        date,
      }),
    });

    setTitle("");
    setAmount("");
    setCategory("");
    setDate("");

    fetchTransactions();
  };


const updateBudget = async () => {
  if (!budgetCategory || !budgetAmount) return;

  await fetch("http://127.0.0.1:5000/api/budgets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      category: budgetCategory,
      limit: Number(budgetAmount),
    }),
  });

  setBudgetCategory("");
  setBudgetAmount("");

  fetchBudgets();
};


const deleteBudget = async (category: string) => {
  await fetch(
    `http://127.0.0.1:5000/api/budgets/${encodeURIComponent(category.trim())}`,
    {
      method: "DELETE",
    }
  );

  fetchBudgets();
};

//Delete transaction
  const deleteTransaction = async (id: string) => {
  await fetch(`http://127.0.0.1:5000/api/transactions/${id}`, {
    method: "DELETE",
  });

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


  return (
    <div className="app">
      <h1 className="main-title">Smart Budget Dashboard</h1>


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

  <button onClick={updateBudget}>
    Save Budget
  </button>
</div>

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

  <span
    className={
      isOverBudget ? "budget-warning" : "budget-safe"
    }
  >
    {isOverBudget ? "Over Budget" : "Within Budget"}
  </span>
</div>
           );
         })}
        </div>
      </div>



      <div className="form-container">
        <input
          type="text"
          placeholder="Transaction Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />


        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button onClick={addTransaction}>Add Transaction</button>
      </div>




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



<div className="chart-section">
  <h2>Spending Breakdown</h2>

  <div className="chart-container">
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          outerRadius={120}
          label
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>

        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
</div>

<div className="chart-section">
  <h2>Monthly Spending Trend</h2>

  <div className="chart-container">
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={lineChartData}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="month" />

        <YAxis />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="total"
          stroke="#3b82f6"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>


      <div id="transactions" className="transactions-section">
        <h2>Recent Transactions</h2>

        {transactions.map((transaction) => (
          <div className="transaction-card" key={transaction.id}>
            <div>
              <h3>{transaction.title}</h3>
              <div className="transaction-info">
                <span>{transaction.category}</span>
                <small>{transaction.date}</small>
              </div>
            </div>

            <div className="transaction-actions">
                <p className="amount">${transaction.amount}</p>

                <button
                   className="delete-button"
                   onClick={() => deleteTransaction(transaction.id!)}
                 >
                   Delete
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;