import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import CategoryList from './pages/CategoryList';
import ProductList from './pages/ProductList';
import Product from './pages/Product';
import ProviderList from './pages/ProviderList';
import Payment from './pages/Payment';
import BottomSheet from './components/BottomSheet/BottomSheet';
import Login from './pages/Login';
import useUser from './hooks/useUser';

function App() {
  const user = useUser();
  return (
    <>
      {user?.data ? (
        <Layout>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/categories" element={<CategoryList />} />
            <Route path="/products/:categoryId" element={<ProductList />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/providers" element={<ProviderList />} />
            <Route path="/payment" element={<Payment />} />
          </Routes>
        </Layout>
      ) : (
        <Routes>
          <Route index element={<Login />} />
        </Routes>
      )}
      <BottomSheet />
    </>
  );
}

export default App;
