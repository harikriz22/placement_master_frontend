import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import FilterSelect from '../components/common/FilterSelect';
import { useStudents } from '../hooks/useStudents';
import { COURSES } from '../constants/courses';
import { MONTHS } from '../constants/statuses';
import { isEligible } from '../utils/eligibility';

const COLUMNS = [
  { header: 'Name', render: s => s.name },
  { header: 'Batch', render: s => s.batchName },
  { header: 'Phone', render: s => s.phone },
  { header: 'Email', render: s => s.email },
];

const CARD = 'bg-white border border-slate-200 rounded-xl p-4';

export default function CourseStudentsPage() {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const { course } = useParams();
  const { students, loading, error } = useStudents();
  const isValidCourse = COURSES.includes(course);

  const courseStudents = students
    .filter(s => s.course === course)
    .sort((a, b) => a.name.localeCompare(b.name));

  const monthOptions = MONTHS.filter(m =>
    courseStudents.some(s => s.month === m.value)
  );
  const yearOptions = [...new Set(courseStudents.map(s => s.year))]
    .sort((a, b) => a - b)
    .map(y => ({ value: y, label: String(y) }));

  const visibleStudents = courseStudents.filter(
    s =>
      (!month || s.month === Number(month)) &&
      (!year || s.year === Number(year))
  );

  const total = visibleStudents.length;
  const eligibleCount = visibleStudents.filter(isEligible).length;
  const notEligibleCount = total - eligibleCount;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        <Link to="/batches" className="text-sm text-blue-600 hover:underline">
          ← Back to Batches
        </Link>

        {!isValidCourse ? (
          <p className="mt-6 text-slate-700">Course not found.</p>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-slate-900 mt-3 mb-4">
              {course}
            </h1>

            {loading && <p>Loading students...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
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
                {(month || year) && (
                  <button
                    onClick={() => {
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
                    <p className="text-sm text-slate-500">Total students</p>
                    <p className="text-3xl font-black text-slate-900">
                      {total}
                    </p>
                  </div>
                  <div className={CARD}>
                    <p className="text-sm text-slate-500">Eligible</p>
                    <p className="text-3xl font-black text-emerald-600">
                      {eligibleCount}
                    </p>
                  </div>
                  <div className={CARD}>
                    <p className="text-sm text-slate-500">Not eligible</p>
                    <p className="text-3xl font-black text-amber-600">
                      {notEligibleCount}
                    </p>
                  </div>
                </div>

                {courseStudents.length === 0 ? (
                  <p>No students enrolled in this course yet.</p>
                ) : visibleStudents.length === 0 ? (
                  <p>No students for this month and year.</p>
                ) : (
                  <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl">
                    <table className="min-w-full text-sm text-left">
                      <thead className="bg-slate-100 text-slate-600">
                        <tr>
                          <th className="px-3 py-2 font-semibold">Sl. No</th>
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
                          <tr key={student.id} className="hover:bg-slate-50">
                            <td className="px-3 py-2">{index + 1}</td>
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
          </>
        )}
      </main>
    </div>
  );
}
