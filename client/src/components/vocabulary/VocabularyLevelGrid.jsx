import {
  ReadOutlined,
  RiseOutlined,
  TrophyOutlined,
  ArrowRightOutlined
} from '@ant-design/icons'

const LEVELS = [
  {
    value: 'beginner',
    label: 'Beginner',
    desc: 'Từ vựng nền tảng cho người mới.',
    icon: <ReadOutlined />
  },
  {
    value: 'intermediate',
    label: 'Intermediate',
    desc: 'Mở rộng vốn từ với các chủ đề đa dạng.',
    icon: <RiseOutlined />
  },
  {
    value: 'advanced',
    label: 'Advanced',
    desc: 'Chinh phục từ chuyên ngành, học thuật.',
    icon: <TrophyOutlined />
  }
]

const VocabularyLevelGrid = ({ onSelect }) => {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {LEVELS.map((item) => (
        <button
          key={item.value}
          onClick={() => onSelect(item.value)}
          className="
            group flex flex-col items-start text-left
            p-6 h-full w-full bg-white
            border border-gray-200 rounded-lg
            transition-all duration-300
            hover:border-gray-800 hover:bg-gray-50
            focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2
          "
        >
          {/* Header: Icon & Arrow */}
          <div className="w-full flex justify-between items-start mb-2">
            <span className="text-3xl text-gray-800 group-hover:text-black transition-colors">
              {item.icon}
            </span>
            
            <ArrowRightOutlined 
              className="text-gray-400 -translate-x-2 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-gray-900" 
            />
          </div>

          {/* Content */}
          <div className="mt-4 w-full">
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2 group-hover:underline decoration-1 underline-offset-4">
              {item.label}
            </h3>
            
            <p className="text-gray-500 text-sm leading-relaxed font-sans">
              {item.desc}
            </p>
          </div>
        </button>
      ))}
    </div>
  )
}

export default VocabularyLevelGrid