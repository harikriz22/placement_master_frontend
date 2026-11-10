import { isEligible } from './eligibility';
const DROPPED = ['drop', 'bs_dropped'];
const REJOINED = ['rejoin', 'bs_rejoined'];
export function getDashboardCounts(students) {
  const totalEnrolled = students.length;
  const eligible = students.filter(isEligible).length;
  return {
    totalEnrolled,
    eligible,
    notEligible: totalEnrolled - eligible,
    dropped: students.filter(s => DROPPED.includes(s.courseStatus)).length,
    batchSwitch: students.filter(s => s.courseStatus.startsWith('bs_')).length,
    rejoined: students.filter(s => REJOINED.includes(s.courseStatus)).length,
    placed: students.filter(s => s.placementStatus === 'placed').length,
  };
}
