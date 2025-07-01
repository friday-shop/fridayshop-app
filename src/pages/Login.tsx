import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import type { AxiosError } from 'axios';
import { axiosInstance } from '../hooks/useAxios';
import useUser from '../hooks/useUser';

interface LoginFormValues {
  username: string;
  password: string;
}

const initialValues: LoginFormValues = {
  username: '',
  password: '',
};

const validationSchema = Yup.object({
  username: Yup.string().required('กรุณากรอกชื่อผู้ใช้'),
  password: Yup.string()
    .min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
    .required('กรุณากรอกรหัสผ่าน'),
});

export default function Login() {
  const navigate = useNavigate();
  const { saveToken } = useUser();
  const [serverError, setServerError] = useState('');

  const handleSubmit = async (
    values: LoginFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    setServerError('');
    try {
      const { data } = await axiosInstance.post('/auth/login', values);
      saveToken(data.access_token);
      navigate('/fridayshop-app/');
    } catch (error) {
      const errorAxios = error as AxiosError<{ message: string }>;
      setServerError(
        errorAxios.response?.data?.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div
        className="card p-4 shadow-sm"
        style={{ maxWidth: 400, borderRadius: '1rem' }}
      >
        <h2 className="text-center mb-4">เข้าสู่ระบบ</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              {serverError && (
                <div className="alert alert-danger">{serverError}</div>
              )}

              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  ชื่อผู้ใช้
                </label>
                <Field
                  id="username"
                  name="username"
                  type="text"
                  className="form-control"
                  placeholder="yourusername"
                  autoComplete="username"
                />
                <div className="text-danger mt-1">
                  <ErrorMessage name="username" />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="form-label">
                  รหัสผ่าน
                </label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <div className="text-danger mt-1">
                  <ErrorMessage name="password" />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
