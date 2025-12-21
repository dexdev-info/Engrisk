import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import courseService from '../services/courseService';
import { FaPlayCircle, FaCheckCircle } from 'react-icons/fa';
import Flashcard from '../components/Flashcard';

const CourseDetail = () => {
    const { id } = useParams(); // Lấy ID từ URL
    const [course, setCourse] = useState(null);
    const [currentLesson, setCurrentLesson] = useState(null); // Bài đang học
    const [loading, setLoading] = useState(true);
    const [vocabList, setVocabList] = useState([]);
    const [showVocab, setShowVocab] = useState(false); // Toggle chế độ học từ vựng

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

    // Effect tải từ vựng khi đổi bài học
    useEffect(() => {
        const fetchVocab = async () => {
            if (currentLesson) {
                try {
                    const data = await courseService.getVocabByLesson(currentLesson._id);
                    setVocabList(data);
                } catch (error) {
                    console.error(error);
                }
            }
        };
        fetchVocab();
    }, [currentLesson]);

    if (loading) return <div className="text-center mt-10">Đang tải bài học...</div>;
    if (!course) return <div className="text-center mt-10 text-red-500">Không tìm thấy khóa học</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                {/* Tab chuyển đổi: Video <-> Từ vựng */}
                <div className="flex gap-4 mb-4">
                    <button
                        onClick={() => setShowVocab(false)}
                        className={`px-4 py-2 rounded-lg font-bold transition ${!showVocab ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        📺 Bài giảng Video
                    </button>
                    <button
                        onClick={() => setShowVocab(true)}
                        className={`px-4 py-2 rounded-lg font-bold transition ${showVocab ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        🧠 Ôn tập Flashcard
                    </button>
                </div>

                {/* Nội dung chính */}
                <div className="bg-white rounded-xl shadow-sm p-4 min-h-[400px]">
                    {!showVocab ? (
                        // Mode Video (Code cũ)
                        <>
                            <div className="bg-black rounded-lg overflow-hidden aspect-video mb-4">
                                {currentLesson ? (
                                    <iframe className="w-full h-full" src={currentLesson.videoUrl} title={currentLesson.title} allowFullScreen></iframe>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-white">Chưa có bài học</div>
                                )}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">{currentLesson?.title}</h2>
                            <p className="mt-2 text-gray-600">{currentLesson?.description}</p>
                        </>
                    ) : (
                        // Mode Flashcard (Mới)
                        <div>
                            {vocabList.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {vocabList.map(vocab => (
                                        <Flashcard key={vocab._id} vocab={vocab} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 py-10">
                                    Bài học này chưa có từ vựng nào để ôn tập. 😅
                                </div>
                            )}
                        </div>
                    )}
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