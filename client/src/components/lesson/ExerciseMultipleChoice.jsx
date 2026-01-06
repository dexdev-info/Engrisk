const ExerciseMultipleChoice = ({ options, value, onChange }) => {
  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`w-full text-left px-4 py-2 rounded border transition
            ${
              value === opt
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

export default ExerciseMultipleChoice
