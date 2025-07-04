import { useFormik } from 'formik';
import type { IPayment, IPaymentAccount } from '../../types/payment';

interface PaymentFormProps {
  paymentForm: ReturnType<typeof useFormik<IPayment & IPaymentAccount>>;
}
const thaiBanks = [
  'กสิกรไทย',
  'ไทยพาณิชย์',
  'กรุงเทพ',
  'กรุงไทย',
  'กรุงศรีอยุธยา',
  'ทหารไทยธนชาต (TTB)',
  'ออมสิน',
  'อิสลามแห่งประเทศไทย',
  'ธกส.',
  'ยูโอบี',
  'ซิตี้แบงก์',
  'แลนด์แอนด์เฮ้าส์',
  'ไอซีบีซี (ไทย)',
  'ซีไอเอ็มบี ไทย',
  'เกียรตินาคินภัทร',
  'เมกะ สากลพาณิชย์',
  'ไทยเครดิต',
];
export default function PaymentForm({ paymentForm }: PaymentFormProps) {
  return (
    <div
      className="d-flex flex-column px-3 gap-3 py-3 rounded-bottom-4 border-0 fw-bold card "
      style={{
        boxShadow: '0 4px 12px rgba(255, 215, 243, 0.43)',
      }}
    >
      <div className="form-group">
        <label htmlFor="name">ชื่อ</label>
        <input
          id="name"
          name="name"
          type="text"
          className={`form-control${paymentForm.touched.name && paymentForm.errors.name ? ' is-invalid' : ''}`}
          value={paymentForm.values.name}
          onChange={paymentForm.handleChange}
          onBlur={paymentForm.handleBlur}
        />
        {paymentForm.touched.name && paymentForm.errors.name ? (
          <div className="invalid-feedback">{paymentForm.errors.name}</div>
        ) : null}
      </div>
      <div className="form-group">
        <label htmlFor="engName">ชื่อ(อังกฤษ)</label>
        <input
          id="engName"
          name="engName"
          type="text"
          className={`form-control${paymentForm.touched.engName && paymentForm.errors.engName ? ' is-invalid' : ''}`}
          value={paymentForm.values.engName}
          onChange={paymentForm.handleChange}
          onBlur={paymentForm.handleBlur}
        />
        {paymentForm.touched.engName && paymentForm.errors.engName ? (
          <div className="invalid-feedback">{paymentForm.errors.engName}</div>
        ) : null}
      </div>

      <div className="form-group">
        <label htmlFor="accessToken">accessToken</label>
        <input
          id="accessToken"
          name="accessToken"
          type="text"
          className={`form-control${paymentForm.touched.accessToken && paymentForm.errors.accessToken ? ' is-invalid' : ''}`}
          value={paymentForm.values.accessToken}
          onChange={paymentForm.handleChange}
          onBlur={paymentForm.handleBlur}
        />
        {paymentForm.touched.accessToken && paymentForm.errors.accessToken ? (
          <div className="invalid-feedback">
            {paymentForm.errors.accessToken}
          </div>
        ) : null}
      </div>
      <div className="form-group">
        <label htmlFor="phone">phone</label>
        <input
          id="phone"
          name="phone"
          type="text"
          className={`form-control${paymentForm.touched.phone && paymentForm.errors.phone ? ' is-invalid' : ''}`}
          value={paymentForm.values.phone}
          onChange={paymentForm.handleChange}
          onBlur={paymentForm.handleBlur}
        />
        {paymentForm.touched.phone && paymentForm.errors.phone ? (
          <div className="invalid-feedback">{paymentForm.errors.phone}</div>
        ) : null}
      </div>
      <div className="form-group">
        <label htmlFor="bankNumber">bankNumber</label>
        <input
          id="bankNumber"
          name="bankNumber"
          type="text"
          className={`form-control${paymentForm.touched.bankNumber && paymentForm.errors.bankNumber ? ' is-invalid' : ''}`}
          value={paymentForm.values.bankNumber}
          onChange={paymentForm.handleChange}
          onBlur={paymentForm.handleBlur}
        />
        {paymentForm.touched.bankNumber && paymentForm.errors.bankNumber ? (
          <div className="invalid-feedback">
            {paymentForm.errors.bankNumber}
          </div>
        ) : null}
      </div>
      <div className="form-group">
        <label htmlFor="bankProvider">เลือกธนาคาร</label>
        <select
          id="bankProvider"
          name="bankProvider"
          className={`form-control${paymentForm.touched.bankProvider && paymentForm.errors.bankProvider ? ' is-invalid' : ''}`}
          value={paymentForm.values.bankProvider}
          onChange={paymentForm.handleChange}
          onBlur={paymentForm.handleBlur}
        >
          <option value="">-- กรุณาเลือกธนาคาร --</option>
          {thaiBanks.map((bank) => (
            <option key={bank} value={bank}>
              {bank}
            </option>
          ))}
        </select>
        {paymentForm.touched.bankProvider &&
          paymentForm.errors.bankProvider && (
            <div className="invalid-feedback">
              {paymentForm.errors.bankProvider}
            </div>
          )}
      </div>
      <button
        className="rounded-4 border-0 fw-bold"
        style={{
          backgroundColor: '#FFBB38',
          height: '5vh',
          width: '100%',
          color: 'white',
        }}
        onClick={async () => {
          await paymentForm.submitForm();
        }}
      >
        ยืนยัน
      </button>
    </div>
  );
}
