import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa'; // Nhớ cài react-icons rồi nhé

const Header = () => {
    const { user, logout } = useAuth();

    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                    Engrisk 🚀
                </Link>

                {/* User Menu */}
                <div className="flex items-center gap-4">
                    <span className="text-gray-700 font-medium hidden md:block">
                        Xin chào, {user?.name}
                    </span>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition"
                        title="Đăng xuất"
                    >
                        <FaSignOutAlt className="text-xl" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;