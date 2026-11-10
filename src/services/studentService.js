const students = [
  {
    id: 1,
    name: 'Anu',
    course: 'MERN Stack',
    batchName: 'MERN May 2026',
    month: 5,
    year: 2026,
    phone: 90237584920,
    email: 'student@demo.com',
    courseStatus: 'ongoing',
    feeCompleted: true,
    projectCompleted: false,
    placementStatus: 'project_not_completed',
    remarks: '',
    updatedBy: '',
    updatedAt: '2026-11-10T14:30:00',
  },
  {
    id: 2,
    name: 'Anna',
    course: 'UI/UX',
    batchName: 'UI/UX April 2026',
    month: 4,
    year: 2026,
    phone: '',
    email: '',
    courseStatus: 'ongoing',
    feeCompleted: true,
    projectCompleted: true,
    placementStatus: 'placement_not_needed',
    remarks: '',
    updatedBy: '',
    updatedAt: '2026-10-08T14:30:00',
  },
  {
    id: 3,
    name: 'Meera',
    course: 'Digital Marketing',
    batchName: 'MERN May 2026 ',
    month: 5,
    year: 2026,
    phone: '',
    email: '',
    courseStatus: 'ongoing',
    feeCompleted: true,
    projectCompleted: false,
    placementStatus: 'placement_needed',
    remarks: '',
    updatedBy: '',
    updatedAt: '2026-11-09T14:30:00',
  },
  {
    id: 4,
    name: 'Ram',
    course: 'Digital Marketing',
    batchName: 'MERN June 2026 ',
    month: 6,
    year: 2026,
    phone: '9847635278',
    email: 'ram@demo.com',
    courseStatus: 'ongoing',
    feeCompleted: true,
    projectCompleted: true,
    placementStatus: 'placed',
    remarks: '',
    updatedBy: '',
    updatedAt: '2026-11-01T14:30:00',
  },
];
export async function listStudents() {
  await new Promise(r => setTimeout(r, 300));
  return [...students];
}
export async function addStudent(data, memberName) {
  await new Promise(r => setTimeout(r, 300));
  const student = {
    ...data,
    id: Math.max(0, ...students.map(s => s.id)) + 1,
    updatedBy: memberName,
    updatedAt: new Date().toISOString(),
  };
  students.push(student);
  return student;
}
export async function updateStudent(id, data, memberName) {
  await new Promise(r => setTimeout(r, 300));
  const i = students.findIndex(s => s.id === id);
  if (i === -1) throw new Error('Student not found');
  students[i] = {
    ...students[i],
    ...data,
    updatedBy: memberName,
    updatedAt: new Date().toISOString(),
  };
  return students[i];
}
