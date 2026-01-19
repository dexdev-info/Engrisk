const ExerciseMultipleChoice = ({
  options,
  value,
  onChange,
  disabled = false
}) => {
  const getLetter = (index) => String.fromCharCode(65 + index)

  return (
    <div className="space-y-1">
      {' '}
      {/* Giảm khoảng cách giữa các câu */}
      {options.map((opt, index) => {
        const isSelected = value === opt
        return (
          <button
            key={opt}
            onClick={() => !disabled && onChange(opt)}
            disabled={disabled}
            className={`
              group w-full text-left py-2 px-3 rounded-md transition-all duration-200
              flex items-center gap-3 text-sm font-sans
              ${
                isSelected
                  ? 'bg-gray-100 text-black' // Selected: Nền xám rất nhạt, chữ đen
                  : 'bg-transparent hover:bg-gray-50 text-gray-600 hover:text-gray-900' // Normal
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <span
              className={`
                shrink-0 text-xs font-bold w-5 h-5 flex items-center justify-center rounded border
                ${
                  isSelected
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 text-gray-400 group-hover:border-gray-500 group-hover:text-gray-600'
                }
              `}
            >
              {getLetter(index)}
            </span>

            {/* Content */}
            <span className={isSelected ? 'font-semibold' : 'font-medium'}>
              {opt}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default ExerciseMultipleChoice
