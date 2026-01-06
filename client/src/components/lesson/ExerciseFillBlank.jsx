const ExerciseFillBlank = ({ value, onChange }) => {
  return (
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Nhập câu trả lời..."
      className="w-full border rounded px-4 py-2 focus:outline-none focus:ring"
    />
  )
}

export default ExerciseFillBlank
