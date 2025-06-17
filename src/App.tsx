import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Category from './pages/Category';
import Product from './pages/Product';
import Store from './pages/Store';
import Payment from './pages/Payment';

// const AVATAR = 'https://randomuser.me/api/portraits/women/65.jpg';

function getHeaderTitle(path: string) {
  switch (path) {
    case '/category':
      return 'ประเภทสินค้าที่วางขาย';
    case '/store':
      return 'ร้านค้า';
    case '/payment':
      return 'ชำระเงิน';
    default:
      return '';
  }
}

function App() {
  const location = useLocation();
  const headerTitle = getHeaderTitle(location.pathname);

  return (
    <Layout headerTitle={headerTitle}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category" element={<Category />} />
        <Route path="/product" element={<Product />} />
        <Route path="/store" element={<Store />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </Layout>
  );
}

export default App;
