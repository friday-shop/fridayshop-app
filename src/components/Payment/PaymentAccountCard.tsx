import React from 'react';
import type { IPayment, IPaymentAccount } from '../../types/payment';

interface PaymentAccountCardProps {
  data: IPaymentAccount & IPayment;
}

const PaymentAccountCard: React.FC<PaymentAccountCardProps> = ({ data }) => {
  const {
    shopName,
    package: packageData,
    packageExpiredDate,
    quotaLimit,
    quotaRemaining,
    creditRemaining,
    autoRenewalPackage,
  } = data;

  return (
    <div
      className={`card border-0 rounded-4 overflow-hidden w-100 bg-white`}
      style={{
        boxShadow: '0 4px 12px rgba(255, 215, 243, 0.43)',
      }}
    >
      <div className="card-body p-4 p-md-5">
        <h2 className="card-title text-center fs-3 fw-bold mb-3">{shopName}</h2>
        <hr className="my-4" />
        <div className="row gy-0 gx-md-4">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-2">แพ็กเกจที่เลือก : {packageData}</p>
            <p className="mb-2">วันหมดอายุ : {packageExpiredDate}</p>
            <p className="mb-2">ต่ออายุอัตโนมัติ : {autoRenewalPackage}</p>
          </div>
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-2">เครดิตคงเหลือในระบบ : {creditRemaining}</p>
            <p className="mb-2">จำนวนการเช็คทั้งหมด : {quotaLimit}</p>
            <p className="mb-2">จำนวนการเช็คคงเหลือ : {quotaRemaining}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentAccountCard;
