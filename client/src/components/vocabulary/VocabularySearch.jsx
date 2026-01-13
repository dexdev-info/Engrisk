import { Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
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
      allowClear
      size="large"
      placeholder="Tìm từ vựng hoặc nghĩa..."
      prefix={<SearchOutlined />}
      value={input}
      onChange={(e) => setInput(e.target.value)}
    />
  )
}

export default VocabularySearch
