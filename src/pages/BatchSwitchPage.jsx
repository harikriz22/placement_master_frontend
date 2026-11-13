import Navbar from '../components/common/Navbar';
import { useBatchSwitches } from '../hooks/useBatchSwitches';

const COLUMNS = [
  { header: 'Name', render: r => r.studentName },
  { header: 'Email', render: r => r.email },

  { header: 'Old Course', render: r => r.oldCourse },
  {
    header: 'Old Batch',
    render: r => `Batch ${r.oldBatch}`,
  },

  { header: 'New Course', render: r => r.newCourse },
  {
    header: 'New Batch',
    render: r => `Batch ${r.newBatch}`,
  },

  {
    header: 'Old Month',
    render: r => `${r.oldMonth} ${r.oldYear}`,
  },
  {
    header: 'New Month',
    render: r => `${r.newMonth} ${r.newYear}`,
  },

  { header: 'Reason', render: r => r.reason || '-' },
  { header: 'Switched By', render: r => r.switchedBy || '-' },

  {
    header: 'Switched On',
    render: r =>
      new Date(r.switchedOn).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
  },
];

export default function BatchSwitchPage() {
  const { switches, loading, error } = useBatchSwitches();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Batch switch</h1>

        {loading && <p>Loading batch switches...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <>
            <p className="text-sm text-slate-500 mb-4">
              {switches.length} {switches.length === 1 ? 'switch' : 'switches'}
            </p>

            {switches.length === 0 ? (
              <p>No batch switches yet.</p>
            ) : (
              <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-orange-950 text-white">
                    <tr>
                      <th className="px-3 py-2 font-semibold">Sl. No</th>
                      {COLUMNS.map(c => (
                        <th key={c.header} className="px-3 py-2 font-semibold">
                          {c.header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {switches.map((record, index) => (
                      <tr key={record.id} className="hover:bg-amber-100">
                        <td className="px-3 py-2">{index + 1}</td>
                        {COLUMNS.map(c => (
                          <td
                            key={c.header}
                            className="px-3 py-2 whitespace-nowrap"
                          >
                            {c.render(record)}
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
