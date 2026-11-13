import { useEffect, useState } from 'react';
import { switchBatch } from '../../services/studentService';
import { listBatches } from '../../services/batchService';
import FormField from '../common/FormField';

const inputClass =
  'border border-slate-300 rounded-lg px-2 py-1.5 text-sm font-normal bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500';

export default function SwitchBatchModal({ student, onSaved, onClose }) {
  const [batches, setBatches] = useState([]);
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [form, setForm] = useState({
    newBatch: '',
    reason: '',
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchBatches() {
      try {
        const data = await listBatches();
        setBatches(data);
      } catch {
        setErrors({
          form: 'Could not load batches. Please try again.',
        });
      } finally {
        setLoadingBatches(false);
      }
    }

    fetchBatches();
  }, []);

  const set = key => e => {
    setForm(prev => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const currentBatch = batches.find(
    batch => String(batch.id) === String(student.batch)
  );

  const validate = () => {
    const found = {};

    if (!form.newBatch) {
      found.newBatch = 'Select a new batch.';
    } else if (Number(form.newBatch) === Number(student.batch)) {
      found.newBatch = 'Select a different batch.';
    }

    return found;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (saving) return;

    const found = validate();
    setErrors(found);

    if (Object.keys(found).length) return;

    setSaving(true);

    try {
      const result = await switchBatch(student.id, {
        newBatch: Number(form.newBatch),
        reason: form.reason.trim(),
      });

      onSaved({
        ...result,
        batch: Number(form.newBatch),
      });

    } catch (error) {
      const backendErrors = error.response?.data;

      setErrors({
        form:
          backendErrors?.message ||
          backendErrors?.detail ||
          'Could not switch the batch. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6"
      >
        <h2 className="text-lg font-bold mb-1">Switch Batch</h2>

        <p className="text-sm text-slate-500 mb-4">
          {student.name}
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-4 text-sm">
          <p>
            <span className="text-slate-500">Current batch:</span>{' '}
            {currentBatch
              ? `${currentBatch.course} ${currentBatch.month} ${currentBatch.year} - B${currentBatch.batch_number}`
              : student.batchName || student.batch}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <FormField label="New batch" error={errors.newBatch}>
            <select
              className={inputClass}
              value={form.newBatch}
              onChange={set('newBatch')}
              disabled={loadingBatches}
            >
              <option value="">
                {loadingBatches ? 'Loading batches...' : 'Select new batch'}
              </option>

              {batches
                .filter(
                  batch => Number(batch.id) !== Number(student.batch)
                )
                .map(batch => (
                  <option key={batch.id} value={batch.id}>
                    {batch.course} {batch.month} {batch.year} - B
                    {batch.batch_number}
                  </option>
                ))}
            </select>
          </FormField>

          <FormField label="Reason">
            <textarea
              className={inputClass}
              rows={3}
              value={form.reason}
              onChange={set('reason')}
              placeholder="Enter the reason for switching batches"
            />
          </FormField>
        </div>

        {errors.form && (
          <p className="text-red-500 text-sm mt-3">{errors.form}</p>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-slate-300"
          >
            Cancel
          </button>

          <button
            disabled={saving || loadingBatches}
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white font-semibold disabled:opacity-50"
          >
            {saving ? 'Switching...' : 'Confirm Switch'}
          </button>
        </div>
      </form>
    </div>
  );
}