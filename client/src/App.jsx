import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';

// Component bảo vệ route (Giống middleware auth bên Laravel)
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  // Nếu chưa login -> Đá về trang login
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const { loading } = useAuth();

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <Routes>
      {/* Route công khai (Login/Register không cần Header) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Route cần đăng nhập + Có Header (MainLayout) */}
      <Route 
        path="/" 
        element={
          <PrivateRoute>
             <MainLayout /> {/* Layout bọc ngoài */}
          </PrivateRoute>
        } 
      >
        {/* Trang Home sẽ nằm trong Outlet của MainLayout */}
        <Route index element={<Home />} /> 
        
        {/* Sau này thêm trang khóa học vào đây dễ dàng */}
        {/* <Route path="courses" element={<Courses />} /> */}
      </Route>
    </Routes>
  );
}

export default App;