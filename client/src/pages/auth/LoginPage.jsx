import { useState } from 'react'
import { Form, Input, Button, Checkbox, Divider } from 'antd'
import { UserOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import { toast } from 'react-toastify'

const Login = () => {
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const onFinish = async (values) => {
    setLoading(true)
    try {
      await login(values.email, values.password)
      toast.success('Chào mừng trở lại! 👋')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      {/* HEADER */}
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-serif font-bold text-gray-900 mb-3 tracking-tight">
          Welcome back
        </h2>
        <p className="text-gray-500 font-sans">
          Đăng nhập để tiếp tục hành trình học tập của bạn.
        </p>
      </div>

      <Form
        name="login_form"
        layout="vertical"
        onFinish={onFinish}
        size="large"
        requiredMark={false} // Bỏ dấu * đỏ nhìn cho sạch
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập Email!' },
            { type: 'email', message: 'Email không hợp lệ!' }
          ]}
        >
          <Input
            prefix={<UserOutlined className="text-gray-400 mr-2" />}
            placeholder="Email của bạn"
            // Input cao 48px (h-12) cho cảm giác xịn
            className="h-12 rounded-xl bg-gray-50 border-gray-200 hover:bg-white focus:bg-white hover:border-gray-400 focus:border-black transition-all"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400 mr-2" />}
            placeholder="Mật khẩu"
            className="h-12 rounded-xl bg-gray-50 border-gray-200 hover:bg-white focus:bg-white hover:border-gray-400 focus:border-black transition-all"
          />
        </Form.Item>

        <div className="flex justify-between items-center mb-8">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox className="text-gray-500">Ghi nhớ tôi</Checkbox>
          </Form.Item>
          <Link
            to="/forgot-password"
            className="text-gray-500 hover:text-black font-medium text-sm hover:underline underline-offset-4 transition-all"
          >
            Quên mật khẩu?
          </Link>
        </div>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            // Button đen tuyền, bóng đổ nhẹ
            className="w-full h-12 rounded-xl bg-black hover:!bg-gray-800 border-none font-bold text-base shadow-lg shadow-gray-200"
          >
            Đăng Nhập
          </Button>
        </Form.Item>
      </Form>

      <Divider plain className="!text-gray-400 my-6 text-sm">
        Hoặc tiếp tục với
      </Divider>

      <Button
        icon={<GoogleOutlined />}
        className="!mb-5 w-full h-12 rounded-xl border-gray-200 text-gray-600 font-medium hover:text-black hover:border-gray-400 hover:bg-gray-50 transition-all"
      >
        Google
      </Button>

      <p className="mt-8 text-center text-gray-500 text-sm">
        Chưa có tài khoản?{' '}
        <Link
          to="/register"
          className="text-black font-bold hover:underline underline-offset-4"
        >
          Đăng ký miễn phí
        </Link>
      </p>
    </div>
  )
}

export default Login
