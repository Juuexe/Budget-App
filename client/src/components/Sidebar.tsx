function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Budget App</h2>

      <button
        onClick={() =>
          document
            .getElementById("overview")
            ?.scrollIntoView({ behavior: "smooth" })
        }
      >
        Overview
      </button>

      <button
        onClick={() =>
          document
            .getElementById("budgets")
            ?.scrollIntoView({ behavior: "smooth" })
        }
      >
        Budgets
      </button>

      <button
        onClick={() =>
          document
            .getElementById("analytics")
            ?.scrollIntoView({ behavior: "smooth" })
        }
      >
        Analytics
      </button>

      <button
        onClick={() =>
          document
            .getElementById("transactions")
            ?.scrollIntoView({ behavior: "smooth" })
        }
      >
        Transactions
      </button>
    </div>
  );
}

export default Sidebar;