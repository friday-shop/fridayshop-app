import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import type { IProduct, IProductResponse } from '../types/product';
import { axiosInstance } from '../hooks/useAxios';
import type { AxiosError } from 'axios';
import ProductCard from './ProductCard';

interface ProductUpdateFormProps {
  initialValues?: Partial<Omit<IProductResponse, 'createdAt' | 'updatedAt'>>;
  mutate: () => void;
}

const validationSchema = Yup.object({
  name: Yup.string()
    .min(4, 'ชื่อสินค้าต้องมีอย่างน้อย 4 ตัวอักษร')
    .max(100, 'ชื่อสินค้าต้องไม่เกิน 100 ตัวอักษร')
    .required('กรุณากรอกชื่อสินค้า'),
  imageUrl: Yup.string().url('URL ไม่ถูกต้อง').required('กรุณากรอก URL รูปภาพ'),
  isOpen: Yup.boolean().required('กรุณาระบุสถานะการเปิดใช้งาน'),
  price: Yup.number().typeError('ราคาต้องเป็นตัวเลข').required('กรุณากรอกราคา'),
  providers: Yup.array().of(
    Yup.object({
      providerId: Yup.string().required('กรุณากรอก Provider ID'),
      id: Yup.string().required('กรุณากรอก ID'),
      isOpen: Yup.boolean().required('กรุณาระบุ isOpen'),
    }),
  ),
});

export default function ProductUpdateForm({
  initialValues,
  mutate,
}: ProductUpdateFormProps) {
  const handleSubmit = async (
    values: Omit<IProduct, '_id' | 'createdAt' | 'updatedAt'>,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    const payload = { ...values };
    try {
      await axiosInstance.patch(`/products/${initialValues!._id}`, payload);
      Swal.fire({
        icon: 'success',
        title: 'สำเร็จ',
        text: 'แก้ไขข้อมูลสินค้าสำเร็จ',
        showConfirmButton: false,
        timer: 1500,
      });
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
          isOpen: false,
          categoryId: '',
          price: 0,
          providers: [
            {
              providerId: '',
              id: '',
              isOpen: false,
            },
          ],
          ...initialValues,
        } as Omit<IProduct, '_id' | 'createdAt' | 'updatedAt'>
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
              <label htmlFor="categoryId" className="form-label">
                Category ID
              </label>
              <Field
                id="categoryId"
                name="categoryId"
                className="form-control"
              />
              <div className="text-danger mt-1">
                <ErrorMessage name="categoryId" />
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

            <FieldArray name="providers">
              {({ push, remove }) => (
                <div className="mb-3">
                  {values.providers.map((_, index) => (
                    <div key={index} className="border p-3 mb-2">
                      <label className="form-label">
                        Provider #{index + 1}
                      </label>
                      <Field
                        name={`providers[${index}].providerId`}
                        placeholder="Provider ID"
                        className="form-control mb-1"
                      />
                      <ErrorMessage
                        name={`providers[${index}].providerId`}
                        component="div"
                        className="text-danger"
                      />
                      <Field
                        name={`providers[${index}].id`}
                        placeholder="ID"
                        className="form-control mb-1"
                      />
                      <ErrorMessage
                        name={`providers[${index}].id`}
                        component="div"
                        className="text-danger"
                      />
                      <div className="form-check">
                        <Field
                          type="checkbox"
                          name={`providers[${index}].isOpen`}
                          className="form-check-input"
                        />
                        <label className="form-check-label ms-2">
                          เปิดใช้งาน
                        </label>
                        <ErrorMessage
                          name={`providers[${index}].isOpen`}
                          component="div"
                          className="text-danger"
                        />
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger mt-2"
                        onClick={() => remove(index)}
                      >
                        ลบ
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={() =>
                      push({ providerId: '', id: '', isOpen: false })
                    }
                  >
                    เพิ่ม Provider
                  </button>
                </div>
              )}
            </FieldArray>
            <div className="mb-3 form-check">
              <Field
                type="checkbox"
                id="isOpen"
                name="isOpen"
                className="form-check-input"
              />
              <label htmlFor="isOpen" className="form-check-label">
                เปิดใช้งานสินค้านี้
              </label>
              <div className="text-danger mt-1">
                <ErrorMessage name="isOpen" />
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
