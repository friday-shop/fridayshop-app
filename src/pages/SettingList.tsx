import { useEffect } from 'react';
import PaymentItem from '../components/Setting/PaymentItem/PaymentItem';
import TelegramItem from '../components/Setting/TelegramItem/TelegramItem';
import { useLayoutStore } from '../store/useLayoutStore';
import LineItem from '../components/Setting/LineItem/LineItem';

function Setting() {
  const { setTitle } = useLayoutStore();
  useEffect(() => {
    setTitle('ตั้งค่า');
  }, [setTitle]);
  return (
    <div className="container py-4">
      <div className="row g-4">
        <div className="col-md-6 col-12">
          <LineItem />
        </div>
        <div className="col-md-6 col-12">
          <PaymentItem />
        </div>
        <div className="col-md-6 col-12">
          <TelegramItem />
        </div>
      </div>
    </div>
  );
}

export default Setting;
