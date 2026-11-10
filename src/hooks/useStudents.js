import { useEffect, useState } from 'react';
import { listStudents } from '../services/studentService';

export const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    listStudents()
      .then(setStudents)
      .catch(() => setErr('Failed to fetch students'))
      .finally(() => setLoading(false));
  }, []);
  return { students, loading, err };
};
