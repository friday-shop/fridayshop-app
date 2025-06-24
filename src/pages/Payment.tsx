import { useEffect } from 'react';
import { useLayoutStore } from '../store/useLayoutStore';
import useAxios from '../hooks/useAxios';
import type { IPayment, IPaymentAccount } from '../types/payment';

// Component สำหรับการ์ดกรอกข้อมูลบัญชีธนาคาร
const AccountDetailsCard = () => {
  // สไตล์สำหรับปุ่ม "บันทึก"
  const saveButtonStyle = {
    backgroundColor: '#16DBCC',
    color: 'white',
    border: 'none',
    fontWeight: 'bold',
  };

  return (
    <div className="card-body p-4 p-md-5">
      {/* Title */}
      <h2 className="card-title text-center fs-4 fw-bold mb-3">
        รายละเอียดบัญชีรับเงิน
      </h2>
      <hr className="my-4" />
      {/* Form */}
      <form>
        <div className="mb-3">
          <label htmlFor="account-name" className="form-label fw-bold">
            ชื่อบัญชีธนาคาร
          </label>
          <input
            type="text"
            className="form-control py-2"
            id="account-name"
            placeholder="กรอกชื่อบัญชีธนาคาร"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="bank-selection" className="form-label fw-bold">
            ธนาคาร
          </label>
          <select
            className="form-select py-2"
            id="bank-selection"
            defaultValue=""
          >
            <option value="" disabled>
              เลือกธนาคาร
            </option>
            <option value="kbank">ธนาคารกสิกรไทย</option>
            <option value="scb">ธนาคารไทยพาณิชย์</option>
            <option value="bbl">ธนาคารกรุงเทพ</option>
            <option value="ktb">ธนาคารกรุงไทย</option>
            <option value="tmb">ธนาคารทหารไทยธนชาต (TMBThanachart)</option>
            <option value="bay">ธนาคารกรุงศรีอยุธยา</option>
            <option value="cimb">ธนาคารซีไอเอ็มบี ไทย</option>
            <option value="uob">ธนาคารยูโอบี</option>
            <option value="tisco">ธนาคารทิสโก้</option>
            <option value="kk">ธนาคารเกียรตินาคิน</option>
            <option value="ghb">ธนาคารอาคารสงเคราะห์</option>
            <option value="ibank">ธนาคารอิสลามแห่งประเทศไทย</option>
            <option value="gsb">ธนาคารออมสิน</option>
            <option value="baac">ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร</option>
            <option value="lhbank">ธนาคารแลนด์ แอนด์ เฮ้าส์</option>
            <option value="icbc">ธนาคารไอซีบีซี (ไทย)</option>
            <option value="mega">ธนาคารเมกะ สากลพาณิชย์</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="account-number" className="form-label fw-bold">
            เลขที่บัญชี
          </label>
          <input
            type="text"
            className="form-control py-2"
            id="account-number"
            placeholder="กรอกเลขที่บัญชี"
          />
        </div>
        <div className="d-grid">
          <button type="submit" className="btn btn-lg" style={saveButtonStyle}>
            บันทึก
          </button>
        </div>
      </form>
    </div>
  );
};

// Component หลักที่รวมทั้งสองการ์ดเข้าด้วยกัน
function Payment() {
  // สไตล์สำหรับข้อความหลักในการ์ด (ใช้ร่วมกันทั้งสองการ์ด)
  const cardTextStyle = {
    color: '#343a5b',
  };

  const { setTitle, setContent } = useLayoutStore();
  useEffect(() => {
    setTitle('ตั้งค่าการชำระเงิน');
    setContent(null);
  }, [setTitle]);

  const paymentAccount = useAxios<IPaymentAccount>({
    method: 'GET',
    url: '/payments/account',
  });

  const paymentOwner = useAxios<IPayment>({
    method: 'GET',
    url: '/payments/owner',
  });

  return (
    <div
      className="container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
      }}
    >
      <div
        className="card border-0 shadow-lg rounded-4 overflow-hidden w-100"
        style={{ maxWidth: '600px', margin: '0 auto', ...cardTextStyle }}
      >
        <div className="card-body p-4 p-md-5">
          <h2 className="card-title text-center fs-3 fw-bold mb-3">
            fridayshop
          </h2>
          <hr className="my-4" />
          <div className="row gy-0 gx-md-4">
            <div className="col-md-6 text-center text-md-start">
              <p className="mb-2">แพ็กเกจที่เลือก : Basic</p>
              <p className="mb-2">วันหมดอายุ : 15/06/2568</p>
              <p className="mb-2">ต่ออายุอัตโนมัติ : ต่อ</p>
            </div>
            <div className="col-md-6 text-center text-md-start">
              <p className="mb-2">
                เครดิตคงเหลือในระบบ : {paymentAccount?.data?.creditRemaining}
              </p>
              <p className="mb-2">
                จำนวนการเช็คทั้งหมด : {paymentAccount?.data?.quotaLimit}
              </p>
              <p className="mb-2">
                จำนวนการเช็คคงเหลือ : {paymentAccount?.data?.quotaRemaining}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-2">
            <label htmlFor="token-input" className="form-label fw-bold">
              token
            </label>
            <div className="input-group">
              <input
                id="token-input"
                type="text"
                className="form-control py-2"
                placeholder="กรอก token"
                aria-label="Token Input"
              />
              <button
                className="btn px-4"
                style={{
                  backgroundColor: '#16DBCC',
                  color: 'white',
                  border: 'none',
                }}
                type="button"
              >
                ใช้งาน
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ----- การ์ดข้อมูลบัญชี (ส่วนที่เพิ่มใหม่) ----- */}
      <div
        className="card border-0 shadow-lg rounded-4 overflow-hidden w-100"
        style={{ maxWidth: '600px', margin: '0 auto', ...cardTextStyle }}
      >
        <AccountDetailsCard />
      </div>
    </div>
  );
}

export default Payment;
