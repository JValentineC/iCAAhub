import { useEffect, useState } from 'react';
import { Assignment, QuestionAndQuestionSubmission } from '@/lib/types/classroom';
import AssignmentSelector from '@/components/classroom/AssignmentSelector';
import QuestionSubmissionDetails from '@/components/classroom/QuestionSubmissionDetails';
import FileModal from '@/components/classroom/FileModal';

interface StudentSubmissionsViewProps {
  classroomId: string;
  userId: number;
}

interface SubmittedAssignmentBlock {
  assignments: Assignment[];
  selectedAssignmentId: number | null;
  loading: { assignments: boolean; submissions: boolean };
  error: string | null;
  submissions: QuestionAndQuestionSubmission[];
  fileUrl: string | null;
  isModalOpen: boolean;
}

export default function StudentSubmissionsView(props: StudentSubmissionsViewProps) {
  const { classroomId, userId } = props;

  const emptyBlock: SubmittedAssignmentBlock = {
    assignments: [] as Assignment[],
    selectedAssignmentId: null as number | null,
    loading: { assignments: true, submissions: false },
    error: null as string | null,
    submissions: [] as QuestionAndQuestionSubmission[],
    fileUrl: null as string | null,
    isModalOpen: false,
  };

  const [state, setState] = useState(emptyBlock);

  const setLoading = (key: 'assignments' | 'submissions', value: boolean) => {
    setState(prev => ({ ...prev, loading: { ...prev.loading, [key]: value } }));
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
      setState(prev => ({ ...prev, [key]: data[key] || data }));
    } catch (error) {
      setState(prev => ({ ...prev, error: error instanceof Error ? error.message : 'An unknown error occurred' }));
    } finally {
      setLoading(key, false);
    }
  };

  useEffect(() => {
    fetchData(`/api/assignment?classroomId=${classroomId}`, 'assignments');
  }, [classroomId]);

  useEffect(() => {
    setState(prev => ({ ...prev, submissions: [], error: '' }));

    if (state.selectedAssignmentId !== null) {
      fetchData(`/api/student_submissions?assignmentId=${state.selectedAssignmentId}&userId=${userId}`, 'submissions');
    }
  }, [state.selectedAssignmentId]);

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

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-2xl mb-2">Your Submissions</h2>
      {state.error && <p className="text-red-500">{state.error}</p>}

      <AssignmentSelector
        assignments={state.assignments}
        selectedAssignmentId={state.selectedAssignmentId}
        onSelectAssignment={id => setState(prev => ({ ...prev, selectedAssignmentId: id }))}
      />

      {state.selectedAssignmentId && state.submissions && (
        <QuestionSubmissionDetails questionSubmissions={state.submissions || []} onViewFile={handleViewFile} />
      )}

      <FileModal
        isOpen={state.isModalOpen}
        fileUrl={state.fileUrl}
        onClose={() => setState(prev => ({ ...prev, isModalOpen: false }))}
      />
    </div>
  );
}
