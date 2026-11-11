import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { addStudent, updateStudent } from '../../services/studentService';
import FormField from '../common/FormField';
import { COURSES } from '../../constants/courses';
import { isEligible } from '../../utils/eligibility';
import {
  MONTHS,
  YEARS,
  COURSE_STATUS,
  FEE_STATUS,
  PROJECT_STATUS,
  PLACEMENT_STATUS,
} from '../../constants/statuses';

const EMPTY = {
  name: '',
  course: '',
  batchName: '',
  month: '',
  year: '',
  phone: '',
  email: '',
  courseStatus: 'ongoing',
  fee: 'no',
  project: 'no',
  placementStatus: 'project_not_completed',
  remarks: '',
};

const inputClass =
  'border border-slate-300 rounded-lg px-2 py-1.5 text-sm font-normal bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500';

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Enter the student name.';
  if (!form.course) errors.course = 'Select a course.';
  if (!form.batchName.trim()) errors.batchName = 'Enter the batch name.';
  if (!form.month) errors.month = 'Select a month.';
  if (!form.year) errors.year = 'Select a year.';
  if (!/^\d{10}$/.test(form.phone))
    errors.phone = 'Enter a 10-digit phone number.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = 'Enter a valid email.';
  return errors;
}

export default function StudentFormModal({ student, onClose, onSaved }) {
  const { user } = useAuth();
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const initial = student
    ? {
        name: student.name,
        course: student.course,
        batchName: student.batchName,
        month: String(student.month),
        year: String(student.year),
        phone: student.phone,
        email: student.email,
        courseStatus: student.courseStatus,
        fee: student.feeCompleted ? 'yes' : 'no',
        project: student.projectCompleted ? 'yes' : 'no',
        placementStatus: student.placementStatus,
        remarks: student.remarks ?? '',
      }
    : EMPTY;
  const [form, setForm] = useState(initial);

  const set = key => e => setForm(prev => ({ ...prev, [key]: e.target.value }));
  const eligible = isEligible({
    feeCompleted: form.fee === 'yes',
    projectCompleted: form.project === 'yes',
    courseStatus: form.courseStatus,
  });
  const placementLocked = form.project !== 'yes';
  const placementValue = placementLocked
    ? 'project_not_completed'
    : form.placementStatus === 'project_not_completed'
      ? 'placement_needed'
      : form.placementStatus;
  const placementOptions = placementLocked
    ? PLACEMENT_STATUS
    : PLACEMENT_STATUS.filter(o => o.value !== 'project_not_completed');

  const handleSubmit = async e => {
    e.preventDefault();
    if (saving) return;
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    setSaving(true);
    try {
      const data = {
        name: form.name.trim(),
        course: form.course,
        batchName: form.batchName.trim(),
        month: Number(form.month),
        year: Number(form.year),
        phone: form.phone,
        email: form.email.trim().toLowerCase(),
        courseStatus: form.courseStatus,
        feeCompleted: form.fee === 'yes',
        projectCompleted: form.project === 'yes',
        placementStatus: placementValue,
        remarks: form.remarks.trim(),
      };
      const saved = student
        ? await updateStudent(student.id, data, user.name)
        : await addStudent(data, user.name);
      onSaved(saved);
    } catch {
      setErrors({ form: 'Could not save the student. Please try again.' });
    } finally {
      setSaving(false);
    }
  };
  const yearOptions =
    !form.year || YEARS.some(y => String(y.value) === form.year)
      ? YEARS
      : [{ value: Number(form.year), label: form.year }, ...YEARS];
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
      >
        <h2 className="text-lg font-bold mb-4">
          {student ? 'Edit Student' : 'Add Student'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Name" error={errors.name}>
            <input
              className={inputClass}
              value={form.name}
              onChange={set('name')}
            />
          </FormField>
          <FormField label="Course" error={errors.course}>
            <select
              className={inputClass}
              value={form.course}
              onChange={set('course')}
              disabled={!!student}
            >
              <option value="">Select course</option>
              {COURSES.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {student && (
              <span className="text-xs font-normal text-slate-500">
                Use the switch button to change the course.
              </span>
            )}
          </FormField>
          <FormField label="Batch name" error={errors.batchName}>
            <input
              className={inputClass}
              value={form.batchName}
              onChange={set('batchName')}
              placeholder="e.g. MERN May 2026 B1"
            />
          </FormField>
          <FormField label="Month" error={errors.month}>
            <select
              className={inputClass}
              value={form.month}
              onChange={set('month')}
            >
              <option value="">Select month</option>
              {MONTHS.map(o => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Year" error={errors.year}>
            <select
              className={inputClass}
              value={form.year}
              onChange={set('year')}
            >
              <option value="">Select year</option>
              {yearOptions.map(o => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Phone" error={errors.phone}>
            <input
              className={inputClass}
              type="tel"
              maxLength={10}
              value={form.phone}
              onChange={set('phone')}
            />
          </FormField>
          <FormField label="Email" error={errors.email}>
            <input
              className={inputClass}
              type="email"
              value={form.email}
              onChange={set('email')}
            />
          </FormField>

          <FormField label="Course status">
            <select
              className={inputClass}
              value={form.courseStatus}
              onChange={set('courseStatus')}
            >
              {COURSE_STATUS.map(o => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Fee status">
            <select
              className={inputClass}
              value={form.fee}
              onChange={set('fee')}
            >
              {FEE_STATUS.map(o => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Project status">
            <select
              className={inputClass}
              value={form.project}
              onChange={set('project')}
            >
              {PROJECT_STATUS.map(o => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Placement status">
            <select
              className={inputClass}
              value={placementValue}
              onChange={set('placementStatus')}
              disabled={placementLocked}
            >
              {placementOptions.map(o => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </FormField>

          <div className="flex items-end">
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold ${eligible ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}
            >
              {eligible ? 'Eligible' : 'Not eligible'}
            </span>
          </div>
          <div className="sm:col-span-2">
            <FormField label="Remarks / closure">
              <textarea
                className={inputClass}
                rows={3}
                value={form.remarks}
                onChange={set('remarks')}
              />
            </FormField>
          </div>
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
            {saving ? 'Saving...' : student ? 'Save Changes' : 'Save student'}
          </button>
        </div>
      </form>
    </div>
  );
}
