'use client';

import { useCallback, useEffect, useState } from 'react';
import SubmitButton from '@/components/general/SubmitButtonClass';
import QuestionIndicators from '@/components/classroom/QuestionIndicatorsClass';
import TextArea from '@/components/classroom/TextArea';
import Input from '@/components/classroom/Input';
import QuestionForm from '@/components/classroom/QuestionForm';
import { uploadFile } from '@/lib/s3/utils';

interface CreateAssignmentFormProps {
  classroomId: string;
  // userId: number;
}

export default function CreateAssignmentForm(props: CreateAssignmentFormProps) {
  const { classroomId } = props;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [numQuestions, setNumQuestions] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<{ [key: string]: string | null }>({});
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: number]: File | null }>({});

  const [questions, setQuestions] = useState<
    {
      question_number: number;
      name: string | null;
      prompt: string | null;
      accepted_file_types: string | null;
      solution_s3_path: string | null;
    }[]
  >([]);

  const completedQuestions = questions.map(q => !!(q.name?.trim() && q.prompt?.trim()));
  const isValidNumQuestions = Number(numQuestions) > 0 && Number(numQuestions) <= 20;

  // const [errorMessage, setErrorMessage] = useState('');
  // const [isLoading, setIsLoading] = useState(false);

  const [progressPercentage, setProgressPercentage] = useState(0);

  useEffect(() => {
    const num = Number(numQuestions);
    setQuestions(
      num > 0 && num <= 20
        ? Array.from({ length: num }, (_, index) => ({
            question_number: index,
            name: '',
            prompt: '',
            accepted_file_types: '',
            solution_s3_path: '',
          }))
        : [],
    );
  }, [numQuestions]);

  useEffect(() => {
    const filledQuestions = questions.filter(question => question.name?.trim() && question.prompt?.trim()).length;
    const totalQuestions = Number(numQuestions);
    const progress = totalQuestions > 0 ? (filledQuestions / totalQuestions) * 100 : 0;
    setProgressPercentage(progress);
  }, [questions]);

  const updateQuestion = (id: number, field: string, value: any) => {
    setQuestions(prev => prev.map(q => (q.question_number === id ? { ...q, [field]: value } : q)));
  };

  const handleFileChange = useCallback((questionId: number, file: File | null) => {
    setUploadedFiles(prev => ({ ...prev, [questionId]: file }));
  }, []);

  const validateForm = () => {
    const newErrors: { [key: string]: string | null } = {};

    if (!title.trim()) newErrors.title = 'Title is required.';
    if (!description.trim()) newErrors.description = 'Description is required.';
    if (!dueDate) newErrors.dueDate = 'Due date is required.';
    else if (new Date(dueDate) <= new Date()) newErrors.dueDate = 'Due date must be in the future.';

    const num = Number(numQuestions);
    if (num < 1 || num > 20) newErrors.numQuestions = 'Number of questions must be between 1 and 20.';

    questions.forEach((question, index) => {
      if (!question.name?.trim()) newErrors[`questionTitle${index}`] = `Title is required for question ${index + 1}.`;
      if (!question.prompt?.trim())
        newErrors[`questionPrompt${index}`] = `Description is required for question ${index + 1}.`;
    });

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSubmit() {
    setError({});
    setSuccessMessage(null);
    // setIsLoading(true);
    setSubmitting(true);

    if (!validateForm()) {
      setSubmitting(false);
      return;
    }

    try {
      for (const question of questions) {
        const file = uploadedFiles[question.question_number];
        if (file) {
          const fileKey = await uploadFile(file);
          if (!fileKey) {
            throw new Error(`Failed to upload file for question: ${question.name}`);
          }
          question.solution_s3_path = fileKey;
        }
      }

      const payload = {
        classroomId: Number(classroomId),
        name: title,
        description,
        dueDate: new Date(dueDate).toISOString(),
        questions: questions,
      };

      const response = await fetch('/api/assignment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error('Failed to submit assignment');
      }
      setSuccessMessage('Assignment submitted successfully!');
      setTitle('');
      setDescription('');
      setNumQuestions('');
      setDueDate('');
      setQuestions([]);
      setCurrentQuestion(0);
    } catch (error) {
      console.error('Error submitting assignment:', error);
      setError({ form: 'Error submitting assignment. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-4 border rounded-lg">
      <h1 className="text-2xl">Create Assignment</h1>

      {error.form && <p className="text-red-500">{error.form}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      <Input setStateChange={setTitle} placeholder="Title" value={title} disabled={submitting} />
      {error.title && <p className="text-red-500">{error.title}</p>}

      <TextArea value={description} setStateChange={setDescription} placeholder="Description" disabled={submitting} />
      {error.description && <p className="text-red-500">{error.description}</p>}

      <p>Due-Date:</p>
      {error.dueDate && <p className="text-red-500">{error.dueDate}</p>}

      <div className="flex justify-around items-center mt-4">
        <Input setStateChange={setDueDate} type="date" value={dueDate} className="w-1/2" disabled={submitting} />
        <Input
          type="text"
          disabled={submitting}
          value={numQuestions}
          setStateChange={value => {
            if (/^0+\d/.test(value)) {
              value = String(Number(value));
            }
            setNumQuestions(value);
          }}
          placeholder="Number of questions"
          className="w-1/2 no-spinner"
        />
      </div>

      {!isValidNumQuestions && <p className="text-red-500">Number of questions must be between 1 and 20.</p>}

      {/* {numQuestions && !isValidNumQuestions && (
        <p className="text-red-500">Invalid number of questions. It must be between 1 and 20.</p>
      )} */}

      {/* {questions.map((_, index) => (
        <div key={index}>
          {error[`questionTitle${index}`] && <p className="text-red-500">{error[`questionTitle${index}`]}</p>}
          {error[`questionPrompt${index}`] && <p className="text-red-500">{error[`questionPrompt${index}`]}</p>}
        </div>
      ))} */}

      {isValidNumQuestions && (
        <div className="mt-12">
          <QuestionIndicators
            numQuestions={Number(numQuestions)}
            currentQuestion={currentQuestion}
            setCurrentQuestion={setCurrentQuestion}
            completedQuestions={completedQuestions}
          />
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          {isValidNumQuestions &&
            questions.map((question, index) => (
              <div key={question.question_number} className={index === currentQuestion ? 'block' : 'hidden'}>
                <QuestionForm
                  index={index}
                  question={question}
                  updateQuestion={updateQuestion}
                  handleFileChange={handleFileChange}
                />
              </div>
            ))}
        </div>

        <div className="flex justify-center items-center">
          {isValidNumQuestions && (
            <div className="radial-progress" style={{ '--value': progressPercentage } as any} role="progressbar">
              {progressPercentage.toFixed(0)}%
            </div>
          )}
        </div>
      </div>

      <SubmitButton handleSubmit={handleSubmit} disabled={submitting} />
    </div>
  );
}
