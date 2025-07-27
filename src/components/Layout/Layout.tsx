import './Layout.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BsFillInboxesFill } from 'react-icons/bs';
import { BsBagHeartFill } from 'react-icons/bs';
import { FaBars, FaPlus, FaSearch } from 'react-icons/fa';
import { BsCurrencyExchange } from 'react-icons/bs';
import { useLayoutStore } from '../../store/useLayoutStore';
import unknownImage from '../../assets/images/unknown.png';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const { title, search, setSearch, triggerCreate } = useLayoutStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="layout-container">
      <div
        className={`sidebar bg-white text-primary ${sidebarOpen ? 'open' : ''}`}
      >
        <div className="p-3">
          <h5 className="mb-4 fw-bold text-primary">เมนู</h5>
          <ul className="list-unstyled">
            <li>
              <Link to="/" onClick={closeSidebar} className="menu-item">
                <BsFillInboxesFill className="me-2" /> ประเภทสินค้าที่วางขาย
              </Link>
            </li>
            <li>
              <Link
                to="/providers"
                onClick={closeSidebar}
                className="menu-item"
              >
                <BsBagHeartFill className="me-2" /> ร้านค้า
              </Link>
            </li>
            <li>
              <Link
                to="/line-customers"
                onClick={closeSidebar}
                className="menu-item"
              >
                <BsBagHeartFill className="me-2" /> ลูกค้า Line
              </Link>
            </li>
            <li>
              <Link to="/incomes" onClick={closeSidebar} className="menu-item">
                <BsCurrencyExchange className="me-2" /> บัญชีรายรับ
              </Link>
            </li>
            <li>
              <Link to="/expenses" onClick={closeSidebar} className="menu-item">
                <BsCurrencyExchange className="me-2" /> บัญชีรายจ่าย
              </Link>
            </li>
            <li>
              <Link to="/settings" onClick={closeSidebar} className="menu-item">
                <BsCurrencyExchange className="me-2" /> การตั้งค่า
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}

      <div className="main-content">
        <div className="main-header">
          <div className="header-top-row">
            <button
              className="btn text-primary d-md-none"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              <FaBars size={20} />
            </button>
            <h5 className="mb-0 text-nowrap text-primary fw-bold">
              {title || 'ไม่พบหัวข้อ'}
            </h5>
            <img
              src={unknownImage}
              alt="avatar"
              className="rounded-circle"
              style={{ width: 36, height: 36 }}
            />
          </div>
          <div className="header-bottom-row">
            <div className="search-input-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="ค้นหา"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <button
              className="add-button"
              onClick={() => triggerCreate()}
              aria-label="Add new item"
            >
              <FaPlus />
            </button>
          </div>
        </div>
        <div
          className="content-area"
          style={{
            height: 'calc(100vh - 120px)',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;
