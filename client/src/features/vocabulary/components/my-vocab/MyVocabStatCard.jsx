// Map màu để đảm bảo Tailwind nhận diện đúng class (Thay vì dùng string concatenation dễ lỗi)
const THEMES = {
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    borderHover: 'hover:border-blue-200',
    iconBg: 'bg-blue-100'
  },
  green: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    borderHover: 'hover:border-emerald-200',
    iconBg: 'bg-emerald-100'
  },
  orange: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    borderHover: 'hover:border-amber-200',
    iconBg: 'bg-amber-100'
  },
  red: {
    bg: 'bg-rose-50',
    text: 'text-rose-600',
    borderHover: 'hover:border-rose-200',
    iconBg: 'bg-rose-100'
  },
  default: {
    bg: 'bg-gray-50',
    text: 'text-gray-900',
    borderHover: 'hover:border-gray-300',
    iconBg: 'bg-gray-200'
  }
}

const MyVocabStatCard = ({
  title,
  count,
  icon,
  color,
  onClick
}) => {
  const theme = THEMES[color] || THEMES.default

  return (
    <div
      onClick={onClick}
      className={`
        group relative overflow-hidden cursor-pointer
        bg-white rounded-2xl border border-gray-100 p-6
        transition-all duration-300 ease-out
        hover:shadow-xl hover:shadow-gray-100 hover:-translate-y-1
        ${theme.borderHover}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          {/* Title: Small Uppercase */}
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            {title}
          </span>

          {/* Count: Big Serif Font */}
          <span className="text-4xl font-serif font-bold text-gray-900 leading-none group-hover:scale-105 transition-transform origin-left">
            {count}
          </span>
        </div>

        {/* Icon: Bo góc mềm mại (Squircle) */}
        <div
          className={`
          w-12 h-12 rounded-xl flex items-center justify-center text-xl
          ${theme.bg} ${theme.text}
          group-hover:rotate-12 transition-transform duration-300
        `}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}

export default MyVocabStatCard
