
import React from 'react';
import type { View } from '../types';
import { View as ViewEnum } from '../types';
import { DashboardIcon, IncomeIcon, ExpensesIcon, InventoryIcon, ReportsIcon } from './icons';

interface HeaderProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const NavItem: React.FC<{
  view: View;
  label: string;
  currentView: View;
  setCurrentView: (view: View) => void;
  children: React.ReactNode;
}> = ({ view, label, currentView, setCurrentView, children }) => {
  const isActive = currentView === view;
  return (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-primary text-white shadow-lg'
          : 'text-muted hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-dark dark:hover:text-light'
      }`}
    >
      {children}
      <span className="font-medium">{label}</span>
    </button>
  );
};

export const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  return (
    <header className="bg-white dark:bg-gray-800 p-4 shadow-md sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg className="w-8 h-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 4h4m5 4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2z"/>
          </svg>
          <h1 className="text-2xl font-bold text-primary">Inventario NotAllowed</h1>
        </div>
        <nav className="hidden md:flex items-center space-x-2">
          <NavItem view={ViewEnum.Dashboard} label="Dashboard" currentView={currentView} setCurrentView={setCurrentView}>
            <DashboardIcon className="w-5 h-5" />
          </NavItem>
          <NavItem view={ViewEnum.Income} label="Ingresos" currentView={currentView} setCurrentView={setCurrentView}>
            <IncomeIcon className="w-5 h-5" />
          </NavItem>
          <NavItem view={ViewEnum.Expenses} label="Gastos" currentView={currentView} setCurrentView={setCurrentView}>
            <ExpensesIcon className="w-5 h-5" />
          </NavItem>
          <NavItem view={ViewEnum.Inventory} label="Inventario" currentView={currentView} setCurrentView={setCurrentView}>
            <InventoryIcon className="w-5 h-5" />
          </NavItem>
          <NavItem view={ViewEnum.Reports} label="Reportes" currentView={currentView} setCurrentView={setCurrentView}>
            <ReportsIcon className="w-5 h-5" />
          </NavItem>
        </nav>
      </div>
      <nav className="md:hidden mt-4 flex justify-around p-2 bg-gray-100 dark:bg-gray-900 rounded-full">
         <button onClick={() => setCurrentView(ViewEnum.Dashboard)} className={currentView === ViewEnum.Dashboard ? 'text-primary' : 'text-muted'}><DashboardIcon className="w-6 h-6" /></button>
         <button onClick={() => setCurrentView(ViewEnum.Income)} className={currentView === ViewEnum.Income ? 'text-primary' : 'text-muted'}><IncomeIcon className="w-6 h-6" /></button>
         <button onClick={() => setCurrentView(ViewEnum.Expenses)} className={currentView === ViewEnum.Expenses ? 'text-primary' : 'text-muted'}><ExpensesIcon className="w-6 h-6" /></button>
         <button onClick={() => setCurrentView(ViewEnum.Inventory)} className={currentView === ViewEnum.Inventory ? 'text-primary' : 'text-muted'}><InventoryIcon className="w-6 h-6" /></button>
         <button onClick={() => setCurrentView(ViewEnum.Reports)} className={currentView === ViewEnum.Reports ? 'text-primary' : 'text-muted'}><ReportsIcon className="w-6 h-6" /></button>
      </nav>
    </header>
  );
};