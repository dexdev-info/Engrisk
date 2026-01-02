// pages/NotFound.jsx
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <Result
    status="404"
    title="404"
    subTitle="Trang bạn tìm không tồn tại."
    extra={
      <Link to="/">
        <Button type="primary">Về trang chủ</Button>
      </Link>
    }
  />
);

export default NotFound;
