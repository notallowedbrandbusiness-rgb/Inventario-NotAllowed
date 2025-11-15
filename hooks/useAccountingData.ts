import { useState, useCallback } from 'react';
import type { Sale, Expense, InventoryItem } from '../types';

// Fix: Updated the type signature for the `useLocalStorage` setter to allow function updaters
// (e.g., `setState(prev => ...)`), which is a standard React pattern. This aligns the hook's
// behavior with `useState` and resolves type errors when updating state based on its previous value.
const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T | ((prevState: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((prevState: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

export const useAccountingData = () => {
  const [inventory, setInventory] = useLocalStorage<InventoryItem[]>('accounting_inventory', []);
  const [sales, setSales] = useLocalStorage<Sale[]>('accounting_sales', []);
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('accounting_expenses', []);

  const addInventoryItem = useCallback((item: Omit<InventoryItem, 'id' | 'createdAt'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setInventory(prev => [...prev, newItem]);
  }, [setInventory]);

  const addSale = useCallback((sale: Omit<Sale, 'id' | 'itemName' | 'totalPrice'>) => {
    const item = inventory.find(i => i.id === sale.itemId);
    if (!item || item.stock < sale.quantity) {
      alert('Stock insuficiente para realizar esta venta.');
      return false;
    }
    
    const newSale: Sale = {
      ...sale,
      id: crypto.randomUUID(),
      itemName: item.name,
      totalPrice: sale.quantity * sale.pricePerUnit,
    };
    setSales(prev => [newSale, ...prev]);

    setInventory(prev => prev.map(i => 
      i.id === sale.itemId ? { ...i, stock: i.stock - sale.quantity } : i
    ));
    return true;
  }, [inventory, setInventory, setSales]);

  const addExpense = useCallback((expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: crypto.randomUUID(),
    };
    setExpenses(prev => [newExpense, ...prev]);
  }, [setExpenses]);

  // Inventory Management
  const updateInventoryItem = useCallback((updatedItem: InventoryItem) => {
    setInventory(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  }, [setInventory]);

  const deleteInventoryItem = useCallback((itemId: string) => {
    setInventory(prev => prev.filter(item => item.id !== itemId));
  }, [setInventory]);

  // Sales Management
  const updateSale = useCallback((updatedSale: Sale) => {
    const originalSale = sales.find(s => s.id === updatedSale.id);
    if (!originalSale) return;

    const quantityDifference = originalSale.quantity - updatedSale.quantity;
    
    setInventory(prev => prev.map(item =>
      item.id === updatedSale.itemId
        ? { ...item, stock: item.stock + quantityDifference }
        : item
    ));
    
    setSales(prev => prev.map(sale => sale.id === updatedSale.id ? updatedSale : sale));
  }, [sales, setInventory, setSales]);

  const deleteSale = useCallback((saleId: string) => {
    const saleToDelete = sales.find(s => s.id === saleId);
    if (!saleToDelete) return;

    setInventory(prev => prev.map(item =>
      item.id === saleToDelete.itemId
        ? { ...item, stock: item.stock + saleToDelete.quantity }
        : item
    ));

    setSales(prev => prev.filter(sale => sale.id !== saleId));
  }, [sales, setInventory, setSales]);
  
  // Expenses Management
  const updateExpense = useCallback((updatedExpense: Expense) => {
    setExpenses(prev => prev.map(expense => expense.id === updatedExpense.id ? updatedExpense : expense));
  }, [setExpenses]);

  const deleteExpense = useCallback((expenseId: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== expenseId));
  }, [setExpenses]);


  return { 
    inventory, sales, expenses, 
    addInventoryItem, addSale, addExpense,
    updateInventoryItem, deleteInventoryItem,
    updateSale, deleteSale,
    updateExpense, deleteExpense
  };
};