function Sidebar() {
  return (
    <div className="sidebar">
      <div className="brand-lockup">
        <span>SB</span>
        <div>
          <h2>Smart Budget</h2>
          <p>Money control</p>
        </div>
      </div>

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