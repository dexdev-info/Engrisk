import { Outlet } from 'react-router-dom';
import Header from '../components/layouts/Header';

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <Header />
            <main className="container mx-auto px-4 py-6">
                {/* Outlet là nơi nội dung của các trang con (Home, Login...) sẽ hiển thị */}
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;