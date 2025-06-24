import { useEffect } from 'react';
import { useBottomSheetStore } from '../store/useBottomSheetStore';
import { useLayoutStore } from '../store/useLayoutStore';

const MyForm = () => (
  <form>
    <h3>My Dynamic Form</h3>
    <input type="text" placeholder="Name" />
    <button type="submit">Submit</button>
  </form>
);
function Home() {
  const { open } = useBottomSheetStore();
  const { search, setContent } = useLayoutStore();

  useEffect(() => {
    setContent(<MyForm />);
  }, []);

  return (
    <div>
      <p>คุณค้นหา: {search}</p>
      <button onClick={() => open(<MyForm />)}>เปิดฟอร์มใน Bottom Sheet</button>
      <h1 style={{ fontFamily: 'cursive' }}>สวัสดี</h1>
      <h1 style={{ fontFamily: 'Noto Sans Thai' }}>สวัสดี0077546456234</h1>
      <h1 style={{ fontFamily: 'sans-serif' }}>สวัสดี</h1>
    </div>
  );
}
export default Home;
