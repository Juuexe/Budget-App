interface TransactionFormProps {
  title: string;
  amount: string;
  category: string;
  date: string;
  setTitle: (value: string) => void;
  setAmount: (value: string) => void;
  setCategory: (value: string) => void;
  setDate: (value: string) => void;
  addTransaction: () => void;
}

function TransactionForm({
  title,
  amount,
  category,
  date,
  setTitle,
  setAmount,
  setCategory,
  setDate,
  addTransaction,
}: TransactionFormProps) {
  return (
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
  );
}

export default TransactionForm;