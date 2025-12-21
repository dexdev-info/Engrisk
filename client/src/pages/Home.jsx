import { useEffect, useState } from 'react';
import courseService from '../services/courseService';
import CourseCard from '../components/CourseCard';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await courseService.getAllCourses();
                setCourses(data);
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (loading) return <div className="text-center mt-10">Đang tải khóa học...</div>;

    return (
        <div>
            {/* Banner chào mừng */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    Chào mừng trở lại, <span className="text-blue-600">{user?.name}</span>! 👋
                </h1>
                <p className="text-gray-600 mt-2">Chọn một khóa học để bắt đầu hành trình chinh phục tiếng Anh nhé.</p>
            </div>

            {/* Grid danh sách khóa học */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <CourseCard key={course._id} course={course} />
                ))}
            </div>
        </div>
    );
};

export default Home;