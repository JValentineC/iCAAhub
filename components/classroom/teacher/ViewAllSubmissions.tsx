import { useEffect, useState } from 'react';
import { Assignment, QuestionAndQuestionSubmission } from '@/lib/types/classroom';
import AssignmentSelector from '@/components/classroom/AssignmentSelector';
import StudentList from '@/components/classroom/teacher/StudentList';
import QuestionSubmissionDetails from '@/components/classroom/QuestionSubmissionDetails';
import FileModal from '@/components/classroom/FileModal';

interface ViewAllSubmissionsProps {
  classroomId: string;
}

interface SubmittedAssignmentBlock {
  assignments: Assignment[];
  selectedAssignmentId: number | null;
  selectedStudentId: number | null;
  loading: { assignments: boolean; submissions: boolean };
  error: string | null;
  submissions: QuestionAndQuestionSubmission[];
  fileUrl: string | null;
  isModalOpen: boolean;
}

export default function ViewAllSubmissions(props: ViewAllSubmissionsProps) {
  const { classroomId } = props;

  const emptyBlock: SubmittedAssignmentBlock = {
    assignments: [] as Assignment[],
    selectedAssignmentId: null as number | null,
    selectedStudentId: null as number | null,
    loading: { assignments: true, submissions: false },
    error: null as string | null,
    submissions: [] as QuestionAndQuestionSubmission[],
    fileUrl: null as string | null,
    isModalOpen: false,
  };

  const [studentSubmission, setStudentSubmission] = useState(emptyBlock);

  const setLoading = (key: 'assignments' | 'submissions', value: boolean) => {
    setStudentSubmission(prev => ({ ...prev, loading: { ...prev.loading, [key]: value } }));
  };

  const fetchData = async (url: string, key: 'assignments' | 'submissions') => {
    try {
      setLoading(key, true);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`No ${key} found`);
      }
      const { data } = await response.json();
      // console.log(`Fetched ${key}:`, data);
      // setStudentSubmission(prev => ({ ...prev, [key]: data[key] || data }));
    } catch (error) {
      setStudentSubmission(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      }));
    } finally {
      setLoading(key, false);
    }
  };

  useEffect(() => {
    fetchData(`/api/assignment?classroomId=${classroomId}`, 'assignments');
  }, [classroomId]);

  useEffect(() => {
    setStudentSubmission(prev => ({ ...prev, submissions: [], selectedStudentId: null, error: '' })); // Clear old submissions
    if (studentSubmission.selectedAssignmentId !== null) {
      fetchData(`/api/student_submissions?assignmentId=${studentSubmission.selectedAssignmentId}`, 'submissions');
    }
  }, [studentSubmission.selectedAssignmentId]);

  const handleViewFile = async (key: string | null) => {
    if (!key) {
      setStudentSubmission(prev => ({ ...prev, error: 'No file available' }));
      return;
    }
    try {
      const response = await fetch(`/api/s3?operation=download&key=${key}`);
      const data = await response.json();
      if (response.ok) {
        setStudentSubmission(prev => ({ ...prev, fileUrl: data.signedUrl, isModalOpen: true }));
      } else {
        setStudentSubmission(prev => ({ ...prev, error: 'Something went wrong! Please try again' }));
      }
    } catch (error) {
      setStudentSubmission(prev => ({ ...prev, error: 'Something went wrong! Please try again' }));
    }
  };

  const resetStudentSelection = () => {
    setStudentSubmission(prev => ({ ...prev, selectedStudentId: null }));
  };

  const selectedSubmittedAssignments = (studentSubmission: SubmittedAssignmentBlock) => {
    return (
      <div>
        <StudentList
          submissions={studentSubmission.submissions}
          onSelectStudent={id => {
            setStudentSubmission(prev => ({ ...prev, selectedStudentId: id }));
          }}
          onBack={resetStudentSelection}
        />
        {
          <QuestionSubmissionDetails
            questionSubmissions={studentSubmission.submissions.filter(
              sub => sub.student_user_id === studentSubmission.selectedStudentId,
            )}
            onViewFile={handleViewFile}
          />
        }
      </div>
    );
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-2xl mb-2">View Submissions</h2>
      {studentSubmission.error && <p className="text-red-500">{studentSubmission.error}</p>}

      <AssignmentSelector
        assignments={studentSubmission.assignments}
        selectedAssignmentId={studentSubmission.selectedAssignmentId}
        onSelectAssignment={id => setStudentSubmission(prev => ({ ...prev, selectedAssignmentId: id }))}
      />

      {studentSubmission.selectedAssignmentId && selectedSubmittedAssignments(studentSubmission)}
      <FileModal
        isOpen={studentSubmission.isModalOpen}
        fileUrl={studentSubmission.fileUrl}
        onClose={() => setStudentSubmission(prev => ({ ...prev, isModalOpen: false }))}
      />
    </div>
  );
}
