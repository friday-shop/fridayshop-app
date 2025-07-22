import React from 'react';
import paymentImage from '../../../assets/images/cashless-payment.png';
import type { useFormik } from 'formik';
import type { IPayment, IPaymentAccount } from '../../../types/payment';

interface PaymentCardProps {
  isEdit: boolean;
  onClickCard: () => void;
  paymentForm: ReturnType<typeof useFormik<IPayment & IPaymentAccount>>;
}

const PaymentCard: React.FC<PaymentCardProps> = ({
  isEdit,
  onClickCard,
  paymentForm,
}) => {
  const {
    shopName,
    package: packageData,
    packageExpiredDate,
    quotaLimit,
    quotaRemaining,
    creditRemaining,
    autoRenewalPackage,
  } = paymentForm.values;
  return (
    <div
      className={`card border-0 ${isEdit ? 'rounded-top-4' : 'rounded-4'} overflow-hidden w-100 bg-white`}
      style={{
        boxShadow: '0 4px 12px rgba(255, 215, 243, 0.43)',
      }}
      onClick={onClickCard}
    >
      <div style={{ position: 'relative' }}>
        <img
          src={paymentImage}
          alt={'Payment Logo'}
          className="card-img-top"
          style={{
            height: '160px',
            objectFit: 'contain',
          }}
        />
      </div>
      <div className="card-body text-primary">
        <h5 className="card-title fw-bolder">PAYMENTS</h5>
        <div className="card-body p-4 p-md-5">
          <h2 className="card-title text-center fs-3 fw-bold mb-3">
            {shopName}
          </h2>
          <hr className="my-4" />
          <div className="row gy-0 gx-md-4">
            <div className="col-md-6 text-center text-md-start">
              <p className="mb-2">แพ็กเกจที่เลือก : {packageData}</p>
              <p className="mb-2">วันหมดอายุ : {packageExpiredDate}</p>
              <p className="mb-2">
                ต่ออายุอัตโนมัติ :{' '}
                {autoRenewalPackage ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
              </p>
            </div>
            <div className="col-md-6 text-center text-md-start">
              <p className="mb-2">เครดิตคงเหลือในระบบ : {creditRemaining}</p>
              <p className="mb-2">จำนวนการเช็คทั้งหมด : {quotaLimit}</p>
              <p className="mb-2">จำนวนการเช็คคงเหลือ : {quotaRemaining}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCard;
