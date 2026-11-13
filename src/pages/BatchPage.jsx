import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import AddBatchModal from '../components/batches/AddBatchModal';
import { listCourses } from '../services/batchService';
import { Plus, BookOpen, Users } from 'lucide-react';

export default function BatchPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  async function fetchCourses() {
    try {
      setLoading(true);
      setError('');

      const data = await listCourses();
      setCourses(data);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load courses.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCourses();
  }, []);

  async function handleBatchSaved() {
    setShowModal(false);
    await fetchCourses();
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">
              Courses
            </h1>

            <p className="text-sm text-slate-500">
              Manage courses and view their batches and students.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={18} />
            Add Batch
          </button>
        </div>

        {loading && (
          <p className="text-slate-500">Loading courses...</p>
        )}

        {error && (
          <div className="text-red-600 bg-red-50 p-3 rounded-lg">
            {error}

            <button
              onClick={fetchCourses}
              className="ml-3 underline"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && courses.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
            <BookOpen size={40} className="mx-auto text-slate-400 mb-3" />

            <h2 className="text-lg font-semibold text-slate-800">
              No courses available
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Create your first batch to get started.
            </p>
          </div>
        )}

        {!loading && !error && courses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {courses.map(item => (
              <Link
                key={item.course}
                to={`/batches/${encodeURIComponent(item.course)}`}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition"
              >
                <h2 className="text-lg font-bold text-slate-900">
                  {item.course}
                </h2>

                <div className="flex gap-5 mt-4">

                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <BookOpen size={17} />
                    <span>
                      {item.total_batches} batches
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Users size={17} />
                    <span>
                      {item.total_students} students
                    </span>
                  </div>

                </div>
              </Link>
            ))}

          </div>
        )}

      </main>

      {showModal && (
        <AddBatchModal
          onClose={() => setShowModal(false)}
          onSaved={handleBatchSaved}
        />
      )}

    </div>
  );
}