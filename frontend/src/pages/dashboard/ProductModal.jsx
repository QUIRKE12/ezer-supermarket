import { useState } from 'react';

const CATEGORIES = [
  'Fresh Produce', 'Bakery', 'Dairy & Eggs', 'Beverages', 'Meat & Fish',
  'Grains & Staples', 'Snacks & Confectionery', 'Condiments & Sauces',
  'Personal Care', 'Household & Cleaning', 'Health & Baby',
];

const EMPTY = {
  name: '', category: CATEGORIES[0], price: '', stock: '', minStockLevel: 10,
  icon: '🛒', imageURL: '', description: '', featured: false,
};

export default function ProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState(product ? { ...EMPTY, ...product } : EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const isEdit = !!product;

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || form.price === '' || form.stock === '') {
      setError('Name, price, and stock are required.');
      return;
    }
    setSaving(true);
    try {
      await onSave({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        minStockLevel: Number(form.minStockLevel) || 10,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">{isEdit ? 'Edit product' : 'Add product'}</div>

        {error && <div className="dash-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="p-name">Name</label>
            <input id="p-name" value={form.name} onChange={(e) => update('name', e.target.value)} required />
          </div>

          <div className="form-row-split">
            <div className="form-row">
              <label htmlFor="p-category">Category</label>
              <select id="p-category" value={form.category} onChange={(e) => update('category', e.target.value)}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-row">
              <label htmlFor="p-icon">Icon (emoji)</label>
              <input id="p-icon" value={form.icon} onChange={(e) => update('icon', e.target.value)} maxLength={4} />
            </div>
          </div>

          <div className="form-row-split">
            <div className="form-row">
              <label htmlFor="p-price">Price (FRw)</label>
              <input id="p-price" type="number" min="0" value={form.price} onChange={(e) => update('price', e.target.value)} required />
            </div>
            <div className="form-row">
              <label htmlFor="p-stock">Stock</label>
              <input id="p-stock" type="number" min="0" value={form.stock} onChange={(e) => update('stock', e.target.value)} required />
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="p-min-stock">Minimum stock level</label>
            <input id="p-min-stock" type="number" min="0" value={form.minStockLevel} onChange={(e) => update('minStockLevel', e.target.value)} />
          </div>

          <div className="form-row">
            <label htmlFor="p-image">Image URL (optional)</label>
            <input id="p-image" value={form.imageURL} onChange={(e) => update('imageURL', e.target.value)} placeholder="https://…" />
          </div>

          <div className="form-row">
            <label htmlFor="p-desc">Description</label>
            <textarea id="p-desc" rows={2} value={form.description} onChange={(e) => update('description', e.target.value)} />
          </div>

          <label className="form-checkbox">
            <input type="checkbox" checked={form.featured} onChange={(e) => update('featured', e.target.checked)} />
            Show on homepage (featured)
          </label>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
