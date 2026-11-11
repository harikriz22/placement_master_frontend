import { useEffect, useState } from 'react';
import { listBatchSwitches } from '../services/studentService';

export function useBatchSwitches() {
  const [switches, setSwitches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    listBatchSwitches()
      .then(setSwitches)
      .catch(() =>
        setError('Failed to fetch batch switches. Please try again later.')
      )
      .finally(() => setLoading(false));
  }, []);

  return { switches, loading, error };
}
