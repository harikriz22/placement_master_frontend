export function applyPlacementRule(s) {
  if (!s.projectCompleted)
    return { ...s, placementStatus: 'project_not_completed' };
  if (s.placementStatus === 'project_not_completed')
    return { ...s, placementStatus: 'placement_needed' };
  return s;
}
