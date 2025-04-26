import React, { useState } from 'react';
import ClassroomNavBar from '@/components/classroom/ClassroomNavBar';
import AssignmentSubmitForm from '@/components/classroom/student/AssignmentSubmitForm';
import SubmittedAssignments from '@/components/classroom/student/SubmittedAssignments';

interface StudentFormProps {
  classroomId: string;
  classroomName: string;
  userId: number;
}

export default function StudentForm(props: StudentFormProps) {
  const { classroomId, classroomName, userId } = props;
  const [selectedOption, setSelectedOption] = useState('Submit Assignment'); // Default selected option

  const studentMenu = [
    { label: 'Submit Assignment', onClick: () => setSelectedOption('Submit Assignment') },
    { label: 'Your Submissions', onClick: () => setSelectedOption('Your Submissions') },
  ];

  return (
    <div>
      <ClassroomNavBar classroomName={classroomName} menuItems={studentMenu} />
      <div className="p-4">
        {selectedOption === 'Submit Assignment' && <AssignmentSubmitForm classroomId={classroomId} userId={userId} />}
        {selectedOption === 'Your Submissions' && <SubmittedAssignments classroomId={classroomId} userId={userId} />}
      </div>
    </div>
  );
}
