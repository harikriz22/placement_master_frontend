import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { useStudents } from '../hooks/useStudents';
import { COURSES } from '../constants/courses';

export default function BatchPage() {
  const { students, loading, error } = useStudents();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Courses</h1>
        <p className="text-sm text-amber-700 mb-6">
          Select a course to see its students.
        </p>

        {loading && <p>Loading courses...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
            {COURSES.map(course => {
              const count = students.filter(s => s.course === course).length;
              return (
                <Link
                  key={course}
                  to={`/batches/${encodeURIComponent(course)}`}
                  className=" bg-gradient-to-tr from-indigo-950 via-slate-950 to-indigo-950 border border-grey-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition text-slate-300"
                >
                  <h2 className="text-lg font-bold text-slate-300">{course}</h2>
                  <p className="text-sm  mt-1">{count} students</p>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
