import { useEffect, useState } from 'react';
import PaymentCard from './PaymentCard';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import type { AxiosError } from 'axios';
import PaymentForm from './PaymentForm';
import type { IPayment, IPaymentAccount } from '../../../types/payment';
import { axiosInstance } from '../../../hooks/useAxios';

const validationSchema = Yup.object({
  shopName: Yup.string(),
  package: Yup.string(),
  packageExpiredDate: Yup.string(),
  quotaLimit: Yup.number(),
  quotaRemaining: Yup.number(),
  creditRemaining: Yup.number(),
  autoRenewalPackage: Yup.boolean(),
  checkSlipByCredit: Yup.boolean(),
  accessToken: Yup.string().required('กรุณากรอก Access Token'),
  name: Yup.string().required('กรุณากรอกชื่อ'),
  engName: Yup.string().required('กรุณากรอกชื่อ อังกฤษ'),
  phone: Yup.string().required('กรุณากรอกเบอร์โทรศัพท์'),
  bankNumber: Yup.string().required('กรุณากรอกเลขธนาคาร'),
  bankCode: Yup.string().required('กรุณากเลือกธนาคาร'),
});

const PaymentItem = () => {
  const [selected, setSelected] = useState<boolean>(false);

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const response = await axiosInstance.get<IPayment & IPaymentAccount>(
          '/payments',
        );
        paymentForm.setValues(response.data);
      } catch (error) {
        const axiosError = error as AxiosError;
        Swal.fire(
          'Error',
          axiosError.message || 'ไม่สามารถโหลดข้อมูลได้',
          'error',
        );
      }
    };

    fetchPaymentData();
  }, []);

  const paymentForm = useFormik<IPayment & IPaymentAccount>({
    enableReinitialize: true,
    initialValues: {
      accessToken: '',
      name: '',
      engName: '',
      phone: '',
      bankNumber: '',
      bankCode: '',
      shopName: '',
      package: '',
      packageExpiredDate: '',
      quotaLimit: 0,
      quotaRemaining: 0,
      creditRemaining: 0,
      autoRenewalPackage: false,
      checkSlipByCredit: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await axiosInstance.request({
          method: 'patch',
          url: '/payments',
          data: values,
        });
        Swal.fire('Success', 'Payment updated successfully!', 'success');
      } catch (error) {
        const axiosError = error as AxiosError;
        Swal.fire('Error', axiosError.message || 'An error occurred.', 'error');
      }
    },
  });

  return (
    <div>
      <PaymentCard
        isEdit={selected}
        paymentForm={paymentForm}
        onClickCard={() => {
          setSelected((prev) => !prev);
        }}
      />
      <div
        className={`animated-buttons ${selected && selected ? 'slide-down' : ''}`}
        style={{
          maxHeight: '100%',
          overflow: 'hidden',
          transition: 'max-height 0.5s ease-in-out',
        }}
      >
        {selected && selected && <PaymentForm paymentForm={paymentForm} />}
      </div>
      <div
        className={`animated-buttons ${selected ? 'slide-down' : ''}`}
        style={{
          maxHeight: selected ? '100px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.5s ease-in-out',
        }}
      >
        {selected && (
          <div className="d-flex justify-content-between px-3 gap-4 align-content-center">
            <button
              className="rounded-bottom-4 border-0 fw-bold"
              style={{
                backgroundColor: selected ? '#16DBCC' : '#FFBB38',
                height: '5vh',
                width: '50%',
                color: 'white',
              }}
              onClick={async () => {
                if (selected) {
                  await paymentForm.submitForm();
                }
                setSelected(!selected);
              }}
            >
              {selected ? 'ยืนยัน' : 'แก้ไข'}
            </button>
            <button
              className="rounded-bottom-4 border-0 fw-bold"
              style={{
                backgroundColor: '#FE5C73',
                height: '5vh',
                width: '50%',
                color: 'white',
              }}
              onClick={async () => {
                const result = await Swal.fire({
                  title: 'ยืนยันการลบ?',
                  text: 'คุณแน่ใจว่าต้องการลบหมวดหมู่นี้?',
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#FE5C73',
                  cancelButtonColor: '#3085d6',
                  confirmButtonText: 'ลบ',
                  cancelButtonText: 'ยกเลิก',
                });

                if (result.isConfirmed) {
                  try {
                    const fetchPaymentData = async () => {
                      try {
                        const response = await axiosInstance.get<
                          IPayment & IPaymentAccount
                        >('/payments');
                        paymentForm.setValues(response.data);
                      } catch (error) {
                        const axiosError = error as AxiosError;
                        Swal.fire(
                          'Error',
                          axiosError.message || 'ไม่สามารถโหลดข้อมูลได้',
                          'error',
                        );
                      }
                    };

                    fetchPaymentData();
                    Swal.fire(
                      'สำเร็จ',
                      'ยกเลิกการแก้ไขเรียบร้อยแล้ว',
                      'success',
                    );
                  } catch (error) {
                    const axiosError = error as AxiosError;
                    Swal.fire(
                      'Error',
                      axiosError.message || 'ยกเลิกการแก้ไขไม่สำเร็จ',
                      'error',
                    );
                  }
                }
              }}
            >
              ยกเลิก
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentItem;
