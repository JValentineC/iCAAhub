interface SubmitButtonProps {
  handleSubmit: () => void;
  disabled?: boolean;
}

export default function SubmitButton(props: SubmitButtonProps) {
  const { handleSubmit, disabled = false } = props;
  return (
    <button className="btn btn-primary w-full mt-4" onClick={handleSubmit} disabled={disabled}>
      {disabled ? 'Submitting...' : 'Submit'}
    </button>
  );
}
