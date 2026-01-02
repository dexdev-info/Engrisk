import { useState } from 'react'

const Flashcard = ({ vocab }) => {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div
      className="group perspective-1000 w-full h-64 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full h-full transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Mặt trước: Word */}
        <div className="absolute w-full h-full bg-white rounded-xl shadow-lg flex flex-col items-center justify-center backface-hidden border-2 border-blue-100">
          <h3 className="text-3xl font-bold text-gray-800">{vocab.word}</h3>
          <p className="text-gray-500 mt-2">{vocab.pronunciation}</p>
          <p className="text-xs text-blue-500 mt-4 animate-pulse">
            (Click để xem nghĩa)
          </p>
        </div>

        {/* Mặt sau: Meaning & Example */}
        <div className="absolute w-full h-full bg-blue-600 text-white rounded-xl shadow-lg flex flex-col items-center justify-center backface-hidden rotate-y-180 p-4 text-center">
          <h3 className="text-2xl font-bold mb-2">{vocab.meaning}</h3>
          <div className="w-10 h-1 bg-white/30 rounded mb-3"></div>
          <p className="italic text-lg">"{vocab.example}"</p>
        </div>
      </div>
    </div>
  )
}

export default Flashcard
