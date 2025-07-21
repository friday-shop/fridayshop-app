import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import CategoryList from './pages/CategoryList';
import ProductList from './pages/ProductList';
import ProductItem from './pages/ProductItemList';
import ProviderList from './pages/ProviderList';
import Login from './pages/Login';
import useUser from './hooks/useUser';
import IncomeList from './pages/IncomeList';
import ExpensesList from './pages/ExpenseList';
import SettingList from './pages/SettingList';

function App() {
  const user = useUser();
  return (
    <>
      {user?.data ? (
        <Layout>
          <Routes>
            <Route path="/" element={<CategoryList />} />
            <Route path="/products/:categoryId" element={<ProductList />} />
            <Route path="/product-items/:productId" element={<ProductItem />} />
            <Route path="/providers" element={<ProviderList />} />
            <Route path="/incomes" element={<IncomeList />} />
            <Route path="/expenses" element={<ExpensesList />} />
            <Route path="/settings" element={<SettingList />} />
          </Routes>
        </Layout>
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      )}
    </>
  );
}

export default App;
