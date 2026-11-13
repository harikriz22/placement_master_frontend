import { useState } from 'react';
import { addBatch } from '../../services/batchService';
import { X } from 'lucide-react';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function AddBatchModal({ onClose, onSaved }) {
  const [form, setForm] = useState({
    course: '',
    month: '',
    year: new Date().getFullYear(),
    batch_number: 1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'batch_number'
        ? Number(value)
        : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.course.trim() || !form.month) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await addBatch({
        course: form.course.trim(),
        month: form.month,
        year: form.year,
        batch_number: form.batch_number,
      });

      onSaved();
    } catch (err) {
      const errors = err.response?.data?.errors;

      if (errors) {
        setError(
          Object.entries(errors)
            .map(([field, messages]) =>
              `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
            )
            .join('\n')
        );
      } else {
        setError(err.response?.data?.message || 'Failed to create batch.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6">

        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Add New Batch
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Create a new course batch.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium mb-1">
              Course Name
            </label>

            <input
              type="text"
              name="course"
              value={form.course}
              onChange={handleChange}
              placeholder="Enter course name"
              maxLength={100}
              required
              className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Month
            </label>

            <select
              name="month"
              value={form.month}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
            >
              <option value="">Select month</option>

              {MONTHS.map(month => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">

            <div>
              <label className="block text-sm font-medium mb-1">
                Year
              </label>

              <input
                type="number"
                name="year"
                value={form.year}
                onChange={handleChange}
                min="2000"
                max="2100"
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Batch Number
              </label>

              <input
                type="number"
                name="batch_number"
                value={form.batch_number}
                onChange={handleChange}
                min="1"
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
              />
            </div>

          </div>

          {error && (
            <p className="text-sm text-red-600 whitespace-pre-line">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-3">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Batch'}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}