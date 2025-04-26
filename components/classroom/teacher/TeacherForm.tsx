import React, { useState } from 'react';
import ClassroomNavBar from '@/components/classroom/ClassroomNavBar';
import CreateAssignmentForm from '@/components/classroom/teacher/CreateAssignmentForm';
import ViewEditAssignmentForm from '@/components/classroom/teacher/ViewEditAssignmentForm';
import ViewAllSubmissions from '@/components/classroom/teacher/ViewAllSubmissions';

interface TeacherFormProps {
  classroomId: string;
  classroomName: string;
  userId: number;
}
export default function TeacherForm(props: TeacherFormProps) {
  const { classroomId, classroomName, userId } = props;
  const [selectedOption, setSelectedOption] = useState('Create Assignment'); // Default selected option

  const teacherMenu = [
    { label: 'Create Assignment', onClick: () => setSelectedOption('Create Assignment') },
    { label: 'View/Edit Assignments', onClick: () => setSelectedOption('View/Edit Assignments') },
    { label: 'Assignment Submissions', onClick: () => setSelectedOption('Assignment Submissions') },
  ];

  return (
    <div>
      <ClassroomNavBar classroomName={classroomName} menuItems={teacherMenu} />
      <div className="p-4">
        {selectedOption === 'Create Assignment' && <CreateAssignmentForm classroomId={classroomId} />}
        {selectedOption === 'View/Edit Assignments' && <ViewEditAssignmentForm classroomId={classroomId} />}
        {selectedOption === 'Assignment Submissions' && <ViewAllSubmissions classroomId={classroomId} />}
      </div>
    </div>
  );
}

// export default TeacherForm;
