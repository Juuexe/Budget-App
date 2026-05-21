export interface Transaction {
  id?: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface LineChartData {
  month: string;
  total: number;
}