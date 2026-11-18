
export const COURSE_STATUS = [
  { value: 'Ongoing', label: 'Ongoing' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Project', label: 'Project' },
  { value: 'Drop', label: 'Drop' },
  { value: 'Hold', label: 'Hold' },
  { value: 'Rejoined', label: 'Rejoined' },

  { value: 'BatchSwitch/ongoing', label: 'BatchSwitch/ongoing' },
  { value: 'BatchSwitch/completed', label: 'BatchSwitch/completed' },
  { value: 'BatchSwitch/rejoined', label: 'BatchSwitch/rejoined' },
  { value: 'BatchSwitch/dropped', label: 'BatchSwitch/dropped' },
];

export const FEE_STATUS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

export const PROJECT_STATUS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

export const ELIGIBILITY_STATUS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

export const PLACEMENT_STATUS = [
  { value: 'Placement needed', label: 'Placement Needed' },
  { value: 'Placed', label: 'Placed' },
  { value: 'Project not completed', label: 'Project Not Completed' },
  { value: 'Placement not needed', label: 'Placement Not Needed' },
];

export const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

const thisYear = new Date().getFullYear();

export const YEARS = [thisYear - 1, thisYear, thisYear + 1].map(y => ({
  value: y,
  label: String(y),
}));

export const labelOf = (list, value) =>
  list.find(item => item.value === value)?.label ?? value;

export const BATCH_SWITCH_STATUS = COURSE_STATUS.filter(s =>
  s.value.startsWith('BatchSwitch/')
);
