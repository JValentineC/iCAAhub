import React, { useEffect, useState } from 'react';
import { QuestionAndQuestionSubmission } from '@/lib/types/classroom';
import QuestionSubmissionDetails from '@/components/classroom/QuestionSubmissionDetails';
import FileModal from '@/components/classroom/FileModal';

interface StudentListProps {
  submissions: QuestionAndQuestionSubmission[];
  onSelectStudent: (studentId: number) => void;
  onBack: () => void;
}

interface SubmittedAssignmentBlock {
  selectedStudentId: number | null;
  fileUrl: string | null;
  isModalOpen: boolean;
  error: string | null;
  showStudentList: boolean;
}

export default function StudentList(props: StudentListProps) {
  const { submissions, onSelectStudent, onBack } = props;
  const emptyBlock: SubmittedAssignmentBlock = {
    selectedStudentId: null as number | null,
    fileUrl: null as string | null,
    isModalOpen: false,
    error: null as string | null,
    showStudentList: true,
  };

  const [state, setState] = useState(emptyBlock);

  useEffect(() => {
    setState(prev => ({
      ...prev,
      selectedStudentId: null,
      showStudentList: true,
    }));
  }, [submissions]);

  const handleViewFile = async (key: string | null) => {
    if (!key) {
      setState(prev => ({ ...prev, error: 'No file available' }));
      return;
    }
    try {
      const response = await fetch(`/api/s3?operation=download&key=${key}`);
      const data = await response.json();
      if (response.ok) {
        setState(prev => ({ ...prev, fileUrl: data.signedUrl, isModalOpen: true }));
      } else {
        setState(prev => ({ ...prev, error: 'Something went wrong! Please try again' }));
      }
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Something went wrong! Please try again' }));
    }
  };

  const selectedSubmittedAssignments = () => {
    return (
      <div>
        {
          <QuestionSubmissionDetails
            questionSubmissions={submissions.filter(sub => sub.student_user_id === state.selectedStudentId)}
            onViewFile={handleViewFile}
          />
        }
      </div>
    );
  };
  return (
    <div>
      {state.showStudentList && (
        <div>
          {submissions.map(submission => (
            <p
              key={submission.assignment_submission_id}
              className="bg-black border p-6 rounded-lg shadow-lg w-120"
              onClick={() => {
                if (submission.student_user_id) {
                  onSelectStudent(submission.student_user_id);
                  setState(prev => ({
                    ...prev,
                    selectedStudentId: submission.student_user_id,
                    showStudentList: false,
                  }));
                } else {
                  console.error('student_user_id is undefined');
                }
              }}
            >
              {submission.student_user_id ?? 'Unknown Student'}
            </p>
          ))}
        </div>
      )}
      {!state.showStudentList && (
        <button
          className="btn btn-outline mt-4 ml-4"
          onClick={() => {
            setState(prev => ({
              ...prev,
              showStudentList: true,
              selectedStudentId: null,
            }));
            onBack();
          }}
        >
          Back
        </button>
      )}
      {selectedSubmittedAssignments()}
      <FileModal
        isOpen={state.isModalOpen}
        fileUrl={state.fileUrl}
        onClose={() => setState(prev => ({ ...prev, isModalOpen: false }))}
      />
    </div>
  );
}
