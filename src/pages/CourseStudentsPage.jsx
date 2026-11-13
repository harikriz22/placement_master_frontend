import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import FilterSelect from '../components/common/FilterSelect';
import { listBatches } from '../services/batchService';
import { listStudents } from '../services/studentService';
import {
  COURSE_STATUS,
  PLACEMENT_STATUS,
  labelOf,
} from '../constants/statuses';

const COLUMNS = [
  { header: 'Name', render: s => s.name },
  { header: 'Email', render: s => s.email },
  { header: 'Phone', render: s => s.phone },
  {
    header: 'Course Status',
    render: s => labelOf(COURSE_STATUS, s.courseStatus),
  },
  {
    header: 'Fee Status',
    render: s => s.feeCompleted ? 'Completed' : 'Pending',
  },
  {
    header: 'Project Status',
    render: s => s.projectCompleted ? 'Completed' : 'Pending',
  },
  {
    header: 'Eligibility',
    render: s => (
      <span
        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
          s.eligible
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-amber-100 text-amber-700'
        }`}
      >
        {s.eligible ? 'Yes' : 'No'}
      </span>
    ),
  },
  {
    header: 'Placement Status',
    render: s => labelOf(PLACEMENT_STATUS, s.placementStatus),
  },
];

const CARD = 'bg-white border border-slate-200 rounded-xl p-4';

export default function CourseStudentsPage() {
  const { course } = useParams();

  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);

  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [batch, setBatch] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError('');

        const [batchData, studentData] = await Promise.all([
          listBatches(),
          listStudents(),
        ]);

        setBatches(batchData);
        setStudents(studentData);
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to load course students.'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const courseBatches = batches.filter(
    b => b.course === course
  );

  const isValidCourse = courseBatches.length > 0;

  const batchIds = new Set(
    courseBatches.map(b => b.id)
  );

  const courseStudents = students
    .filter(s => batchIds.has(Number(s.batch)))
    .sort((a, b) => a.name.localeCompare(b.name));

  const monthOptions = [...new Set(
    courseBatches.map(b => b.month)
  )]
    .sort()
    .map(m => ({ value: m, label: m }));

  const yearOptions = [...new Set(
    courseBatches.map(b => b.year)
  )]
    .sort((a, b) => a - b)
    .map(y => ({ value: y, label: String(y) }));

  const batchOptions = courseBatches.map(b => ({
    value: String(b.id),
    label: `${b.month} ${b.year} - Batch ${b.batch_number}`,
  }));

  const visibleStudents = courseStudents.filter(student => {
    const studentBatch = courseBatches.find(
      b => b.id === Number(student.batch)
    );

    return (
      (!batch || String(student.batch) === batch) &&
      (!month || studentBatch?.month === month) &&
      (!year || String(studentBatch?.year) === year)
    );
  });

  const total = visibleStudents.length;

  const eligibleCount = visibleStudents.filter(
    s => s.eligible
  ).length;

  const notEligibleCount = total - eligibleCount;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">

        <Link
          to="/batches"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to Courses
        </Link>

        {loading && (
          <p className="mt-6 text-slate-500">
            Loading students...
          </p>
        )}

        {error && (
          <p className="mt-6 text-red-500">
            {error}
          </p>
        )}

        {!loading && !error && !isValidCourse && (
          <p className="mt-6 text-slate-700">
            Course not found.
          </p>
        )}

        {!loading && !error && isValidCourse && (
          <>
            <h1 className="text-2xl font-bold text-slate-900 mt-3 mb-4">
              {course}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">

              <FilterSelect
                label="Batch"
                value={batch}
                onChange={setBatch}
                options={batchOptions}
              />

              <FilterSelect
                label="Month"
                value={month}
                onChange={setMonth}
                options={monthOptions}
              />

              <FilterSelect
                label="Year"
                value={year}
                onChange={setYear}
                options={yearOptions}
              />

            </div>

            {(batch || month || year) && (
              <button
                onClick={() => {
                  setBatch('');
                  setMonth('');
                  setYear('');
                }}
                className="text-sm text-blue-600 hover:underline mb-3"
              >
                Clear filters
              </button>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

              <div className={CARD}>
                <p className="text-sm text-slate-500">
                  Total students
                </p>

                <p className="text-3xl font-black text-slate-900">
                  {total}
                </p>
              </div>

              <div className={CARD}>
                <p className="text-sm text-slate-500">
                  Eligible
                </p>

                <p className="text-3xl font-black text-emerald-600">
                  {eligibleCount}
                </p>
              </div>

              <div className={CARD}>
                <p className="text-sm text-slate-500">
                  Not eligible
                </p>

                <p className="text-3xl font-black text-amber-600">
                  {notEligibleCount}
                </p>
              </div>

            </div>

            {courseStudents.length === 0 ? (
              <p>No students enrolled in this course yet.</p>
            ) : visibleStudents.length === 0 ? (
              <p>No students match these filters.</p>
            ) : (
              <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl">

                <table className="min-w-full text-sm text-left">

                  <thead className="bg-slate-100 text-slate-600">
                    <tr>
                      <th className="px-3 py-2 font-semibold">
                        Sl. No
                      </th>

                      {COLUMNS.map(c => (
                        <th
                          key={c.header}
                          className="px-3 py-2 font-semibold"
                        >
                          {c.header}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">

                    {visibleStudents.map((student, index) => (
                      <tr
                        key={student.id}
                        className="hover:bg-slate-50"
                      >
                        <td className="px-3 py-2">
                          {index + 1}
                        </td>

                        {COLUMNS.map(c => (
                          <td
                            key={c.header}
                            className="px-3 py-2 whitespace-nowrap"
                          >
                            {c.render(student)}
                          </td>
                        ))}
                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>
            )}

          </>
        )}

      </main>
    </div>
  );
}