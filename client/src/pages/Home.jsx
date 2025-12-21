import { useAuth } from '../contexts/AuthContext';

const Home = () => {
    const { user, logout } = useAuth();

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold text-green-600">Xin chào, {user?.name}! 👋</h1>
            <p className="mt-2 text-gray-600">Email: {user?.email}</p>
            <button
                onClick={logout}
                className="mt-5 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
                Đăng xuất
            </button>
        </div>
    );
};

export default Home;