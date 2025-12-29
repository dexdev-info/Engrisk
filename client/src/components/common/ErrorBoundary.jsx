import { useRouteError, Link } from "react-router-dom";
import { Result, Button } from "antd";

const ErrorBoundary = () => {
    const error = useRouteError();
    console.error(error);

    // Dùng Result của Ant Design để hiển thị lỗi 404 hoặc 500 đẹp đẽ.
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Result
                status={error.status === 404 ? "404" : "500"}
                title={error.status === 404 ? "404" : "Oops!"}
                subTitle={error.status === 404
                    ? "Xin lỗi, trang bạn tìm kiếm không tồn tại."
                    : "Đã có lỗi xảy ra."}
                extra={
                    <Link to="/">
                        <Button type="primary" size="large">
                            Về trang chủ
                        </Button>
                    </Link>
                }
            />
        </div>
    );
};

export default ErrorBoundary;