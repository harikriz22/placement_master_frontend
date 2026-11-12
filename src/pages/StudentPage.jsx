import Navbar from '../components/common/Navbar';
import { listStudents, updateStudent } from '../services/studentService';
import { useEffect, useState } from 'react';
import {
  MONTHS,
  COURSE_STATUS,
  PLACEMENT_STATUS,
  ELIGIBILITY_STATUS,
  FEE_STATUS,
  PROJECT_STATUS,
  YEARS,
  labelOf,
} from '../constants/statuses';
import { useAuth } from '../context/AuthContext';
import { applyPlacementRule } from '../utils/studentRules';
import CellSelect from '../components/common/CellSelect';
import { isEligible } from '../utils/eligibility';
import FilterSelect from '../components/common/FilterSelect';
import StudentFormModal from '../components/students/StudentFormModal';
import SwitchBatchModal from '../components/students/SwitchBatchModal';
import { SquarePen, ArrowRightLeft } from 'lucide-react';
const EMPTY_FILTERS = {
  batch: '',
  courseStatus: '',
  eligible: '',
  fee: '',
  project: '',
  placementStatus: '',
};

const withCurrent = (options, current) =>
  options.some(o => o.value === current)
    ? options
    : [{ value: current, label: String(current) }, ...options];
export default function StudentPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const { user } = useAuth();
  const [rowError, setRowError] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [search, setSearch] = useState('');

  const [switchingStudent, setSwitchingStudent] = useState(null);

  const query = search.trim().toLowerCase();
  const openAdd = () => {
    setEditingStudent(null);
    setShowForm(true);
  };
  const openEdit = student => {
    setEditingStudent(student);
    setShowForm(true);
  };
  const closeForm = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  const setFilter = key => value => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredStudents = students.filter(
    s =>
      (!query || s.name.toLowerCase().includes(query)) &&
      (!filters.batch || s.batchName === filters.batch) &&
      (!filters.courseStatus || s.courseStatus === filters.courseStatus) &&
      (!filters.eligible || isEligible(s) === (filters.eligible === 'yes')) &&
      (!filters.fee || s.feeCompleted === (filters.fee === 'yes')) &&
      (!filters.project ||
        s.projectCompleted === (filters.project === 'yes')) &&
      (!filters.placementStatus ||
        s.placementStatus === filters.placementStatus)
  );

  const hasFilters = Object.values(filters).some(Boolean) || query !== '';
  const handleFieldChange = async (student, changes) => {
    const next = applyPlacementRule({ ...student, ...changes });
    setSavingId(student.id);
    try {
      const saved = await updateStudent(student.id, next, user.name);
      setStudents(prev => prev.map(s => (s.id === saved.id ? saved : s)));
      setRowError(null);
    } catch {
      setRowError('Could not save the change. Please try again.');
    } finally {
      setSavingId(null);
    }
  };
  useEffect(() => {
    async function fetchStudents() {
      try {
        const data = await listStudents();
        setStudents(data);
      } catch (err) {
        setError('Failed to fetch students. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);
  const batchOptions = [...new Set(students.map(s => s.batchName))]
    .sort()
    .map(b => ({ value: b, label: b }));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8  ">
        <div className="flex items-center justify-between mb-3 ">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Students</h1>
          <button
            onClick={openAdd}
            className="px-4 py-2 bg-gradient-to-tr from-red-500 via-orange-500 to-red-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-500"
          >
            Add Student
          </button>
        </div>
        {showForm && (
          <StudentFormModal
            student={editingStudent}
            onClose={closeForm}
            onSaved={saved => {
              setStudents(prev =>
                editingStudent
                  ? prev.map(s => (s.id === saved.id ? saved : s))
                  : [saved, ...prev]
              );
              closeForm();
            }}
          />
        )}

        {switchingStudent && (
          <SwitchBatchModal
            student={switchingStudent}
            onClose={() => setSwitchingStudent(null)}
            onSaved={updated => {
              setStudents(prev =>
                prev.map(s => (s.id === updated.id ? updated : s))
              );
              setSwitchingStudent(null);
            }}
          />
        )}

        {loading && <p>Loading students...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && students.length === 0 && <p>No students yet.</p>}
        {!loading && !error && students.length > 0 && (
          <>
            <div className="mb-3">
              <label htmlFor="student-search" className="sr-only">
                Search students by name
              </label>
              <input
                id="student-search"
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by student name"
                className="w-full sm:w-80 border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
              <FilterSelect
                label="Batch"
                value={filters.batch}
                onChange={setFilter('batch')}
                options={batchOptions}
              />
              <FilterSelect
                label="Course status"
                value={filters.courseStatus}
                onChange={setFilter('courseStatus')}
                options={COURSE_STATUS}
              />
              <FilterSelect
                label="Eligibility"
                value={filters.eligible}
                onChange={setFilter('eligible')}
                options={ELIGIBILITY_STATUS}
              />
              <FilterSelect
                label="Fee status"
                value={filters.fee}
                onChange={setFilter('fee')}
                options={FEE_STATUS}
              />
              <FilterSelect
                label="Project status"
                value={filters.project}
                onChange={setFilter('project')}
                options={PROJECT_STATUS}
              />
              <FilterSelect
                label="Placement status"
                value={filters.placementStatus}
                onChange={setFilter('placementStatus')}
                options={PLACEMENT_STATUS}
              />
            </div>
            {hasFilters && (
              <button
                onClick={() => {
                  setFilters(EMPTY_FILTERS);
                  setSearch('');
                }}
                className="text-sm text-cyan-800 hover:underline mb-3"
              >
                Clear filters
              </button>
            )}

            <p className="text-sm text-slate-500 mb-4">
              {filteredStudents.length} of {students.length} students
            </p>
          </>
        )}
        {rowError && <p className="text-red-500 text-sm mb-3">{rowError}</p>}
        {!loading &&
          !error &&
          students.length > 0 &&
          filteredStudents.length === 0 && (
            <p>No students match these filters.</p>
          )}
        {!loading && !error && filteredStudents.length > 0 && (
          <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-orange-950 text-white">
                <tr>
                  <th className="px-3 py-2 font-semibold">Sl. No</th>
                  <th className="px-3 py-2 font-semibold">Name</th>
                  <th className="px-3 py-2 font-semibold">Course</th>
                  <th className="px-3 py-2 font-semibold">Batch Name</th>
                  <th className="px-3 py-2 font-semibold">Month</th>
                  <th className="px-3 py-2 font-semibold">Year</th>
                  <th className="px-3 py-2 font-semibold">Phone</th>
                  <th className="px-3 py-2 font-semibold">Email</th>
                  <th className="px-3 py-2 font-semibold">Course Status</th>
                  <th className="px-3 py-2 font-semibold">Fee Status</th>
                  <th className="px-3 py-2 font-semibold">Project Status</th>
                  <th className="px-3 py-2 font-semibold">Eligibility</th>
                  <th className="px-3 py-2 font-semibold">Placement Status</th>
                  <th className="px-3 py-2 font-semibold">Remark or Closure</th>
                  <th className="px-3 py-2 font-semibold">Last Updated By</th>
                  <th className="px-3 py-2 font-semibold">Updated Date</th>
                  <th className="px-3 py-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student, index) => (
                  <tr key={student.id} className="hover:bg-amber-100">
                    <td className="px-3 py-2">{index + 1}</td>
                    <td className="px-3 py-2 font-medium">{student.name}</td>
                    <td className="px-3 py-2">{student.course}</td>
                    <td className="px-3 py-2">{student.batchName}</td>
                    <td className="px-3 py-2">
                      <CellSelect
                        label="Month"
                        value={student.month}
                        options={MONTHS}
                        disabled={savingId === student.id}
                        onChange={v =>
                          handleFieldChange(student, { month: Number(v) })
                        }
                      />
                    </td>
                    <td className="px-3 py-2 ">
                      <CellSelect
                        label="Year"
                        value={student.year}
                        options={withCurrent(YEARS, student.year)}
                        disabled={savingId === student.id}
                        onChange={v =>
                          handleFieldChange(student, { year: Number(v) })
                        }
                      />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {student.phone}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {student.email}
                    </td>
                    <td className="px-3 py-2">
                      <CellSelect
                        label="Course status"
                        value={student.courseStatus}
                        options={COURSE_STATUS}
                        disabled={savingId === student.id}
                        onChange={v =>
                          handleFieldChange(student, { courseStatus: v })
                        }
                      />
                    </td>
                    <td className="px-3 py-2">
                      <CellSelect
                        label="Fee status"
                        value={student.feeCompleted ? 'yes' : 'no'}
                        options={FEE_STATUS}
                        disabled={savingId === student.id}
                        onChange={v =>
                          handleFieldChange(student, {
                            feeCompleted: v === 'yes',
                          })
                        }
                      />
                    </td>
                    <td className="px-3 py-2">
                      <CellSelect
                        label="Project status"
                        value={student.projectCompleted ? 'yes' : 'no'}
                        options={PROJECT_STATUS}
                        disabled={savingId === student.id}
                        onChange={v =>
                          handleFieldChange(student, {
                            projectCompleted: v === 'yes',
                          })
                        }
                      />
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          isEligible(student)
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {isEligible(student) ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <CellSelect
                        label="Placement status"
                        value={student.placementStatus}
                        options={
                          student.projectCompleted
                            ? PLACEMENT_STATUS.filter(
                                o => o.value !== 'project_not_completed'
                              )
                            : PLACEMENT_STATUS
                        }
                        disabled={
                          !student.projectCompleted || savingId === student.id
                        }
                        onChange={v =>
                          handleFieldChange(student, { placementStatus: v })
                        }
                      />
                    </td>
                    <td
                      className="px-3 py-2 max-w-xs truncate"
                      title={student.remarks}
                    >
                      {student.remarks}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {student.updatedBy}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {new Date(student.updatedAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(student)}
                          aria-label={`Edit ${student.name}`}
                          title="Edit"
                          className="text-cyan-800 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                        >
                          <SquarePen className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSwitchingStudent(student)}
                          aria-label={`Switch batch for ${student.name}`}
                          title="Switch batch"
                          className="text-pink-600 hover:text-rose-800 p-1 rounded hover:bg-blue-50"
                        >
                          <ArrowRightLeft className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
