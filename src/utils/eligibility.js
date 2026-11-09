const DROPPED = ['drop', 'bs_dropped'];
export const isEligible = s =>
  s.feeCompleted && s.projectCompleted && !DROPPED.includes(s.courseStatus);
