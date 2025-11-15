
import React, { useState } from 'react';
import type { Expense } from '../types';
import { EditIcon, DeleteIcon } from './icons';

interface ExpensesProps {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (expenseId: string) => void;
  setGeminiTopic: (topic: string) => void;
}

const EXPENSE_CATEGORIES = [
  "Materiales y Producción", "Marketing y Publicidad", "Envío y Logística",
  "Software y Herramientas", "Alquiler de Oficina/Estudio", "Salarios", "Otros"
];

const ExpenseForm: React.FC<Pick<ExpensesProps, 'addExpense' | 'setGeminiTopic'>> = ({ addExpense, setGeminiTopic }) => {
    const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || !amount || parseFloat(amount) <= 0) {
            alert('Por favor, completa todos los campos correctamente.');
            return;
        }

        addExpense({
            category,
            description,
            amount: parseFloat(amount),
            date,
        });

        const topicMap: { [key: string]: string } = {
            "Materiales y Producción": "Costo de Bienes Vendidos (COGS)",
            "Marketing y Publicidad": "Gastos de Marketing",
            "Envío y Logística": "Gastos Operativos",
        };

        setGeminiTopic(topicMap[category] || "Tipos de Gastos Empresariales");
        
        setCategory(EXPENSE_CATEGORIES[0]);
        setDescription('');
        setAmount('');
        setDate(new Date().toISOString().split('T')[0]);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg space-y-4">
            <h3 className="text-xl font-bold mb-2">Registrar Nuevo Gasto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-muted mb-1">Categoría</label>
                    <select id="category" value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-light dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2">
                        {EXPENSE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-muted mb-1">Monto</label>
                    <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" required className="w-full bg-light dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2"/>
                </div>
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-muted mb-1">Descripción</label>
                <input type="text" id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Ej: Telas para nueva colección" required className="w-full bg-light dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2"/>
            </div>
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-muted mb-1">Fecha</label>
                <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full bg-light dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2"/>
            </div>
            <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-pink-700 transition-colors">
                Añadir Gasto
            </button>
        </form>
    );
};

const EditExpenseForm: React.FC<{ expense: Expense, onSave: (expense: Expense) => void, onCancel: () => void }> = ({ expense, onSave, onCancel }) => {
    const [category, setCategory] = useState(expense.category);
    const [description, setDescription] = useState(expense.description);
    const [amount, setAmount] = useState(expense.amount.toString());
    const [date, setDate] = useState(expense.date);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...expense, category, description, amount: parseFloat(amount), date });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center animate-scale-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-11/12 max-w-lg" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-4">Editar Gasto</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="edit_category" className="block text-sm font-medium text-muted mb-1">Categoría</label>
                            <select id="edit_category" value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-light dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2">
                                {EXPENSE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="edit_amount" className="block text-sm font-medium text-muted mb-1">Monto</label>
                            <input type="number" id="edit_amount" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" required className="w-full bg-light dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2"/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="edit_description" className="block text-sm font-medium text-muted mb-1">Descripción</label>
                        <input type="text" id="edit_description" value={description} onChange={e => setDescription(e.target.value)} required className="w-full bg-light dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2"/>
                    </div>
                    <div>
                        <label htmlFor="edit_date" className="block text-sm font-medium text-muted mb-1">Fecha</label>
                        <input type="date" id="edit_date" value={date.split('T')[0]} onChange={e => setDate(e.target.value)} required className="w-full bg-light dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2"/>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-pink-700 transition-colors">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const DeleteConfirmation: React.FC<{ onConfirm: () => void, onCancel: () => void }> = ({ onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center animate-scale-in">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-11/12 max-w-sm text-center" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-2">¿Confirmar Eliminación?</h3>
            <p className="text-muted mb-6">Esta acción no se puede deshacer.</p>
            <div className="flex justify-center space-x-4">
                <button onClick={onCancel} className="px-6 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors font-semibold">Cancelar</button>
                <button onClick={onConfirm} className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors">Eliminar</button>
            </div>
        </div>
    </div>
);

export const Expenses: React.FC<ExpensesProps> = ({ expenses, addExpense, updateExpense, deleteExpense, setGeminiTopic }) => {
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpenseId, setDeletingExpenseId] = useState<string | null>(null);

  return (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold">Gastos</h2>
        <ExpenseForm addExpense={addExpense} setGeminiTopic={setGeminiTopic} />
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold mb-4">Historial de Gastos</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="py-2 px-4">Descripción</th>
                            <th className="py-2 px-4">Categoría</th>
                            <th className="py-2 px-4">Monto</th>
                            <th className="py-2 px-4">Fecha</th>
                            <th className="py-2 px-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map(expense => (
                            <tr key={expense.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="py-3 px-4 font-semibold">{expense.description}</td>
                                <td className="py-3 px-4">{expense.category}</td>
                                <td className="py-3 px-4 text-red-500 font-medium">-€{expense.amount.toFixed(2)}</td>
                                <td className="py-3 px-4 text-muted">{new Date(expense.date).toLocaleDateString()}</td>
                                <td className="py-3 px-4 text-right">
                                    <div className="flex justify-end space-x-2">
                                        <button onClick={() => setEditingExpense(expense)} className="p-2 text-muted hover:text-blue-500 transition-colors"><EditIcon className="w-5 h-5"/></button>
                                        <button onClick={() => setDeletingExpenseId(expense.id)} className="p-2 text-muted hover:text-red-500 transition-colors"><DeleteIcon className="w-5 h-5"/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {expenses.length === 0 && <p className="text-center text-muted py-8">No hay gastos registrados.</p>}
            </div>
        </div>
        {editingExpense && (
            <EditExpenseForm
                expense={editingExpense}
                onCancel={() => setEditingExpense(null)}
                onSave={(updatedExpense) => {
                    updateExpense(updatedExpense);
                    setEditingExpense(null);
                }}
            />
        )}
        {deletingExpenseId && (
            <DeleteConfirmation
                onCancel={() => setDeletingExpenseId(null)}
                onConfirm={() => {
                    deleteExpense(deletingExpenseId);
                    setDeletingExpenseId(null);
                }}
            />
        )}
         <style>{`
            @keyframes scale-in {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
            }
            .animate-scale-in {
            animation: scale-in 0.2s ease-out forwards;
            }
        `}</style>
    </div>
  );
};
