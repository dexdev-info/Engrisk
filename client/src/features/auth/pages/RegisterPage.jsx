import { useState } from 'react'
import { Form, Input, Button, Divider } from 'antd'
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  GoogleOutlined
} from '@ant-design/icons'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth.js'

const Register = () => {
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const onFinish = async (values) => {
    setLoading(true)
    try {
      await register({
        name: values.name,
        email: values.email,
        password: values.password
      })
      toast.success('Đăng ký thành công! Đăng nhập ngay nào. 🚀')
      navigate('/login')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Đăng ký thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      {/* HEADER */}
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-serif font-bold text-gray-900 mb-3 tracking-tight">
          Join Engrisk
        </h2>
        <p className="text-gray-500 font-sans">
          Tạo tài khoản để bắt đầu hành trình chinh phục tiếng Anh.
        </p>
      </div>

      <Form
        name="register_form"
        layout="vertical"
        onFinish={onFinish}
        size="large"
        scrollToFirstError
        requiredMark={false}
      >
        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập họ tên!',
              whitespace: true
            }
          ]}
        >
          <Input
            prefix={<UserOutlined className="text-gray-400 mr-2" />}
            placeholder="Họ và tên của bạn"
            className="h-12 rounded-xl bg-gray-50 border-gray-200 hover:bg-white focus:bg-white hover:border-gray-400 focus:border-black transition-all"
          />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { type: 'email', message: 'Email không hợp lệ!' },
            { required: true, message: 'Vui lòng nhập Email!' }
          ]}
        >
          <Input
            prefix={<MailOutlined className="text-gray-400 mr-2" />}
            placeholder="Địa chỉ Email"
            className="h-12 rounded-xl bg-gray-50 border-gray-200 hover:bg-white focus:bg-white hover:border-gray-400 focus:border-black transition-all"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu!' },
            { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự!' }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400 mr-2" />}
            placeholder="Mật khẩu"
            className="h-12 rounded-xl bg-gray-50 border-gray-200 hover:bg-white focus:bg-white hover:border-gray-400 focus:border-black transition-all"
          />
        </Form.Item>

        <Form.Item
          name="confirm"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('Mật khẩu không khớp!'))
              }
            })
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400 mr-2" />}
            placeholder="Nhập lại mật khẩu"
            className="h-12 rounded-xl bg-gray-50 border-gray-200 hover:bg-white focus:bg-white hover:border-gray-400 focus:border-black transition-all"
          />
        </Form.Item>

        <Form.Item className="mt-8">
          <Button
            type="primary"
            htmlType="submit"
            className="w-full h-12 rounded-xl bg-black hover:!bg-gray-800 border-none font-bold text-base shadow-lg shadow-gray-200"
            loading={loading}
          >
            Đăng Ký Tài Khoản
          </Button>
        </Form.Item>
      </Form>

      <p className="mt-6 text-center text-gray-500 text-sm">
        Đã là thành viên?{' '}
        <Link
          to="/login"
          className="text-black font-bold hover:underline underline-offset-4"
        >
          Đăng nhập
        </Link>
      </p>
    </div>
  )
}

export default Register
