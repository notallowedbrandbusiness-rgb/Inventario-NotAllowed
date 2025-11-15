
import React, { useState } from 'react';
import type { InventoryItem } from '../types';
import { EditIcon, DeleteIcon } from './icons';

interface InventoryProps {
  inventory: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'createdAt'>) => void;
  updateInventoryItem: (item: InventoryItem) => void;
  deleteInventoryItem: (itemId: string) => void;
  setGeminiTopic: (topic: string) => void;
}

const InventoryForm: React.FC<Pick<InventoryProps, 'addInventoryItem' | 'setGeminiTopic'>> = ({ addInventoryItem, setGeminiTopic }) => {
    const [name, setName] = useState('');
    const [cost, setCost] = useState('');
    const [basePrice, setBasePrice] = useState('');
    const [stock, setStock] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !cost || !basePrice || !stock) return;
        
        addInventoryItem({
            name,
            cost: parseFloat(cost),
            basePrice: parseFloat(basePrice),
            stock: parseInt(stock, 10),
        });

        setGeminiTopic("Valoración de Inventario y Margen de Ganancia");

        setName('');
        setCost('');
        setBasePrice('');
        setStock('');
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg space-y-4">
            <h3 className="text-xl font-bold mb-2">Añadir Nuevo Producto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-muted mb-1">Nombre del Producto</label>
                    <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-light dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2" />
                </div>
                <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-muted mb-1">Stock Inicial</label>
                    <input type="number" id="stock" value={stock} onChange={e => setStock(e.target.value)} min="0" required className="w-full bg-light dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2" />
                </div>
                <div>
                    <label htmlFor="cost" className="block text-sm font-medium text-muted mb-1">Costo de Producción (por unidad)</label>
                    <input type="number" id="cost" value={cost} onChange={e => setCost(e.target.value)} min="0" step="0.01" required className="w-full bg-light dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2" />
                </div>
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-muted mb-1">Precio Base de Venta (por unidad)</label>
                    <input type="number" id="price" value={basePrice} onChange={e => setBasePrice(e.target.value)} min="0" step="0.01" required className="w-full bg-light dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2" />
                </div>
            </div>
            <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-pink-700 transition-colors">
                Añadir a Inventario
            </button>
        </form>
    );
};

const EditInventoryForm: React.FC<{ item: InventoryItem; onSave: (item: InventoryItem) => void; onCancel: () => void }> = ({ item, onSave, onCancel }) => {
    const [name, setName] = useState(item.name);
    const [cost, setCost] = useState(item.cost.toString());
    const [basePrice, setBasePrice] = useState(item.basePrice.toString());
    const [stock, setStock] = useState(item.stock.toString());

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...item,
            name,
            cost: parseFloat(cost),
            basePrice: parseFloat(basePrice),
            stock: parseInt(stock, 10),
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center animate-scale-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-11/12 max-w-lg" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-4">Editar Producto</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="edit_name" className="block text-sm font-medium text-muted mb-1">Nombre del Producto</label>
                            <input type="text" id="edit_name" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-light dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2" />
                        </div>
                        <div>
                            <label htmlFor="edit_stock" className="block text-sm font-medium text-muted mb-1">Stock</label>
                            <input type="number" id="edit_stock" value={stock} onChange={e => setStock(e.target.value)} min="0" required className="w-full bg-light dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2" />
                        </div>
                        <div>
                            <label htmlFor="edit_cost" className="block text-sm font-medium text-muted mb-1">Costo/u</label>
                            <input type="number" id="edit_cost" value={cost} onChange={e => setCost(e.target.value)} min="0" step="0.01" required className="w-full bg-light dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2" />
                        </div>
                        <div>
                            <label htmlFor="edit_price" className="block text-sm font-medium text-muted mb-1">Precio Base/u</label>
                            <input type="number" id="edit_price" value={basePrice} onChange={e => setBasePrice(e.target.value)} min="0" step="0.01" required className="w-full bg-light dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2" />
                        </div>
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
            <p className="text-muted mb-6">Esta acción no se puede deshacer. Las ventas pasadas de este producto no se verán afectadas.</p>
            <div className="flex justify-center space-x-4">
                <button onClick={onCancel} className="px-6 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors font-semibold">Cancelar</button>
                <button onClick={onConfirm} className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors">Eliminar</button>
            </div>
        </div>
    </div>
);

export const Inventory: React.FC<InventoryProps> = ({ inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem, setGeminiTopic }) => {
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  return (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold">Inventario</h2>
        <InventoryForm addInventoryItem={addInventoryItem} setGeminiTopic={setGeminiTopic} />
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold mb-4">Stock de Productos</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="py-2 px-4">Producto</th>
                            <th className="py-2 px-4">Stock</th>
                            <th className="py-2 px-4">Costo/u</th>
                            <th className="py-2 px-4">Precio Base/u</th>
                            <th className="py-2 px-4">Valor Total (Costo)</th>
                            <th className="py-2 px-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.map(item => (
                            <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="py-3 px-4 font-semibold">{item.name}</td>
                                <td className={`py-3 px-4 font-bold ${item.stock < 10 ? 'text-red-500' : 'text-green-500'}`}>{item.stock}</td>
                                <td className="py-3 px-4 text-muted">€{item.cost.toFixed(2)}</td>
                                <td className="py-3 px-4 text-primary font-medium">€{item.basePrice.toFixed(2)}</td>
                                <td className="py-3 px-4 font-medium">€{(item.cost * item.stock).toFixed(2)}</td>
                                <td className="py-3 px-4 text-right">
                                    <div className="flex justify-end space-x-2">
                                        <button onClick={() => setEditingItem(item)} className="p-2 text-muted hover:text-blue-500 transition-colors"><EditIcon className="w-5 h-5"/></button>
                                        <button onClick={() => setDeletingItemId(item.id)} className="p-2 text-muted hover:text-red-500 transition-colors"><DeleteIcon className="w-5 h-5"/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {inventory.length === 0 && <p className="text-center text-muted py-8">No hay productos en el inventario.</p>}
            </div>
        </div>
        {editingItem && (
            <EditInventoryForm
                item={editingItem}
                onCancel={() => setEditingItem(null)}
                onSave={(updatedItem) => {
                    updateInventoryItem(updatedItem);
                    setEditingItem(null);
                }}
            />
        )}
        {deletingItemId && (
            <DeleteConfirmation
                onCancel={() => setDeletingItemId(null)}
                onConfirm={() => {
                    deleteInventoryItem(deletingItemId);
                    setDeletingItemId(null);
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