'use client';

import ReactMarkdown from 'react-markdown';
import { Assignment, Question } from '@/lib/types/classroom';
import { useEffect, useState } from 'react';
import { BsEye } from 'react-icons/bs';
import { FaRegEdit } from 'react-icons/fa';
import QuestionForm from '@/components/classroom/QuestionForm';
import { uploadFile } from '@/lib/s3/utils';
import LoadingIndicator from '@/components/general/LoadingIndicator';
import ErrorAlertBanner from '@/components/general/ErrorAlertBanner';

interface ViewEditAssignmentFormProps {
  classroomId: string;
}

type DefaultQuestion = {
  question_id: number;
  name: string | null;
  prompt: string | null;
  accepted_file_types: string | null;
  solution_s3_path: string | null;
};

export default function ViewEditAssignmentForm(props: ViewEditAssignmentFormProps) {
  const { classroomId } = props;

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questionPrompt, setQuestionPrompt] = useState<string | null>(null);
  const [loadingPrompt, setLoadingPrompt] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questionToEdit, setQuestionToEdit] = useState<Question | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [solutionUrl, setSolutionUrl] = useState(null);
  const [questionPrompts, setQuestionPrompts] = useState<Record<number, string>>({});
  const [visiblePrompts, setVisiblePrompts] = useState<Set<number>>(new Set());

  // Fetch assignments
  useEffect(() => {
    async function fetchAssignments() {
      setLoadingAssignments(true);
      setError(null);
      try {
        const response = await fetch(`/api/assignment?classroomId=${classroomId}`);
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const { data } = await response.json();
        // console.log(`Response for '/api/assignment'`);
        // for (const [key, value] of Object.entries(data)) {
        //   console.log('Key:', key);
        //   console.log('Value:', value);
        // }
        setAssignments(data as Assignment[]);
      } catch (err) {
        setError('Failed to load assignments.');
        console.error('Error fetching assignments:', err);
      } finally {
        setLoadingAssignments(false);
      }
    }

    fetchAssignments();
  }, [classroomId]);

  useEffect(() => {
    if (!selectedAssignmentId) {
      setQuestions(null);
      return;
    }
    async function fetchQuestions() {
      setLoadingQuestions(true);
      setError(null);
      try {
        const response = await fetch(`/api/question?assignmentId=${selectedAssignmentId}`);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const { data } = await response.json();
        // console.log(`Response for '/api/question/'`);
        // for (const [key, value] of Object.entries(data)) {
        //   console.log('Key:', key);
        //   console.log('Value:', value);
        // }
        setQuestions(data as Question[]);
      } catch (err) {
        setError('Failed to load questions');
        console.error('Error fetching questions:', err);
      } finally {
        setLoadingQuestions(false);
      }
    }

    fetchQuestions();
  }, [selectedAssignmentId]);

  useEffect(() => {
    if (!questions || questions.length === 0) {
      return;
    }
    questions.forEach(question => {
      if (question.question_s3_path && !questionPrompts[question.question_id]) {
        fetchPromptFromS3(question.question_s3_path, question.question_id);
      }
      // if (question.question_s3_path) {
      //   fetchPromptFromS3(question.question_s3_path, question.question_id);
      // }
    });
  }, [questions, questionPrompts]);

  if (loadingAssignments) return <LoadingIndicator />;

  return (
    <div className="p-4 border rounded-lg">
      {error && <ErrorAlertBanner message={error} />}

      <h2 className="text-2xl mb-2">Select Assignment</h2>
      <select
        className="select select-bordered w-full mt-2"
        value={selectedAssignmentId ?? ''}
        onChange={e => setSelectedAssignmentId(Number(e.target.value))}
      >
        <option value="" disabled>
          Choose an assignment
        </option>
        {assignments.map(assignment => (
          <option key={assignment.assignment_id} value={assignment.assignment_id}>
            {assignment.name}
          </option>
        ))}
      </select>

      {loadingQuestions && (
        <div className="flex w-full flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-4">
              <div className="skeleton h-4 w-20"></div>
            </div>
          </div>
          <div className="skeleton h-32 w-full"></div>
        </div>
      )}

      {questions && questions.length > 0 ? (
        questions.map(question => (
          <div className="mt-4" key={question.question_id}>
            <h3 className="text-xl font-semibold">Questions</h3>
            <div className="mt-4 p-3 border rounded-lg relative">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">{question.name}</h4>
                <div className="flex gap-4">
                  <button
                    data-tip="View Solution File"
                    className="text-gray-500 cursor-pointer hover:text-gray-700 text-2xl tooltip"
                    onClick={() => {
                      setSelectedQuestion(question);
                      handleView();
                    }}
                  >
                    <BsEye />
                  </button>
                  <FaRegEdit
                    className="text-gray-500 cursor-pointer hover:text-gray-700 text-2xl"
                    onClick={() =>
                      openModal({
                        ...question,
                        assignment_id: selectedAssignmentId ?? 0,
                        question_number: null,
                        created_at: null,
                        sort_order: null,
                        question_s3_path: null,
                      })
                    }
                  />
                </div>
              </div>

              {/* Display the prompt for each question */}
              {/* {questionPrompts[question.question_id] ? (
                <ReactMarkdown>{questionPrompts[question.question_id]}</ReactMarkdown>
              ) : (
                <p>No prompt found.</p>
              )} */}

              {/* Button to toggle prompt visibility */}
              {visiblePrompts.has(question.question_id) ? (
                <div className="btn" onClick={() => handleHidePrompt(question)}>
                  Hide Question Prompt
                </div>
              ) : (
                <div className="btn" onClick={() => handleReadFile(question)}>
                  {loadingPrompt ? 'Loading...' : 'View Question Prompt'}
                </div>
              )}

              {/* Display the prompt for each question if it's visible */}
              {visiblePrompts.has(question.question_id) && questionPrompts[question.question_id] ? (
                <ReactMarkdown>{questionPrompts[question.question_id]}</ReactMarkdown>
              ) : (
                visiblePrompts.has(question.question_id) && <p>No prompt found.</p>
              )}
            </div>
          </div>
        ))
      ) : questions && questions.length === 0 ? (
        <p>No questions found.</p>
      ) : (
        <></>
      )}

      {isModalOpen && questionToEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-black border p-6 rounded-lg shadow-lg w-120">
            <h3 className="text-xl font-semibold mb-4">Edit Question</h3>
            <QuestionForm
              index={0}
              question={{
                question_number: questionToEdit.question_number || 0,
                name: questionToEdit.name || '',
                prompt: questionToEdit.prompt || '',
                accepted_file_types: questionToEdit.accepted_file_types || '',
                solution_s3_path: questionToEdit.solution_s3_path || '',
              }}
              updateQuestion={(index, field, value) => {
                if (questionToEdit) {
                  setQuestionToEdit((prev: Question | null) => {
                    if (!prev) return prev;
                    return {
                      ...prev,
                      [field]: value,
                    };
                  });
                }
              }}
              handleFileChange={handleFileChange}
            />
            <div className="flex justify-end gap-4 mt-4">
              <button className="btn btn-primary" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={saveQuestion}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for viewing solution */}
      <dialog
        id="solution_modal"
        className="modal fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50"
      >
        <div className="modal-box bg-black border p-6 rounded-lg shadow-lg w-120">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg">Solution</h3>
          {solutionUrl ? (
            <iframe src={solutionUrl} className="w-full h-96"></iframe>
          ) : (
            <p className="py-4">No solution available</p>
          )}
        </div>
      </dialog>
    </div>
  );

  function openModal(question: Question) {
    setQuestionToEdit({
      ...question,
      assignment_id: question.assignment_id ?? selectedAssignmentId,
      question_number: question.question_number ?? null,
      created_at: question.created_at ?? null,
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setQuestionToEdit(null);
  }

  // Save the edited question
  async function saveQuestion() {
    // TODO: delete the existing file from S3, if a new one is uploaded
    if (questionToEdit) {
      const file = uploadedFile;
      if (file) {
        const fileKey = await uploadFile(file);
        if (!fileKey) {
          setError(`Failed to upload file for question: ${questionToEdit.name}`);
          return;
        }
        questionToEdit.solution_s3_path = fileKey;
      }
      try {
        const response = await fetch(`/api/question`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(questionToEdit),
        });

        if (!response.ok) {
          setError('Failed to update question');
          throw new Error(`API error: ${response.status}`);
        }
        const updatedQuestion = await response.json();
        // console.log('Updated Question:', updatedQuestion);

        if (questions && questions.length > 0) {
          setQuestions(
            prevQuestions =>
              prevQuestions &&
              prevQuestions.map(q => (q.question_id === updatedQuestion.question_id ? updatedQuestion : q)),
          );
        }
        closeModal();
      } catch (err) {
        console.error('Error saving question:', err);
        setError('Failed to save question');
      }
    }
  }

  function handleFileChange(questionId: number, file: File | null) {
    setUploadedFile(file);
    console.log('Uploaded file:', file);
  }

  async function handleView() {
    if (!selectedQuestion) {
      setError('An error occurred. We are unable to find the question you selected. Please try again later.');
      return;
    } else {
      setError(null);
    }

    try {
      const key = selectedQuestion.solution_s3_path;
      if (!key) {
        setError('File not found.');
        return;
      }
      const response = await fetch(`/api/s3?operation=download&key=${key}`);
      const data = await response.json();
      if (response.ok) {
        window.open(data.signedUrl, '_blank');
      } else {
        console.error('Error handling file:', data.error);
        setError('Something went wrong! Please try again');
      }
    } catch (error) {
      console.error('Error fetching signed URL:', error);
      setError('Something went wrong! Please try again');
    }
  }

  function handleReadFile(question: Question) {
    if (question?.question_s3_path && !questionPrompts[question.question_id]) {
      fetchPromptFromS3(question.question_s3_path, question.question_id);
    }
    setVisiblePrompts(prev => new Set(prev.add(question.question_id)));
  }

  function handleHidePrompt(question: Question) {
    setVisiblePrompts(prev => {
      const newVisiblePrompts = new Set(prev);
      newVisiblePrompts.delete(question.question_id); // Hide prompt
      return newVisiblePrompts;
    });
  }

  async function fetchPromptFromS3(s3Path: string, questionId: number) {
    try {
      setLoadingPrompt(true);
      console.log(`Downloading question prompt from S3: ${s3Path}`);
      const response = await fetch(`/api/s3?operation=download&key=${s3Path}&options=readFile`);
      const data = await response.json();
      if (response.ok) {
        // setQuestionPrompt(data.questionPrompt);
        setQuestionPrompts(prevPrompts => ({
          ...prevPrompts,
          [questionId]: data.fileContent,
        }));
      } else {
        console.error('Error handling file:', data.error);
        setError('Failed to load prompt.');
      }
    } catch (error) {
      console.error('Error fetching question prompt file:', error);
      setError('Something went wrong while fetching the question prompt file');
    } finally {
      setLoadingPrompt(false);
    }
  }
}
