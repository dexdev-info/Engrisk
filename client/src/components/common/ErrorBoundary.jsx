import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom'
import { Result, Button } from 'antd'

const ErrorBoundary = () => {
  const error = useRouteError()
  console.error(error)

  let status = '500'
  let title = 'Oops!'
  let subTitle = 'Đã có lỗi xảy ra.'

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      status = '404'
      title = '404'
      subTitle = 'Xin lỗi, trang bạn tìm kiếm không tồn tại.'
    }
  }

  // Dùng Result của Ant Design để hiển thị lỗi 404 hoặc 500 đẹp đẽ.
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Result
        status={status}
        title={title}
        subTitle={subTitle}
        extra={
          <Link to="/">
            <Button type="primary" size="large">
              Về trang chủ
            </Button>
          </Link>
        }
      />
    </div>
  )
}

export default ErrorBoundary
