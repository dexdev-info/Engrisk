import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-blue-600">Engrisk</h2>
          <p className="mt-2 text-sm text-gray-600">Học tiếng Anh mỗi ngày</p>
        </div>

        <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;