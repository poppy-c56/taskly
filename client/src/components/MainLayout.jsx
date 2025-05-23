import { useContext, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const MainLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <style>{`
        .main-layout {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .main-layout::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
          animation: float 8s ease-in-out infinite;
          pointer-events: none;
          z-index: 1;
        }

        .main-layout::after {
          content: '';
          position: absolute;
          bottom: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
          animation: float 10s ease-in-out infinite reverse;
          pointer-events: none;
          z-index: 1;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(180deg); }
        }

        .navbar-container {
          position: relative;
          z-index: 20;
          padding: 20px 20px 0;
        }

        .navbar {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          animation: slideDown 0.6s ease-out;
          position: relative;
          overflow: hidden;
        }

        .navbar::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transition: left 0.8s ease;
        }

        .navbar:hover::before {
          left: 100%;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .navbar-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .navbar-main {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 80px;
        }

        .navbar-left {
          display: flex;
          align-items: center;
        }

        .logo-container {
          display: flex;
          align-items: center;
        }

        .logo {
          font-size: 28px;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
        }

        .logo::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 3px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        .logo:hover::after {
          width: 100%;
        }

        .desktop-nav {
          display: none;
          margin-left: 48px;
          gap: 8px;
        }

        @media (min-width: 640px) {
          .desktop-nav {
            display: flex;
          }
        }

        .nav-link {
          display: inline-flex;
          align-items: center;
          padding: 12px 20px;
          border-radius: 12px;
          text-decoration: none;
          font-size: 15px;
          font-weight: 600;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .nav-link.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
          transform: translateY(-2px);
        }

        .nav-link:not(.active) {
          color: #718096;
        }

        .nav-link:not(.active):hover {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          transform: translateY(-2px);
        }

        .navbar-right {
          display: flex;
          align-items: center;
        }

        .user-section {
          display: none;
          align-items: center;
          gap: 16px;
        }

        @media (min-width: 768px) {
          .user-section {
            display: flex;
          }
        }

        .user-greeting {
          color: #4a5568;
          font-weight: 600;
          font-size: 15px;
        }

        .logout-btn {
          padding: 12px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }

        .logout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
        }

        .mobile-menu-btn {
          display: flex;
          padding: 8px;
          border-radius: 8px;
          background: transparent;
          border: none;
          color: #718096;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .mobile-menu-btn:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }

        @media (min-width: 640px) {
          .mobile-menu-btn {
            display: none;
          }
        }

        .mobile-menu {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(226, 232, 240, 0.5);
          animation: slideDown 0.3s ease-out;
        }

        .mobile-menu.hidden {
          display: none;
        }

        @media (min-width: 640px) {
          .mobile-menu {
            display: none !important;
          }
        }

        .mobile-nav-section {
          padding: 16px 0;
        }

        .mobile-nav-link {
          display: block;
          padding: 16px 24px;
          text-decoration: none;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.3s ease;
          border-left: 4px solid transparent;
        }

        .mobile-nav-link.active {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          border-left-color: #667eea;
        }

        .mobile-nav-link:not(.active) {
          color: #718096;
        }

        .mobile-nav-link:not(.active):hover {
          background: rgba(102, 126, 234, 0.05);
          color: #667eea;
          transform: translateX(4px);
        }

        .mobile-user-section {
          padding: 24px;
          border-top: 1px solid rgba(226, 232, 240, 0.5);
        }

        .mobile-user-info {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .user-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 18px;
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }

        .user-details h4 {
          font-size: 16px;
          font-weight: 600;
          color: #2d3748;
          margin: 0 0 4px 0;
        }

        .user-details p {
          font-size: 14px;
          color: #718096;
          margin: 0;
        }

        .mobile-logout-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }

        .mobile-logout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
        }

        .main-content {
          position: relative;
          z-index: 10;
          padding: 20px;
        }

        .content-container {
          max-width: 1200px;
          margin: 0 auto;
        }
      `}</style>

      <div className="main-layout">
        <div className="navbar-container">
          <nav className="navbar">
            <div className="navbar-content">
              <div className="navbar-main">
                <div className="navbar-left">
                  <div className="logo-container">
                    <Link to="/" className="logo">
                      Taskly
                    </Link>
                  </div>
                  <div className="desktop-nav">
                    <Link
                      to="/"
                      className={`nav-link ${isActive("/") ? "active" : ""}`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/tasks"
                      className={`nav-link ${isActive("/tasks") ? "active" : ""}`}
                    >
                      Tasks
                    </Link>
                    <Link
                      to="/teams"
                      className={`nav-link ${isActive("/teams") ? "active" : ""}`}
                    >
                      Teams
                    </Link>
                  </div>
                </div>
                <div className="navbar-right">
                  <div className="user-section">
                    <span className="user-greeting">Hello, {user?.name}</span>
                    <button onClick={logout} className="logout-btn">
                      Sign out
                    </button>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="mobile-menu-btn"
                  >
                    <span className="sr-only">Open main menu</span>
                    {mobileMenuOpen ? (
                      <svg
                        className="block h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="block h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className={`mobile-menu ${mobileMenuOpen ? "" : "hidden"}`}>
                <div className="mobile-nav-section">
                  <Link
                    to="/"
                    className={`mobile-nav-link ${isActive("/") ? "active" : ""}`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/tasks"
                    className={`mobile-nav-link ${isActive("/tasks") ? "active" : ""}`}
                  >
                    Tasks
                  </Link>
                  <Link
                    to="/teams"
                    className={`mobile-nav-link ${isActive("/teams") ? "active" : ""}`}
                  >
                    Teams
                  </Link>
                </div>
                <div className="mobile-user-section">
                  <div className="mobile-user-info">
                    <div className="user-avatar">
                      <span>{user?.name?.charAt(0)}</span>
                    </div>
                    <div className="user-details">
                      <h4>{user?.name}</h4>
                      <p>{user?.email}</p>
                    </div>
                  </div>
                  <button onClick={logout} className="mobile-logout-btn">
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </nav>
        </div>

        <div className="main-content">
          <div className="content-container">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default MainLayout;
