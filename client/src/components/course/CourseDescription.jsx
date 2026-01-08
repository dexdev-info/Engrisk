import { Card, Typography } from 'antd'

const { Paragraph } = Typography

const CourseDescription = ({ description }) => {
  if (!description) return null

  return (
    <Card className="mb-8 shadow-sm border-gray-100 bg-blue-50/30">
      <Paragraph className="text-lg text-gray-700 leading-relaxed mb-0">
        {description}
      </Paragraph>
    </Card>
  )
}

export default CourseDescription
