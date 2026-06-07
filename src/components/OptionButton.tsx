interface OptionButtonProps {
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
}

const OptionButton = ({ label, description, selected, onClick }: OptionButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`input-option text-left w-full ${selected ? 'input-option-selected' : ''}`}
    >
      <div className="font-medium text-foreground">{label}</div>
      {description && <div className="text-sm text-muted-foreground mt-1">{description}</div>}
    </button>
  );
};

export default OptionButton;
