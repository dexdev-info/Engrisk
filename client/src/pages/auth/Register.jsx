import { useState } from 'react';
import { Form, Input, Button, Divider } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';

const Register = () => {
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await register({
                name: values.name,
                email: values.email,
                password: values.password
            });
            toast.success('Đăng ký thành công! Hãy bắt đầu học ngay. 🚀');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Đăng ký thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="mb-6 text-center">
                <h2 className="text-3xl font-bold text-gray-900">Tạo tài khoản mới 🚀</h2>
                <p className="mt-2 text-gray-600">Tham gia cộng đồng học tiếng Anh Engrisk.</p>
            </div>

            <Form
                name="register_form"
                layout="vertical"
                onFinish={onFinish}
                size="large"
                scrollToFirstError
            >
                <Form.Item
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập họ tên!', whitespace: true }]}
                >
                    <Input
                        prefix={<UserOutlined className="text-gray-400" />}
                        placeholder="Họ và tên"
                        className="rounded-lg"
                    />
                </Form.Item>

                <Form.Item
                    name="email"
                    rules={[
                        { type: 'email', message: 'Email không hợp lệ!' },
                        { required: true, message: 'Vui lòng nhập Email!' },
                    ]}
                >
                    <Input
                        prefix={<MailOutlined className="text-gray-400" />}
                        placeholder="Email"
                        className="rounded-lg"
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mật khẩu!' },
                        { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                    ]}
                    hasFeedback
                >
                    <Input.Password
                        prefix={<LockOutlined className="text-gray-400" />}
                        placeholder="Mật khẩu"
                        className="rounded-lg"
                    />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Hai mật khẩu không khớp!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined className="text-gray-400" />}
                        placeholder="Xác nhận mật khẩu"
                        className="rounded-lg"
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="w-full h-10 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold"
                        loading={loading}
                    >
                        Đăng Ký Tài Khoản
                    </Button>
                </Form.Item>
            </Form>

            <p className="mt-4 text-center text-gray-600">
                Đã có tài khoản?{' '}
                <Link to="/login" className="text-blue-600 font-medium hover:underline">
                    Đăng nhập ngay
                </Link>
            </p>
        </div>
    );
};

export default Register;