import api from './api';

const courseService = {
    // Lấy tất cả khóa học (Hiện ở trang chủ)
    getAllCourses: async () => {
        const response = await api.get('/courses');
        return response.data;
    },

    // Lấy chi tiết 1 khóa (Kèm bài học)
    getCourseById: async (id) => {
        const response = await api.get(`/courses/${id}`);
        return response.data;
    },

    getVocabByLesson: async (lessonId) => {
        const response = await api.get(`/courses/lessons/${lessonId}/vocab`);
        return response.data;
    }
};

export default courseService;