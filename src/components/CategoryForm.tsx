import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import type { ICategory } from '../types/category';
import { axiosInstance } from '../hooks/useAxios';
import type { AxiosError } from 'axios';
import CategoryCard from './CategoryCard';
import { useBottomSheetStore } from '../store/useBottomSheetStore';

interface CategoryFormProps {
  initialValues?: Partial<Omit<ICategory, 'createdAt' | 'updatedAt'>>;
  mutate: () => void;
}

const validationSchema = Yup.object({
  name: Yup.string()
    .min(4, 'ชื่อประเภทต้องมีอย่างน้อย 4 ตัวอักษร')
    .max(100, 'ชื่อประเภทต้องไม่เกิน 100 ตัวอักษร')
    .required('กรุณากรอกชื่อประเภท'),
  description: Yup.string()
    .min(4, 'รายละเอียดต้องมีอย่างน้อย 4 ตัวอักษร')
    .max(1000, 'รายละเอียดต้องไม่เกิน 1000 ตัวอักษร')
    .required('กรุณากรอกรายละเอียด'),
  imageUrl: Yup.string().url('URL ไม่ถูกต้อง').required('กรุณากรอก URL รูปภาพ'),
  isOpen: Yup.boolean().required('กรุณาระบุสถานะการเปิดใช้งาน'),
  isUseForm: Yup.boolean().required('กรุณาระบุการใช้งานฟอร์ม'),
  formFormat: Yup.string().optional(),
});

export default function CategoryForm({
  initialValues,
  mutate,
}: CategoryFormProps) {
  const { close } = useBottomSheetStore();
  const isUpdate = Boolean(initialValues?._id);
  const handleSubmit = async (
    values: Omit<ICategory, '_id' | 'createdAt' | 'updatedAt'>,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    const payload = { ...values };
    try {
      await axiosInstance({
        method: isUpdate ? 'patch' : 'post',
        url: isUpdate
          ? `/categories/${initialValues!._id}`
          : '/categories/create',
        data: payload,
      });
      Swal.fire({
        icon: 'success',
        title: 'สำเร็จ',
        text: isUpdate
          ? 'แก้ไขข้อมูลประเภทสินค้าสำเร็จ'
          : 'เพิ่มข้อมูลประเภทสินค้าสำเร็จ',
        showConfirmButton: false,
        timer: 1500,
      });
      setTimeout(() => {
        close();
      }, 1500);
      mutate?.();
    } catch (error) {
      const errorAxios = error as AxiosError<{ message: string }>;
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text:
          errorAxios.response?.data?.message ||
          'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={
        {
          name: '',
          description: '',
          imageUrl: '',
          isOpen: false,
          isUseForm: false,
          formFormat: '',
          ...initialValues,
        } as Omit<ICategory, '_id' | 'createdAt' | 'updatedAt'>
      }
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, values }) => (
        <Form>
          <div style={{ pointerEvents: 'none' }}>
            <CategoryCard
              preview={true}
              data={
                {
                  _id: '',
                  name: values.name,
                  description: values.description,
                  imageUrl: values.imageUrl,
                } as ICategory
              }
            />
          </div>
          <fieldset disabled={isSubmitting}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                ชื่อประเภท
              </label>
              <Field id="name" name="name" className="form-control" />
              <div className="text-danger mt-1">
                <ErrorMessage name="name" />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                รายละเอียด
              </label>
              <Field
                id="description"
                name="description"
                as="textarea"
                className="form-control"
              />
              <div className="text-danger mt-1">
                <ErrorMessage name="description" />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="imageUrl" className="form-label">
                URL รูปภาพ
              </label>
              <Field id="imageUrl" name="imageUrl" className="form-control" />
              <div className="text-danger mt-1">
                <ErrorMessage name="imageUrl" />
              </div>
            </div>
            {!isUpdate && (
              <div className="mb-3 form-check">
                <Field
                  type="checkbox"
                  id="isOpen"
                  name="isOpen"
                  className="form-check-input"
                />
                <label htmlFor="isOpen" className="form-check-label">
                  เปิดใช้งานประเภทนี้
                </label>
                <div className="text-danger mt-1">
                  <ErrorMessage name="isOpen" />
                </div>
              </div>
            )}
            <div className="mb-3 form-check">
              <Field
                type="checkbox"
                id="isUseForm"
                name="isUseForm"
                className="form-check-input"
              />
              <label htmlFor="isUseForm" className="form-check-label">
                ใช้แบบฟอร์ม
              </label>
              <div className="text-danger mt-1">
                <ErrorMessage name="isUseForm" />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="formFormat" className="form-label">
                รูปแบบฟอร์ม
              </label>
              <Field
                as="textarea"
                rows={4}
                id="formFormat"
                name="formFormat"
                className="form-control"
              />
              <div className="text-danger mt-1">
                <ErrorMessage name="formFormat" />
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
          </fieldset>
        </Form>
      )}
    </Formik>
  );
}
