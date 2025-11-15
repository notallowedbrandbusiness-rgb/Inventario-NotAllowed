
import React from 'react';
import type { Sale, Expense } from '../types';
import { IncomeIcon, ExpensesIcon } from './icons';

interface DashboardProps {
  sales: Sale[];
  expenses: Expense[];
}

const StatCard: React.FC<{ title: string; value: string; color: string; children: React.ReactNode }> = ({ title, value, color, children }) => (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg flex items-center space-x-4 border-l-4 ${color}`}>
        <div className="text-3xl">{children}</div>
        <div>
            <p className="text-sm text-muted font-medium uppercase">{title}</p>
            <p className="text-2xl font-bold text-dark dark:text-light">{value}</p>
        </div>
    </div>
);

const TransactionRow: React.FC<{ date: string; description: string; amount: number; type: 'income' | 'expense' }> = ({ date, description, amount, type }) => {
    const isIncome = type === 'income';
    const amountColor = isIncome ? 'text-green-500' : 'text-red-500';
    
    const formattedAmount = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(isIncome ? amount : -amount);

    return (
        <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${isIncome ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                    {isIncome ? <IncomeIcon className="w-5 h-5 text-green-500"/> : <ExpensesIcon className="w-5 h-5 text-red-500"/>}
                </div>
                <div>
                    <p className="font-semibold text-dark dark:text-light">{description}</p>
                    <p className="text-sm text-muted">{new Date(date).toLocaleDateString()}</p>
                </div>
            </div>
            <p className={`font-bold text-lg ${amountColor}`}>{formattedAmount}</p>
        </div>
    );
};

export const Dashboard: React.FC<DashboardProps> = ({ sales, expenses }) => {
    const totalIncome = sales.reduce((acc, sale) => acc + sale.totalPrice, 0);
    const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    const profit = totalIncome - totalExpenses;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
    };

    const combinedTransactions = [
        ...sales.map(s => ({ ...s, type: 'income' as const, description: `Venta: ${s.itemName}` })),
        ...expenses.map(e => ({ ...e, type: 'expense' as const, amount: e.amount }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard title="Ingresos Totales" value={formatCurrency(totalIncome)} color="border-green-500">
                <span className="text-green-500">💰</span>
            </StatCard>
            <StatCard title="Gastos Totales" value={formatCurrency(totalExpenses)} color="border-red-500">
                <span className="text-red-500">💸</span>
            </StatCard>
            <StatCard title="Ganancia Neta" value={formatCurrency(profit)} color={profit >= 0 ? "border-primary" : "border-red-500"}>
                <span className="text-primary">📈</span>
            </StatCard>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold mb-4">Actividad Reciente</h3>
            <div className="space-y-2">
                {combinedTransactions.length > 0 ? (
                    combinedTransactions.map(tx => (
                        <TransactionRow 
                            key={tx.id}
                            date={tx.date}
                            description={tx.description}
                            amount={tx.type === 'income' ? tx.totalPrice : tx.amount}
                            type={tx.type}
                        />
                    ))
                ) : (
                    <p className="text-center text-muted py-8">No hay transacciones recientes.</p>
                )}
            </div>
        </div>
    </div>
  );
};