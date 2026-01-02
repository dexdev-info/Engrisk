import { Card, Tag, Badge } from 'antd';
import { BookOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Meta } = Card;

const CourseCard = ({ course }) => {
  // Map level color
  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner':
        return 'green';
      case 'Intermediate':
        return 'blue';
      case 'Advanced':
        return 'red';
      default:
        return 'default';
    }
  };

  return (
    <Link to={`/courses/${course.slug}`}>
      <Card
        hoverable
        cover={
          <div className="h-48 overflow-hidden relative">
            <img
              alt={course.title}
              src={course.thumbnail || 'https://via.placeholder.com/300x200'}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            />
            <div className="absolute top-2 right-2">
              <Tag color={getLevelColor(course.level)}>{course.level}</Tag>
            </div>
          </div>
        }
        className="h-full rounded-xl overflow-hidden border-gray-200 shadow-sm hover:shadow-md transition-shadow"
      >
        <Meta
          title={
            <span
              className="text-lg font-bold text-gray-800 line-clamp-1"
              title={course.title}
            >
              {course.title}
            </span>
          }
          description={
            <div className="space-y-3 mt-2">
              <p className="text-gray-500 line-clamp-2 h-10 text-sm">
                {course.description}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-400 border-t pt-3">
                <span className="flex items-center gap-1">
                  <BookOutlined /> {course.lessonsCount} bài học
                </span>
                <span className="flex items-center gap-1">
                  <UserOutlined /> {course.enrolledCount} học viên
                </span>
              </div>
            </div>
          }
        />
      </Card>
    </Link>
  );
};

export default CourseCard;
