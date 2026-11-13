import Navbar from '../components/common/Navbar';
import { listStudents, updateStudent } from '../services/studentService';
import { listBatches } from '../services/batchService';
import { useEffect, useState } from 'react';

import {
  COURSE_STATUS,
  PLACEMENT_STATUS,
  ELIGIBILITY_STATUS,
  FEE_STATUS,
  PROJECT_STATUS,
} from '../constants/statuses';

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

export default function StudentPage() {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [search, setSearch] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [switchingStudent, setSwitchingStudent] = useState(null);

  const [rowError, setRowError] = useState(null);
  const [savingId, setSavingId] = useState(null);

  // Open add student form
  const openAdd = () => {
    setEditingStudent(null);
    setShowForm(true);
  };

  // Open edit student form
  const openEdit = student => {
    setEditingStudent(student);
    setShowForm(true);
  };

  // Close student form
  const closeForm = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  // Update filter
  const setFilter = key => value => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Fetch students and batches from backend
  useEffect(() => {
    async function fetchData() {
      try {
        const [studentData, batchData] = await Promise.all([
          listStudents(),
          listBatches(),
        ]);

        setStudents(studentData);
        setBatches(batchData);
      } catch (err) {
        console.error('Failed to fetch student data:', err);
        setError('Failed to fetch students. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Get batch details using student's batch ID
  const batchMap = new Map(
    batches.map(batch => [String(batch.id), batch])
  );

  const getStudentBatch = student => {
    return batchMap.get(String(student.batch));
  };

  // Dynamic batch filter options
  const batchOptions = batches.map(batch => ({
    value: String(batch.id),
    label: `${batch.course} ${batch.month} ${batch.year} - ${batch.batch_number}`,
  }));

  // Search and filter students
  const query = search.trim().toLowerCase();

  const filteredStudents = students.filter(student => {
    const matchesSearch =
      !query || student.name.toLowerCase().includes(query);

    const matchesBatch =
      !filters.batch || String(student.batch) === filters.batch;

    const matchesCourseStatus =
      !filters.courseStatus ||
      student.courseStatus === filters.courseStatus;

    const matchesEligibility =
      !filters.eligible ||
      isEligible(student) === (filters.eligible === 'true');

    const matchesFee =
      !filters.fee ||
      student.feeCompleted === (filters.fee === 'yes');

    const matchesProject =
      !filters.project ||
      student.projectCompleted === (filters.project === 'yes');

    const matchesPlacement =
      !filters.placementStatus ||
      student.placementStatus === filters.placementStatus;

    return (
      matchesSearch &&
      matchesBatch &&
      matchesCourseStatus &&
      matchesEligibility &&
      matchesFee &&
      matchesProject &&
      matchesPlacement
    );
  });

  const hasFilters =
    Object.values(filters).some(Boolean) || query !== '';

  // Update student field
  const handleFieldChange = async (student, changes) => {
    setSavingId(student.id);

    try {
      const saved = await updateStudent(student.id, changes);

      setStudents(prev =>
        prev.map(s => (s.id === saved.id ? saved : s))
      );

      setRowError(null);
    } catch (err) {
      console.error('Student update failed:', err);
      setRowError('Could not save the change. Please try again.');
    } finally {
      setSavingId(null);
    }
  };

  // Handle student save
  const handleStudentSaved = saved => {
    setStudents(prev => {
      const exists = prev.some(student => student.id === saved.id);

      if (exists) {
        return prev.map(student =>
          student.id === saved.id ? saved : student
        );
      }

      return [saved, ...prev];
    });

    closeForm();
  };

  // Handle batch switch save
  const handleBatchSwitchSaved = updated => {
    const newBatch = batches.find(
      batch => batch.id === updated.batch
    );

    setStudents(prev =>
      prev.map(student =>
        student.id === updated.student_id
          ? {
            ...student,
            batch: updated.batch,
            batchName: newBatch
              ? `${newBatch.course} ${newBatch.month} ${newBatch.year} - ${newBatch.batch_number}`
              : student.batchName,
          }
          : student
      )
    );

    setSwitchingStudent(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">

        {/* Page Header */}
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Students
          </h1>

          <button
            onClick={openAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-500"
          >
            Add Student
          </button>
        </div>

        {/* Student Form */}
        {showForm && (
          <StudentFormModal
            student={editingStudent}
            onClose={closeForm}
            onSaved={handleStudentSaved}
          />
        )}

        {/* Switch Batch Modal */}
        {switchingStudent && (
          <SwitchBatchModal
            student={switchingStudent}
            onClose={() => setSwitchingStudent(null)}
            onSaved={handleBatchSwitchSaved}
          />
        )}

        {/* Loading and Error */}
        {loading && <p>Loading students...</p>}

        {error && (
          <p className="text-red-500">{error}</p>
        )}

        {!loading && !error && students.length === 0 && (
          <p>No students yet.</p>
        )}

        {!loading && !error && students.length > 0 && (
          <>
            {/* Search */}
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
                className="w-full sm:w-80 border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filters */}
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

            {/* Clear Filters */}
            {hasFilters && (
              <button
                onClick={() => {
                  setFilters(EMPTY_FILTERS);
                  setSearch('');
                }}
                className="text-sm text-blue-600 hover:underline mb-3"
              >
                Clear filters
              </button>
            )}

            {/* Student Count */}
            <p className="text-sm text-slate-500 mb-4">
              {filteredStudents.length} of {students.length} students
            </p>
          </>
        )}

        {/* Row Error */}
        {rowError && (
          <p className="text-red-500 text-sm mb-3">
            {rowError}
          </p>
        )}

        {/* No Matching Students */}
        {!loading &&
          !error &&
          students.length > 0 &&
          filteredStudents.length === 0 && (
            <p>No students match these filters.</p>
          )}

        {/* Students Table */}
        {!loading && !error && filteredStudents.length > 0 && (
          <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl">
            <table className="min-w-full text-sm text-left">

              <thead className="bg-slate-100 text-slate-600">
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

                {filteredStudents.map((student, index) => {
                  const batch = getStudentBatch(student);

                  return (
                    <tr key={student.id} className="hover:bg-slate-50">

                      <td className="px-3 py-2">
                        {index + 1}
                      </td>

                      <td className="px-3 py-2 font-medium">
                        {student.name}
                      </td>

                      <td className="px-3 py-2">
                        {batch?.course || '-'}
                      </td>

                      <td className="px-3 py-2">
                        {student.batchName || '-'}
                      </td>

                      <td className="px-3 py-2">
                        {batch?.month || '-'}
                      </td>

                      <td className="px-3 py-2">
                        {batch?.year || '-'}
                      </td>

                      <td className="px-3 py-2 whitespace-nowrap">
                        {student.phone}
                      </td>

                      <td className="px-3 py-2 whitespace-nowrap">
                        {student.email}
                      </td>

                      {/* Course Status */}
                      <td className="px-3 py-2">
                        <CellSelect
                          label="Course status"
                          value={student.courseStatus}
                          options={COURSE_STATUS}
                          disabled={savingId === student.id}
                          onChange={v =>
                            handleFieldChange(student, {
                              courseStatus: v,
                            })
                          }
                        />
                      </td>

                      {/* Fee Status */}
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

                      {/* Project Status */}
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

                      {/* Eligibility */}
                      <td className="px-3 py-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${isEligible(student)
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                            }`}
                        >
                          {isEligible(student) ? 'Yes' : 'No'}
                        </span>
                      </td>

                      {/* Placement Status */}
                      <td className="px-3 py-2">
                        <CellSelect
                          label="Placement status"
                          value={student.placementStatus}
                          options={
                            student.projectCompleted
                              ? PLACEMENT_STATUS.filter(
                                option =>
                                  option.value !== 'Project not completed'
                              )
                              : PLACEMENT_STATUS
                          }
                          disabled={
                            !student.projectCompleted ||
                            savingId === student.id
                          }
                          onChange={v =>
                            handleFieldChange(student, {
                              placementStatus: v,
                            })
                          }
                        />
                      </td>

                      {/* Remarks */}
                      <td
                        className="px-3 py-2 max-w-xs truncate"
                        title={student.remarks}
                      >
                        {student.remarks}
                      </td>

                      {/* Updated By */}
                      <td className="px-3 py-2 whitespace-nowrap">
                        {student.updatedBy || '-'}
                      </td>

                      {/* Updated Date */}
                      <td className="px-3 py-2 whitespace-nowrap">
                        {student.updatedAt
                          ? new Date(student.updatedAt).toLocaleDateString(
                            'en-IN',
                            {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            }
                          )
                          : '-'}
                      </td>

                      {/* Actions */}
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1">

                          <button
                            onClick={() => openEdit(student)}
                            aria-label={`Edit ${student.name}`}
                            title="Edit"
                            className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                          >
                            <SquarePen className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setSwitchingStudent(student)}
                            aria-label={`Switch batch for ${student.name}`}
                            title="Switch batch"
                            className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                          >
                            <ArrowRightLeft className="w-4 h-4" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })}

              </tbody>
            </table>
          </div>
        )}

      </main>
    </div>
  );
}