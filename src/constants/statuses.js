export const COURSE_STATUS = [
  {
    value: 'ongoing',
    label: 'Ongoing',
  },
  {
    value: 'completed',
    label: 'Completed',
  },
  {
    value: 'project',
    label: 'Project',
  },
  {
    value: 'drop',
    label: 'Drop',
  },
  {
    value: 'hold',
    label: 'Hold',
  },
  {
    value: 'rejoined',
    label: 'Rejoined',
  },

  {
    value: 'bs_ongoing',
    label: 'BatchSwitch/ongoing',
  },
  {
    value: 'bs_completed',
    label: 'BatchSwitch/completed',
  },
  {
    value: 'bs_rejoined',
    label: 'BatchSwitch/rejoined',
  },
  {
    value: 'bs_dropped',
    label: 'BatchSwitch/dropped',
  },
];

export const FEE_STATUS = [
  {
    value: 'yes',
    label: 'Yes',
  },
  {
    value: 'no',
    label: 'No',
  },
];

export const PROJECT_STATUS = [
  {
    value: 'yes',
    label: 'Yes',
  },
  {
    value: 'no',
    label: 'No',
  },
];

export const ELIGIBILITY_STATUS = [
  {
    value: 'yes',
    label: 'Yes',
  },
  {
    value: 'no',
    label: 'No',
  },
];

export const PLACEMENT_STATUS = [
  {
    value: 'placed',
    label: 'Placed',
  },
  {
    value: 'placement_needed',
    label: 'Placement Needed',
  },
  {
    value: 'project_not_completed',
    label: 'Project Not Completed',
  },
  {
    value: 'placement_not_needed',
    label: 'Placement Not Needed',
  },
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

export const labelOf = (list, value) =>
  list.find(item => item.value === value)?.label ?? value;
