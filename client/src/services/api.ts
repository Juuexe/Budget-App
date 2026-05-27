const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";


// TRANSACTIONS

export const fetchTransactionsAPI = async () => {
  const response = await fetch(`${API_URL}/api/transactions`);
  return response.json();
};

export const addTransactionAPI = async (transaction: any) => {
  await fetch(`${API_URL}/api/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transaction),
  });
};

export const deleteTransactionAPI = async (id: string) => {
  await fetch(`${API_URL}/api/transactions/${id}`, {
    method: "DELETE",
  });
};


// BUDGETS

export const fetchBudgetsAPI = async () => {
  const response = await fetch(`${API_URL}/api/budgets`);
  return response.json();
};

export const saveBudgetAPI = async (
  category: string,
  limit: number
) => {
  await fetch(`${API_URL}/api/budgets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      category,
      limit,
    }),
  });
};

export const deleteBudgetAPI = async (
  category: string
) => {
  await fetch(
    `${API_URL}/api/budgets/${encodeURIComponent(category.trim())}`,
    {
      method: "DELETE",
    }
  );
};