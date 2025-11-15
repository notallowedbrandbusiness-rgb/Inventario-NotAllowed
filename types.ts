
export interface InventoryItem {
  id: string;
  name: string;
  cost: number;
  basePrice: number;
  stock: number;
  createdAt: string;
}

export interface Sale {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  date: string;
}

export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
}

export enum View {
  Dashboard = 'DASHBOARD',
  Income = 'INCOME',
  Expenses = 'EXPENSES',
  Inventory = 'INVENTORY',
  Reports = 'REPORTS',
}
