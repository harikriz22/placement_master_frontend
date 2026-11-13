import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { switchBatch } from '../../services/studentService';
import FormField from '../common/FormField';
import { COURSES } from '../../constants/courses';
import {
  BATCH_SWITCH_STATUS,
  MONTHS,
  YEARS,
  labelOf,
} from '../../constants/statuses';

const inputClass =
  'border border-slate-300 rounded-lg px-2 py-1.5 text-sm font-normal bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500';

export default function SwitchBatchModal({ student, onSaved, onClose }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    newCourse: '',
    newBatch: '',
    month: String(student.month),
    year: String(student.year),
    courseStatus: 'bs_ongoing',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = key => e => setForm(prev => ({ ...prev, [key]: e.target.value }));

  const validate = () => {
    const found = {};
    if (!form.newCourse) found.newCourse = 'Select the new course.';
    if (!form.newBatch.trim()) {
      found.newBatch = 'Enter the new batch name.';
    } else if (
      form.newCourse === student.course &&
      form.newBatch.trim().toLowerCase() ===
        student.batchName.trim().toLowerCase() &&
      Number(form.month) === student.month &&
      Number(form.year) === student.year
    ) {
      found.newBatch = 'Change the course, batch name, month or year.';
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
      const { student: updated } = await switchBatch(
        student.id,
        {
          newCourse: form.newCourse,
          newBatch: form.newBatch.trim(),
          month: Number(form.month),
          year: Number(form.year),
          courseStatus: form.courseStatus,
        },
        user.name
      );
      onSaved(updated);
    } catch {
      setErrors({ form: 'Could not switch the batch. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const yearOptions = YEARS.some(y => y.value === student.year)
    ? YEARS
    : [{ value: student.year, label: String(student.year) }, ...YEARS];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6"
      >
        <h2 className="text-lg font-bold mb-1 ">Switch batch</h2>
        <p className="text-sm text-slate-500 mb-4">{student.name}</p>

        <div className="bg-slate-300 border border-grey-200 rounded-lg p-3 mb-4 text-sm">
          <p>
            <span className="text-slate-700">Current course:</span>{' '}
            {student.course}
          </p>
          <p>
            <span className="text-slate-700">Current batch:</span>{' '}
            {student.batchName}
          </p>
          <p>
            <span className="text-slate-700">Current month:</span>{' '}
            {labelOf(MONTHS, student.month)} {student.year}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <FormField label="New course" error={errors.newCourse}>
            <select
              className={inputClass}
              value={form.newCourse}
              onChange={set('newCourse')}
            >
              <option value="">Select course</option>
              {COURSES.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="New batch name" error={errors.newBatch}>
            <input
              className={inputClass}
              value={form.newBatch}
              onChange={set('newBatch')}
              placeholder="e.g. MERN May 2026 B2"
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Month">
              <select
                className={inputClass}
                value={form.month}
                onChange={set('month')}
              >
                {MONTHS.map(o => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Year">
              <select
                className={inputClass}
                value={form.year}
                onChange={set('year')}
              >
                {yearOptions.map(o => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </FormField>
          </div>
          <FormField label="Course status after switch">
            <select
              className={inputClass}
              value={form.courseStatus}
              onChange={set('courseStatus')}
            >
              {BATCH_SWITCH_STATUS.map(o => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
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
            disabled={saving}
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white font-semibold disabled:opacity-50"
          >
            {saving ? 'Switching...' : 'Confirm switch'}
          </button>
        </div>
      </form>
    </div>
  );
}
