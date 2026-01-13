import React from 'react'

const LEVELS = [
  { label: 'Beginner', value: 'beginner', desc: 'Từ cơ bản cho người mới' },
  { label: 'Intermediate', value: 'intermediate', desc: 'Từ trung cấp' },
  { label: 'Advanced', value: 'advanced', desc: 'Từ nâng cao' }
]

const VocabularyLevelGrid = ({ onSelect }) => {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {LEVELS.map((l) => (
        <div
          key={l.value}
          onClick={() => onSelect(l.value)}
          className="cursor-pointer rounded-xl border p-6 hover:shadow-md transition bg-white"
        >
          <h3 className="text-lg font-semibold">{l.label}</h3>
          <p className="text-sm text-gray-500 mt-1">{l.desc}</p>
        </div>
      ))}
    </div>
  )
}

export default VocabularyLevelGrid
