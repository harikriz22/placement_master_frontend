const students = [
  {
    id: 1,
    name: 'Anu',
    course: 'MERN Stack',
    batchName: 'MERN May 2026',
    month: 5,
    year: 2026,
    phone: '9023758492',
    email: 'anu@demo.com',
    courseStatus: 'ongoing',
    feeCompleted: true,
    projectCompleted: false,
    placementStatus: 'project_not_completed',
    remarks: '',
    updatedBy: 'Sandra Shaji',
    updatedAt: '2026-11-10T14:30:00',
  },
  {
    id: 2,
    name: 'Anna',
    course: 'UI/UX',
    batchName: 'UI/UX April 2026',
    month: 4,
    year: 2026,
    phone: '9847000002',
    email: 'anna@demo.com',
    courseStatus: 'ongoing',
    feeCompleted: true,
    projectCompleted: true,
    placementStatus: 'placement_not_needed',
    remarks: '',
    updatedBy: 'Sandra Shaji',
    updatedAt: '2026-10-08T14:30:00',
  },
  {
    id: 3,
    name: 'Meera',
    course: 'Digital Marketing',
    batchName: 'DM May 2026',
    month: 5,
    year: 2026,
    phone: '9847000003',
    email: 'meera@demo.com',
    courseStatus: 'ongoing',
    feeCompleted: true,
    projectCompleted: false,
    placementStatus: 'project_not_completed',
    remarks: '',
    updatedBy: 'Sandra Shaji',
    updatedAt: '2026-11-09T14:30:00',
  },
  {
    id: 4,
    name: 'Ram',
    course: 'Digital Marketing',
    batchName: 'DM June 2026',
    month: 6,
    year: 2026,
    phone: '9847635278',
    email: 'ram@demo.com',
    courseStatus: 'completed',
    feeCompleted: true,
    projectCompleted: true,
    placementStatus: 'placed',
    remarks: 'Offer accepted',
    updatedBy: 'Sandra Shaji',
    updatedAt: '2026-11-01T14:30:00',
  },
  {
    id: 5,
    name: 'Sara',
    course: 'Devops',
    batchName: 'Devops October 2026',
    month: 10,
    year: 2026,
    phone: '9847635279',
    email: 'sara@demo.com',
    courseStatus: 'ongoing',
    feeCompleted: true,
    projectCompleted: true,
    placementStatus: 'placement_needed',
    remarks: '',
    updatedBy: 'Sandra Shaji',
    updatedAt: '2026-11-01T14:30:00',
  },
  {
    id: 6,
    name: 'Joel',
    course: 'MERN Stack',
    batchName: 'MERN May 2026',
    month: 5,
    year: 2026,
    phone: '9847000006',
    email: 'joel@demo.com',
    courseStatus: 'drop',
    feeCompleted: true,
    projectCompleted: true,
    placementStatus: 'placement_not_needed',
    remarks: 'Left for family reasons. Fee and project were already done.',
    updatedBy: 'Sandra Shaji',
    updatedAt: '2026-10-20T14:30:00',
  },
  {
    id: 7,
    name: 'Divya',
    course: 'UI/UX',
    batchName: 'UI/UX April 2026',
    month: 4,
    year: 2026,
    phone: '9847000007',
    email: 'divya@demo.com',
    courseStatus: 'hold',
    feeCompleted: false,
    projectCompleted: false,
    placementStatus: 'project_not_completed',
    remarks: '',
    updatedBy: 'Sandra Shaji',
    updatedAt: '2026-10-25T14:30:00',
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
  students.unshift(student);
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

const switches = [];

export async function listBatchSwitches() {
  await new Promise(r => setTimeout(r, 300));
  return [...switches];
}

export async function switchBatch(
  studentId,
  { newCourse, newBatch, month, year, courseStatus },
  memberName
) {
  await new Promise(r => setTimeout(r, 300));
  const i = students.findIndex(s => s.id === studentId);
  if (i === -1) throw new Error('Student not found');
  const old = students[i];

  const record = {
    id: Math.max(0, ...switches.map(s => s.id)) + 1,
    studentId: old.id,
    studentName: old.name,
    email: old.email,
    oldCourse: old.course,
    oldBatch: old.batchName,
    oldMonth: old.month,
    oldYear: old.year,
    newCourse,
    newBatch,
    newMonth: month,
    newYear: year,
    switchedBy: memberName,
    switchedOn: new Date().toISOString(),
  };
  switches.unshift(record);

  students[i] = {
    ...old,
    course: newCourse,
    batchName: newBatch,
    month,
    year,
    courseStatus,
    updatedBy: memberName,
    updatedAt: new Date().toISOString(),
  };
  return { student: students[i], record };
}
