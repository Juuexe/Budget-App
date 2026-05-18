import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./App.css";

interface Transaction {
  id?: string;
  title: string;
  amount: number;
  category: string;
}

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  // Fetch transactions
  const fetchTransactions = async () => {
    const response = await fetch("http://127.0.0.1:5000/api/transactions");
    const data = await response.json();
    setTransactions(data);
  };

  useEffect(() => {
    fetchTransactions();
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
      }),
    });

    setTitle("");
    setAmount("");
    setCategory("");

    fetchTransactions();
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

  const chartData = Object.entries(categoryTotals).map(
  ([category, total]) => ({
    name: category,
    value: total,
  })
  );

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

      <div className="summary-card">
        <h2>Total Spending</h2>
        <p>${totalSpending}</p>
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

        <button onClick={addTransaction}>Add Transaction</button>
      </div>




    <div className="analytics-section">
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


      <div className="transactions-section">
        <h2>Recent Transactions</h2>

        {transactions.map((transaction) => (
          <div className="transaction-card" key={transaction.id}>
            <div>
              <h3>{transaction.title}</h3>
              <span>{transaction.category}</span>
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