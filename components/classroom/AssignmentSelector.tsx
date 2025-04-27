import React from 'react';
import { Assignment } from '@/lib/types/classroom';

interface AssignmentSelectorProps {
  assignments: Assignment[];
  selectedAssignmentId: number | null;
  onSelectAssignment: (assignmentId: number) => void;
}

export default function AssignmentSelector(props: AssignmentSelectorProps) {
  const { assignments, selectedAssignmentId, onSelectAssignment } = props;
  return (
    <select
      className="select select-bordered w-full mt-2"
      value={selectedAssignmentId ?? ''}
      onChange={e => onSelectAssignment(Number(e.target.value))}
    >
      <option value="" disabled>
        Choose an Assignment
      </option>
      {assignments.map(assignment => (
        <option key={assignment.assignment_id} value={assignment.assignment_id}>
          {assignment.name}
        </option>
      ))}
    </select>
  );
}

// export default AssignmentSelector;
