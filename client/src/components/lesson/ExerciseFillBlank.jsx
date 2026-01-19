import React from 'react'

const ExerciseFillBlank = ({ value, onChange, disabled = false }) => {
  return (
    <div className="py-2">
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Nhập đáp án..."
        // Style: Underline mỏng, không viền xung quanh, chữ Serif để tạo cảm giác viết tay/giấy
        className={`
          w-full bg-transparent py-1 text-base font-serif text-gray-900
          border-b border-gray-300
          focus:outline-none focus:border-black
          placeholder:text-gray-400 placeholder:font-sans placeholder:text-sm
          transition-colors
          ${disabled ? 'cursor-not-allowed opacity-50' : ''}
        `}
      />
    </div>
  )
}

export default ExerciseFillBlank