import React, { useState } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Income } from './components/Income';
import { Expenses } from './components/Expenses';
import { Inventory } from './components/Inventory';
import { Reports } from './components/Reports';
import { useAccountingData } from './hooks/useAccountingData';
import { View } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Dashboard);
  const { 
    inventory, sales, expenses, 
    addInventoryItem, addSale, addExpense,
    updateInventoryItem, deleteInventoryItem,
    updateSale, deleteSale,
    updateExpense, deleteExpense 
  } = useAccountingData();

  const renderView = () => {
    switch (currentView) {
      case View.Dashboard:
        return <Dashboard sales={sales} expenses={expenses} />;
      case View.Income:
        return <Income 
                 sales={sales} 
                 inventory={inventory} 
                 addSale={addSale} 
                 updateSale={updateSale} 
                 deleteSale={deleteSale} 
                 />;
      case View.Expenses:
        return <Expenses 
                 expenses={expenses} 
                 addExpense={addExpense}
                 updateExpense={updateExpense}
                 deleteExpense={deleteExpense}
                 />;
      case View.Inventory:
        return <Inventory 
                 inventory={inventory} 
                 addInventoryItem={addInventoryItem}
                 updateInventoryItem={updateInventoryItem}
                 deleteInventoryItem={deleteInventoryItem}
                 />;
      case View.Reports:
        return <Reports sales={sales} expenses={expenses} />;
      default:
        return <Dashboard sales={sales} expenses={expenses} />;
    }
  };

  return (
    <div className="min-h-screen bg-light dark:bg-dark">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main className="container mx-auto p-4 md:p-8">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
