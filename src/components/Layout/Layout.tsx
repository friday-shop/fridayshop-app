import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BsFillInboxesFill } from "react-icons/bs";
import { BsBagHeartFill } from "react-icons/bs";
import './Layout.css';
import {
  FaBars,
  FaPlus,
  FaSearch,
} from 'react-icons/fa';
import unknownImage from '../../assets/images/unknown.png';

interface LayoutProps {
  headerTitle: string;
  avatarUrl?: string;
  children: React.ReactNode;
}

function Layout({ headerTitle, avatarUrl, children }: LayoutProps) {
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
              <Link to="/category" onClick={closeSidebar} className="menu-item">
                <BsFillInboxesFill className="me-2" /> ประเภทสินค้าที่วางขาย
              </Link>
            </li>
            <li>
              <Link to="/store" onClick={closeSidebar} className="menu-item">
                <BsBagHeartFill className="me-2" /> ร้านค้า
              </Link>
            </li>
            {/* <li>
              <Link to="/" onClick={closeSidebar} className="menu-item">
                <FaHome className="me-2" /> หน้าหลัก
              </Link>
            </li>
            <li>
              <Link to="/product" onClick={closeSidebar} className="menu-item">
                <FaBoxOpen className="me-2" /> สินค้า
              </Link>
            </li>
            <li>
              <Link to="/category" onClick={closeSidebar} className="menu-item">
                <FaUser className="me-2" /> โปรไฟล์
              </Link>
            </li> */}
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
              {headerTitle}
            </h5>
            <img
              src={avatarUrl || unknownImage}
              alt="avatar"
              className="rounded-circle"
              style={{ width: 36, height: 36 }}
            />
          </div>
          <div className="header-bottom-row">
            <div className="search-input-container">
              <FaSearch className="search-icon" />
              <input type="text" className="search-input" placeholder="ค้นหา" />
            </div>
            <button
              className="add-button"
              onClick={() => null}
              aria-label="Add new item"
            >
              <FaPlus />
            </button>
          </div>
        </div>
        <div className="content-area">{children}</div>
      </div>
    </div>
  );
}

export default Layout;
