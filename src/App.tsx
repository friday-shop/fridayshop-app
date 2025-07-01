import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import CategoryList from './pages/CategoryList';
import ProductList from './pages/ProductList';
import ProviderList from './pages/ProviderList';
import Payment from './pages/Payment';
import Login from './pages/Login';
import useUser from './hooks/useUser';

function App() {
  const user = useUser();
  return (
    <>
      {user?.data ? (
        <Layout>
          <Routes>
            <Route path="/fridayshop-app/" element={<CategoryList />} />
            <Route
              path="/fridayshop-app/products/:categoryId"
              element={<ProductList />}
            />
            <Route
              path="/fridayshop-app/providers"
              element={<ProviderList />}
            />
            <Route path="/fridayshop-app/payment" element={<Payment />} />
          </Routes>
        </Layout>
      ) : (
        <Routes>
          <Route path="/fridayshop-app/" element={<Login />} />
        </Routes>
      )}
    </>
  );
}

export default App;
