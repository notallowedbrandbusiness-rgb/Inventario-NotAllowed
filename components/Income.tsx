import React, { useState, useEffect } from 'react';
import type { Sale, InventoryItem } from '../types';
import { EditIcon, DeleteIcon } from './icons';

interface IncomeProps {
  sales: Sale[];
  inventory: InventoryItem[];
  addSale: (sale: Omit<Sale, 'id' | 'itemName' | 'totalPrice'>) => boolean;
  updateSale: (sale: Sale) => void;
  deleteSale: (saleId: string) => void;
}

const SaleForm: React.FC<Pick<IncomeProps, 'inventory' | 'addSale'>> = ({ inventory, addSale }) => {
    const [itemId, setItemId] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [pricePerUnit, setPricePerUnit] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const selectedItem = inventory.find(i => i.id === itemId);
    const totalPrice = selectedItem ? parseFloat(pricePerUnit || '0') * quantity : 0;
    
    useEffect(() => {
        if (selectedItem) {
            setPricePerUnit(selectedItem.basePrice.toString());
        } else {
            setPricePerUnit('');
        }
    }, [itemId, selectedItem]);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const price = parseFloat(pricePerUnit);
        if (!itemId || quantity <= 0 || pricePerUnit === '' || isNaN(price) || price < 0) {
            alert('Por favor, completa todos los campos correctamente.');
            return;
        }

        const success = addSale({
            itemId,
            quantity,
            pricePerUnit: price,
            date,
        });

        if (success) {
            setItemId('');
            setQuantity(1);
            setPricePerUnit('');
            setDate(new Date().toISOString().split('T')[0]);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg space-y-4">
            <h3 className="text-xl font-bold mb-2">Registrar Nueva Venta</h3>
            <div>
                <label htmlFor="item" className="block text-sm font-medium text-muted mb-1">Producto</label>
                <select id="item" value={itemId} onChange={e => setItemId(e.target.value)} required className="w-full bg-light dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option value="">Selecciona un producto</option>
                    {inventory.filter(i => i.stock > 0).map(item => (
                        <option key={item.id} value={item.id}>{item.name} (Stock: {item.stock})</option>
                    ))}
                </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-muted mb-1">Cantidad</label>
                    <input type="number" id="quantity" value={quantity} onChange={e => setQuantity(Number(e.target.value))} min="1" max={selectedItem?.stock} required className="w-full bg-light dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2"/>
                </div>
                <div>
                    <label htmlFor="pricePerUnit" className="block text-sm font-medium text-muted mb-1">Precio/u</label>
                    <input type="number" id="pricePerUnit" value={pricePerUnit} onChange={e => setPricePerUnit(e.target.value)} min="0" step="0.01" required disabled={!itemId} className="w-full bg-light dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 disabled:opacity-50"/>
                </div>
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-muted mb-1">Fecha</label>
                    <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full bg-light dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2"/>
                </div>
            </div>
            <div className="text-right font-bold text-lg">
                Total: <span className="text-primary">€{totalPrice.toFixed(2)}</span>
            </div>
            <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-pink-700 transition-colors">
                Añadir Venta
            </button>
        </form>
    );
};

const EditSaleForm: React.FC<{ sale: Sale, inventory: InventoryItem[], onSave: (sale: Sale) => void, onCancel: () => void }> = ({ sale, inventory, onSave, onCancel }) => {
    const [quantity, setQuantity] = useState(sale.quantity);
    const [date, setDate] = useState(sale.date);
    
    const item = inventory.find(i => i.id === sale.itemId);
    const originalSale = sale;
    const stockAvailable = item ? item.stock + originalSale.quantity : 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedTotalPrice = sale.pricePerUnit * quantity;
        onSave({ ...sale, quantity, date, totalPrice: updatedTotalPrice });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center animate-scale-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-11/12 max-w-lg" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-4">Editar Venta</h3>
                <p className="mb-2 text-muted">Producto: <span className="font-semibold text-dark dark:text-light">{sale.itemName}</span></p>
                <p className="mb-4 text-muted">Precio de Venta/u: <span className="font-semibold text-dark dark:text-light">€{sale.pricePerUnit.toFixed(2)}</span></p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="edit_quantity" className="block text-sm font-medium text-muted mb-1">Cantidad</label>
                            <input type="number" id="edit_quantity" value={quantity} onChange={e => setQuantity(Number(e.target.value))} min="1" max={stockAvailable} required className="w-full bg-light dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2"/>
                        </div>
                        <div>
                            <label htmlFor="edit_date" className="block text-sm font-medium text-muted mb-1">Fecha</label>
                            <input type="date" id="edit_date" value={date.split('T')[0]} onChange={e => setDate(e.target.value)} required className="w-full bg-light dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2"/>
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
}

const DeleteConfirmation: React.FC<{ onConfirm: () => void, onCancel: () => void }> = ({ onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center animate-scale-in">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-11/12 max-w-sm text-center" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-2">¿Confirmar Eliminación?</h3>
            <p className="text-muted mb-6">Esta acción no se puede deshacer. El stock del producto será restaurado.</p>
            <div className="flex justify-center space-x-4">
                <button onClick={onCancel} className="px-6 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors font-semibold">Cancelar</button>
                <button onClick={onConfirm} className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors">Eliminar</button>
            </div>
        </div>
    </div>
);


export const Income: React.FC<IncomeProps> = ({ sales, inventory, addSale, updateSale, deleteSale }) => {
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [deletingSaleId, setDeletingSaleId] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Ingresos</h2>
      <SaleForm inventory={inventory} addSale={addSale} />

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-bold mb-4">Historial de Ventas</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="py-2 px-4">Producto</th>
                <th className="py-2 px-4">Cantidad</th>
                <th className="py-2 px-4">Precio/u</th>
                <th className="py-2 px-4">Total</th>
                <th className="py-2 px-4">Fecha</th>
                <th className="py-2 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sales.map(sale => (
                <tr key={sale.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4 font-semibold">{sale.itemName}</td>
                  <td className="py-3 px-4">{sale.quantity}</td>
                  <td className="py-3 px-4 text-muted">€{sale.pricePerUnit.toFixed(2)}</td>
                  <td className="py-3 px-4 text-green-500 font-medium">€{sale.totalPrice.toFixed(2)}</td>
                  <td className="py-3 px-4 text-muted">{new Date(sale.date).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end space-x-2">
                        <button onClick={() => setEditingSale(sale)} className="p-2 text-muted hover:text-blue-500 transition-colors"><EditIcon className="w-5 h-5"/></button>
                        <button onClick={() => setDeletingSaleId(sale.id)} className="p-2 text-muted hover:text-red-500 transition-colors"><DeleteIcon className="w-5 h-5"/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sales.length === 0 && <p className="text-center text-muted py-8">No hay ventas registradas.</p>}
        </div>
      </div>
       {editingSale && (
        <EditSaleForm 
            sale={editingSale}
            inventory={inventory}
            onCancel={() => setEditingSale(null)}
            onSave={(updatedSale) => {
                updateSale(updatedSale);
                setEditingSale(null);
            }}
        />
      )}
      {deletingSaleId && (
        <DeleteConfirmation
            onCancel={() => setDeletingSaleId(null)}
            onConfirm={() => {
                deleteSale(deletingSaleId);
                setDeletingSaleId(null);
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