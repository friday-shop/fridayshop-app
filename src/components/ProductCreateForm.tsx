import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import type { IProductResponse } from '../types/product';
import { axiosInstance } from '../hooks/useAxios';
import type { AxiosError } from 'axios';
import ProductCard from './ProductCard';
import { useBottomSheetStore } from '../store/useBottomSheetStore';

interface ProductCreateFormProps {
  categoryId: string;
  mutate: () => void;
}

const validationSchema = Yup.object({
  name: Yup.string()
    .min(4, 'ชื่อสินค้าต้องมีอย่างน้อย 4 ตัวอักษร')
    .max(100, 'ชื่อสินค้าต้องไม่เกิน 100 ตัวอักษร')
    .required('กรุณากรอกชื่อสินค้า'),
  imageUrl: Yup.string().url('URL ไม่ถูกต้อง'),
  price: Yup.number().typeError('ราคาต้องเป็นตัวเลข').required('กรุณากรอกราคา'),
});

export default function ProductCreateForm({
  categoryId,
  mutate,
}: ProductCreateFormProps) {
  const { close } = useBottomSheetStore();

  const handleSubmit = async (
    values: Omit<IProductResponse, '_id' | 'createdAt' | 'updatedAt'>,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    const payload = { ...values, categoryId };
    try {
      await axiosInstance.post('/products/create', payload);
      Swal.fire({
        icon: 'success',
        title: 'สำเร็จ',
        text: 'เพิ่มข้อมูลสินค้าสำเร็จ',
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
          imageUrl: '',
          price: 0,
        } as IProductResponse
      }
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, values }) => (
        <Form>
          {' '}
          <div style={{ pointerEvents: 'none' }}>
            <ProductCard
              preview={true}
              data={
                {
                  _id: '',
                  name: values.name,
                  imageUrl: values.imageUrl,
                  isOpen: values.isOpen,
                  price: values.price,
                } as IProductResponse
              }
            />
          </div>
          <fieldset disabled={isSubmitting}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                ชื่อสินค้า
              </label>
              <Field id="name" name="name" className="form-control" />
              <div className="text-danger mt-1">
                <ErrorMessage name="name" />
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

            <div className="mb-3">
              <label htmlFor="price" className="form-label">
                ราคา
              </label>
              <Field
                type="number"
                id="price"
                name="price"
                className="form-control"
              />
              <div className="text-danger mt-1">
                <ErrorMessage name="price" />
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
