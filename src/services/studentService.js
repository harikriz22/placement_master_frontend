import api from './api';
import { getAuthToken, refreshAccessToken } from './authService';

// Add authentication to API requests
async function authenticatedRequest(config) {
  let token = getAuthToken();

  try {
    return await api({
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    if (error.response?.status !== 401) {
      throw error;
    }

    // Refresh expired access token
    token = await refreshAccessToken();

    // Retry the original request
    return api({
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

// Convert backend student data into frontend format
function formatStudent(student) {
  return {
    id: student.id,
    name: student.name,
    email: student.email,
    phone: student.phone,

    batch: student.batch,
    batchName: student.batch_name,

    courseStatus: student.course_status,
    feeCompleted: student.fee_completed,
    projectCompleted: student.project_completed,
    eligible: student.eligible,
    placementStatus: student.placement_status,

    remarks: student.remarks,
    updatedBy: student.updated_by,
    updatedAt: student.updated_at,
  };
}

// Convert frontend data into backend format
function formatStudentPayload(data) {
  const payload = {};

  const fields = {
    name: 'name',
    email: 'email',
    phone: 'phone',
    batch: 'batch',
    courseStatus: 'course_status',
    feeCompleted: 'fee_completed',
    projectCompleted: 'project_completed',
    placementStatus: 'placement_status',
    remarks: 'remarks',
  };

  Object.entries(fields).forEach(([frontendField, backendField]) => {
    if (data[frontendField] !== undefined) {
      payload[backendField] = data[frontendField];
    }
  });

  return payload;
}

// Get all students
export async function listStudents() {
  let page = 1;
  let allStudents = [];
  let totalPages = 1;

  while (page <= totalPages) {
    const response = await authenticatedRequest({
      method: 'GET',
      url: '/students/',
      params: { page },
    });

    const result = response.data;

    allStudents = [...allStudents, ...result.data];

    totalPages = result.pagination.total_pages;
    page++;
  }

  return allStudents.map(formatStudent);
}

// Add student
export async function addStudent(data) {
  const response = await authenticatedRequest({
    method: 'POST',
    url: '/students/',
    data: formatStudentPayload(data),
  });

  return formatStudent(response.data.data);
}

// Update student
export async function updateStudent(id, data) {
  const response = await authenticatedRequest({
    method: 'PATCH',
    url: `/students/${id}/`,
    data: formatStudentPayload(data),
  });

  return formatStudent(response.data.data);
}

// Get all batch switch history
export async function listBatchSwitches() {
  const response = await authenticatedRequest({
    method: 'GET',
    url: '/students/batch-switch-history/',
  });

  return response.data.data.map(record => ({
    id: record.id,
    studentName: record.student_name,
    email: record.student_email,
    phone: record.student_phone,

    oldCourse: record.old_course,
    oldBatch: record.old_batch_number,
    oldMonth: record.old_month,
    oldYear: record.old_year,

    newCourse: record.new_course,
    newBatch: record.new_batch_number,
    newMonth: record.new_month,
    newYear: record.new_year,

    reason: record.reason,
    switchedBy: record.switched_by,
    switchedOn: record.switched_at,
  }));
}

// Get individual student batch history
export async function getStudentBatchHistory(studentId) {
  const response = await authenticatedRequest({
    method: 'GET',
    url: `/students/${studentId}/batch-history/`,
  });

  return response.data.data;
}

// Switch student batch
export async function switchBatch(studentId, { newBatch, reason = '' }) {
  const response = await authenticatedRequest({
    method: 'POST',
    url: `/students/${studentId}/switch-batch/`,
    data: {
      new_batch: newBatch,
      reason,
    },
  });

  return response.data.data;
}