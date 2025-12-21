import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import courseService from '../services/courseService';
import { FaPlayCircle, FaCheckCircle } from 'react-icons/fa';

const CourseDetail = () => {
    const { id } = useParams(); // Lấy ID từ URL
    const [course, setCourse] = useState(null);
    const [currentLesson, setCurrentLesson] = useState(null); // Bài đang học
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourseDetail = async () => {
            try {
                const data = await courseService.getCourseById(id);
                setCourse(data);
                // Mặc định chọn bài đầu tiên nếu có
                if (data.lessons && data.lessons.length > 0) {
                    setCurrentLesson(data.lessons[0]);
                }
            } catch (error) {
                console.error("Lỗi tải khóa học:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseDetail();
    }, [id]);

    if (loading) return <div className="text-center mt-10">Đang tải bài học...</div>;
    if (!course) return <div className="text-center mt-10 text-red-500">Không tìm thấy khóa học</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cột trái: Màn hình Video & Nội dung (Chiếm 2 phần) */}
            <div className="lg:col-span-2">
                <div className="bg-black rounded-xl overflow-hidden shadow-lg aspect-video">
                    {currentLesson ? (
                        <iframe
                            className="w-full h-full"
                            src={currentLesson.videoUrl}
                            title={currentLesson.title}
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <div className="flex items-center justify-center h-full text-white">Chưa có bài học nào</div>
                    )}
                </div>

                <div className="mt-6 bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-800">{currentLesson?.title}</h2>
                    <p className="mt-2 text-gray-600">{currentLesson?.description}</p>
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg text-blue-800 text-sm">
                        💡 {currentLesson?.content}
                    </div>
                </div>
            </div>

            {/* Cột phải: Danh sách bài học (Playlist) (Chiếm 1 phần) */}
            <div className="bg-white rounded-xl shadow-md p-4 h-fit">
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Nội dung khóa học</h3>
                <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto">
                    {course.lessons?.map((lesson, index) => (
                        <button
                            key={lesson._id}
                            onClick={() => setCurrentLesson(lesson)}
                            className={`flex items-center gap-3 p-3 rounded-lg text-left transition ${currentLesson?._id === lesson._id
                                    ? 'bg-blue-100 text-blue-700 font-semibold'
                                    : 'hover:bg-gray-100 text-gray-700'
                                }`}
                        >
                            <div className="text-lg">
                                {currentLesson?._id === lesson._id ? <FaPlayCircle /> : <span className="text-sm font-bold text-gray-400">{index + 1}</span>}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm">{lesson.title}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;