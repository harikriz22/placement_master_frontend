import Navbar from '../components/common/Navbar';
import { listStudents } from '../services/studentService';
import { useEffect, useState } from 'react';
import {
  MONTHS,
  COURSE_STATUS,
  PLACEMENT_STATUS,
  labelOf,
} from '../constants/statuses';
import { isEligible } from '../utils/eligibility';
export default function StudentPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8  ">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Students</h1>
        {!loading && !error && (
          <p className="text-sm text-slate-500 mb-4">
            {students.length} students
          </p>
        )}
        {loading && <p>Loading students...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && students.length === 0 && <p>No students yet.</p>}

        {!loading && !error && students.length > 0 && (
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
                  <th className="px-3 py-2 font-semibold">Fee Completed</th>
                  <th className="px-3 py-2 font-semibold">Project Status</th>
                  <th className="px-3 py-2 font-semibold">Placement Status</th>
                  <th className="px-3 py-2 font-semibold">Remark or Closure</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student, index) => (
                  <tr key={student.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2">{index + 1}</td>
                    <td className="px-3 py-2 font-medium">{student.name}</td>
                    <td className="px-3 py-2">{student.course}</td>
                    <td className="px-3 py-2">{student.batchName}</td>
                    <td className="px-3 py-2">{student.month}</td>
                    <td className="px-3 py-2">{student.year}</td>
                    <td className="px-3 py-2">{student.phone}</td>
                    <td className="px-3 py-2">{student.email}</td>
                    <td className="px-3 py-2">
                      {labelOf(COURSE_STATUS, student.courseStatus)}
                    </td>
                    <td className="px-3 py-2">
                      {student.feeCompleted ? 'Yes' : 'No'}
                    </td>
                    <td className="px-3 py-2">
                      {student.projectCompleted ? 'Yes' : 'No'}
                    </td>
                    <td className="px-3 py-2">
                      {labelOf(PLACEMENT_STATUS, student.placementStatus)}
                    </td>
                    <td className="px-3 py-2">{student.remarks}</td>
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
