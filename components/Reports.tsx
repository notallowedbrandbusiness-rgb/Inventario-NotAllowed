import React, { useMemo, useState } from 'react';
import type { Sale, Expense } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ReportsProps {
  sales: Sale[];
  expenses: Expense[];
}

export const Reports: React.FC<ReportsProps> = ({ sales, expenses }) => {
  const [selectedMonth, setSelectedMonth] = useState('all');

  const availableMonths = useMemo(() => {
    const monthMap = new Map<string, Date>(); // "ene. 2024" -> Date object
    const allDates = [...sales.map(s => s.date), ...expenses.map(e => e.date)];

    allDates.forEach(dateStr => {
        const date = new Date(dateStr);
        // Use start of the month for consistent keys and sorting
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthName = startOfMonth.toLocaleString('es-ES', { month: 'short', year: 'numeric' });
        if (!monthMap.has(monthName)) {
            monthMap.set(monthName, startOfMonth);
        }
    });

    return Array.from(monthMap.entries())
        .sort(([, dateA], [, dateB]) => dateA.getTime() - dateB.getTime())
        .map(([monthName]) => monthName);
  }, [sales, expenses]);


  const monthlyData = useMemo(() => {
    const monthFilter = (tx: { date: string }) => {
        if (selectedMonth === 'all') return true;
        const date = new Date(tx.date);
        const monthName = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleString('es-ES', { month: 'short', year: 'numeric' });
        return monthName === selectedMonth;
    };

    const filteredSales = sales.filter(monthFilter);
    const filteredExpenses = expenses.filter(monthFilter);

    const dataByMonth: { [key: string]: { name: string; ingresos: number; gastos: number; date: Date } } = {};

    const processTransactions = <T extends { date: string; totalPrice?: number; amount?: number }>(
      transactions: T[],
      type: 'ingresos' | 'gastos'
    ) => {
      transactions.forEach(tx => {
        const date = new Date(tx.date);
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthName = startOfMonth.toLocaleString('es-ES', { month: 'short', year: 'numeric' });

        if (!dataByMonth[monthName]) {
          dataByMonth[monthName] = { name: monthName, ingresos: 0, gastos: 0, date: startOfMonth };
        }
        dataByMonth[monthName][type] += tx.totalPrice || tx.amount || 0;
      });
    };

    processTransactions(filteredSales, 'ingresos');
    processTransactions(filteredExpenses, 'gastos');

    return Object.values(dataByMonth)
        .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [sales, expenses, selectedMonth]);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Reportes</h2>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
          <h3 className="text-xl font-bold">Gastos/Ingresos Mensuales</h3>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-light dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-primary"
            aria-label="Seleccionar mes para el reporte"
          >
            <option value="all">Todos los meses</option>
            {availableMonths.map((month) => (
              <option key={month} value={month}>
                {month.charAt(0).toUpperCase() + month.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        {monthlyData.length > 0 ? (
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <BarChart
                data={monthlyData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.2)" />
                <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
                <YAxis tickFormatter={(value) => `€${value}`} tick={{ fill: '#6b7280' }} />
                <Tooltip
                  formatter={(value: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value)}
                  cursor={{ fill: 'rgba(219, 39, 119, 0.1)' }}
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '10px' }}
                />
                <Legend />
                <Bar dataKey="gastos" fill="#ef4444" name="Gastos" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ingresos" fill="#10b981" name="Ingresos" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
           <p className="text-center text-muted py-8">No hay datos para el período seleccionado.</p>
        )}
      </div>
    </div>
  );
};