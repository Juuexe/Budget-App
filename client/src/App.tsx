import React, { useEffect, useState } from "react";

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


   // Total Spending
  const totalSpending = transactions.reduce(
    (total, transaction) => total + transaction.amount,
    0
  );

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

      <div className="transactions-section">
        <h2>Recent Transactions</h2>

        {transactions.map((transaction) => (
          <div className="transaction-card" key={transaction.id}>
            <div>
              <h3>{transaction.title}</h3>
              <span>{transaction.category}</span>
            </div>

            <p className="amount">${transaction.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;