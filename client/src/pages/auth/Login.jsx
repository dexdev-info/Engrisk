import { useState } from 'react'
// eslint-disable-next-line no-unused-vars
import { Form, Input, Button, Checkbox, Divider, message } from 'antd'
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
      toast.success('Đăng nhập thành công! 🎉')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Chào mừng trở lại! 👋
        </h2>
        <p className="mt-2 text-gray-600">
          Đăng nhập để tiếp tục hành trình học tập.
        </p>
      </div>

      <Form
        name="login_form"
        layout="vertical"
        onFinish={onFinish}
        size="large"
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập Email!' },
            { type: 'email', message: 'Email không hợp lệ!' }
          ]}
        >
          <Input
            prefix={<UserOutlined className="text-gray-400" />}
            placeholder="Email"
            className="rounded-lg"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Mật khẩu"
            className="rounded-lg"
          />
        </Form.Item>

        <div className="flex justify-between items-center mb-6">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Ghi nhớ tôi</Checkbox>
          </Form.Item>
          <Link
            to="/forgot-password"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Quên mật khẩu?
          </Link>
        </div>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full h-10 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold"
            loading={loading}
          >
            Đăng Nhập
          </Button>
        </Form.Item>
      </Form>

      <Divider plain>
        <span className="text-gray-400 text-sm">Hoặc</span>
      </Divider>

      <Button icon={<GoogleOutlined />} className="w-full h-10 rounded-lg">
        Đăng nhập bằng Google
      </Button>

      <p className="mt-6 text-center text-gray-600">
        Chưa có tài khoản?{' '}
        <Link
          to="/register"
          className="text-blue-600 font-medium hover:underline"
        >
          Đăng ký ngay
        </Link>
      </p>
    </div>
  )
}

export default Login
