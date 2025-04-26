import React from 'react';
import FileTypeSelector from '@/components/classroom/FileTypeSelector';
import Input from '@/components/classroom/Input';

interface QuestionFormProps {
  index: number;
  question: {
    question_number: number;
    name: string | null;
    prompt: string | null;
    accepted_file_types: string | null;
    solution_s3_path: string | null;
  };
  updateQuestion: (index: number, field: string, value: any) => void;
  handleFileChange: (questionId: number, file: File | null) => void;
}

export default function QuestionForm(props: QuestionFormProps) {
  const { index, question, updateQuestion, handleFileChange } = props;

  return (
    <div className="card bg-base-100 w-full shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Question {index + 1}</h2>
        <Input
          setStateChange={value => updateQuestion(index, 'name', value)}
          placeholder="Question Title"
          value={question.name || ''}
        />

        <textarea
          className="textarea textarea-bordered w-full mt-2"
          placeholder="Prompt"
          value={question.prompt || ''}
          onChange={e => updateQuestion(index, 'prompt', e.target.value)}
        />
        <h3 className="block font-semibold">Accepted File Types</h3>
        <FileTypeSelector
          index={index}
          selectedTypes={question.accepted_file_types || ''}
          onChange={types => updateQuestion(index, 'accepted_file_types', types)}
        />
        <h3 className="form-control">
          Solution File{' '}
          <input
            type="file"
            className="file-input file-input-bordered w-full max-w-xs"
            onChange={e => {
              const file = e.target.files && e.target.files.length === 1 ? e.target.files[0] : null;
              handleFileChange(index, file);
            }}
          />
        </h3>
      </div>
    </div>
  );
}

// export default QuestionForm;
