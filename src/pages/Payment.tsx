import { useEffect } from 'react';
import type { IPayment, IPaymentAccount } from '../types/payment';
import { axiosInstance } from '../hooks/useAxios';
import { useLayoutStore } from '../store/useLayoutStore';
import PaymentAccountCard from '../components/Payment/PaymentAccountCard';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import type { AxiosError } from 'axios';
import PaymentForm from '../components/Payment/PaymentForm';

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
  phone: Yup.string().required('กรุณากรอกเบอร์โทรศัพท์'),
  bankNumber: Yup.string().required('กรุณากรอกเลขธนาคาร'),
  bankProvider: Yup.string().required('กรุณากเลือกธนาคาร'),
});

const initialValues: IPayment & IPaymentAccount = {
  shopName: '',
  package: '',
  packageExpiredDate: '',
  quotaLimit: 0,
  quotaRemaining: 0,
  creditRemaining: 0,
  autoRenewalPackage: false,
  checkSlipByCredit: false,
  accessToken: '',
  name: '',
  phone: '',
  bankNumber: '',
  bankProvider: '',
};

function Payment() {
  const { setTitle } = useLayoutStore();
  useEffect(() => {
    setTitle('ตั้งค่าการชำระเงิน');
  }, [setTitle]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/payments');
        paymentForm.setValues(response.data);
      } catch (error) {}
    };

    fetchData();
  }, []);

  const paymentForm = useFormik<IPayment & IPaymentAccount>({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        const { accessToken, name, phone, bankNumber, bankProvider } = values;
        const payment = await axiosInstance.patch('/payments', {
          accessToken,
          name,
          phone,
          bankNumber,
          bankProvider,
        });
        paymentForm.setValues(payment.data);
        Swal.fire('Success', 'Category updated successfully!', 'success');
      } catch (error) {
        const axiosError = error as AxiosError;
        Swal.fire('Error', axiosError.message || 'An error occurred.', 'error');
      }
    },
  });

  return (
    <div className="row g-4">
      <div className="col-12">
        <PaymentAccountCard data={paymentForm.values} />
      </div>
      <div className="col-12">
        <PaymentForm paymentForm={paymentForm} />
      </div>
    </div>
  );
}

export default Payment;
