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

import { ChartData, LineChartData } from "../types";

interface ChartsSectionProps {
  chartData: ChartData[];
  lineChartData: LineChartData[];
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#14b8a6",
];

function ChartsSection({
  chartData,
  lineChartData,
}: ChartsSectionProps) {
  return (
    <section className="charts-grid">
      <div className="section-panel chart-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Mix</span>
            <h2>Spending Breakdown</h2>
          </div>
        </div>

        <div className="chart-container">
          {chartData.length === 0 ? (
            <p className="empty-message">Add transactions to build a breakdown.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={104}
                  paddingAngle={3}
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
          )}
        </div>
      </div>

      <div className="section-panel chart-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Trend</span>
            <h2>Monthly Spending</h2>
          </div>
        </div>

        <div className="chart-container">
          {lineChartData.length === 0 ? (
            <p className="empty-message">Monthly totals will appear here.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d7dee9" />

                <XAxis dataKey="month" stroke="#64748b" />

                <YAxis stroke="#64748b" />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </section>
  );
}

export default ChartsSection;