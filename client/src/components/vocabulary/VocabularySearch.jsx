import { Input } from 'antd'
import { SearchOutlined, CloseCircleFilled } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import { useDebounce } from '../../hooks/useDebounce.js'

const VocabularySearch = ({ value, onChange }) => {
  const [input, setInput] = useState(value)

  useEffect(() => {
    setInput(value)
  }, [value])

  useDebounce(input, 400, (val) => {
    onChange(val.trim())
  })

  return (
    <Input
      allowClear={{
        clearIcon: (
          <CloseCircleFilled className="text-gray-400 hover:text-gray-600 transition-colors" />
        )
      }}
      size="large"
      placeholder="Tìm kiếm từ vựng..."
      prefix={<SearchOutlined className="text-gray-400 mr-2" />}
      value={input}
      onChange={(e) => setInput(e.target.value)}
      // Dùng focus-within để bắt sự kiện focus vào wrapper
      className="
        rounded-full! 
        bg-gray-50! border-gray-200!
        px-5! py-2.5!
        text-gray-800! placeholder:text-gray-400!
        shadow-sm!
        hover:bg-white! hover:border-gray-400! hover:shadow-md!
        focus-within:bg-white! focus-within:border-gray-900! focus-within:shadow-lg!
        transition-all duration-300
        [&>input]:bg-transparent!
      "
    />
  )
}

export default VocabularySearch
