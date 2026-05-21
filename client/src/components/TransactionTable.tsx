import { Transaction } from "../types";

interface TransactionTableProps {
  transactions: Transaction[];
  deleteTransaction: (id: string) => void;
}

function TransactionTable({
  transactions,
  deleteTransaction,
}: TransactionTableProps) {
  return (
    <table className="transactions-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Amount</th>
          <th>Category</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {transactions.map((transaction) => (
          <tr key={transaction.id}>
            <td>{transaction.title}</td>
            <td>${transaction.amount}</td>
            <td>{transaction.category}</td>
            <td>{transaction.date}</td>
            <td>
              <button
                className="delete-button"
                onClick={() => deleteTransaction(transaction.id!)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TransactionTable;