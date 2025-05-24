/* import { useState, useContext } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <style>{`
        .layout-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .layout-container::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: float 6s ease-in-out infinite;
          pointer-events: none;
        }

        .layout-container::after {
          content: '';
          position: absolute;
          bottom: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
          animation: float 8s ease-in-out infinite reverse;
          pointer-events: none;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        .sidebar-glass {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
          border-radius: 0 24px 24px 0;
          margin: 12px 0 12px 12px;
          z-index: 1000;
        }

        .sidebar-glass.mobile-open {
          border-radius: 24px;
          margin: 12px;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: between;
          padding: 24px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.2);
        }

        .brand-title {
          font-size: 28px;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        .close-button {
          background: rgba(107, 114, 128, 0.1);
          border: none;
          border-radius: 12px;
          padding: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #6b7280;
        }

        .close-button:hover {
          background: rgba(107, 114, 128, 0.2);
          transform: scale(1.05);
        }

        .nav-section {
          padding: 24px;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .nav-link {
          display: flex;
          align-items: center;
          padding: 16px 20px;
          margin: 4px 0;
          border-radius: 16px;
          text-decoration: none;
          color: #4a5568;
          font-weight: 500;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .nav-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
          transition: left 0.6s ease;
        }

        .nav-link:hover::before {
          left: 100%;
        }

        .nav-link:hover {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          transform: translateX(4px);
          color: #667eea;
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.15);
        }

        .nav-link.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 12px 24px rgba(102, 126, 234, 0.3);
          transform: translateX(4px);
        }

        .nav-link.active:hover {
          color: white;
        }

        .nav-icon {
          width: 20px;
          height: 20px;
          margin-right: 16px;
          transition: transform 0.3s ease;
        }

        .nav-link:hover .nav-icon {
          transform: scale(1.1);
        }

        .user-section {
          margin-top: auto;
          padding-top: 24px;
          border-top: 1px solid rgba(226, 232, 240, 0.2);
        }

        .user-info {
          display: flex;
          align-items: center;
          padding: 16px 20px;
          color: #718096;
          font-weight: 500;
          border-radius: 16px;
          background: rgba(102, 126, 234, 0.05);
          margin-bottom: 12px;
        }

        .user-icon {
          width: 20px;
          height: 20px;
          margin-right: 16px;
        }

        .logout-button {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 16px 20px;
          background: none;
          border: none;
          border-radius: 16px;
          color: #e53e3e;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .logout-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(229, 62, 62, 0.1), transparent);
          transition: left 0.6s ease;
        }

        .logout-button:hover::before {
          left: 100%;
        }

        .logout-button:hover {
          background: rgba(229, 62, 62, 0.1);
          transform: translateX(4px);
          box-shadow: 0 8px 20px rgba(229, 62, 62, 0.15);
        }

        .logout-icon {
          width: 20px;
          height: 20px;
          margin-right: 16px;
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 10;
        }

        .header-glass {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          margin: 12px 12px 0 0;
          border-radius: 24px;
          padding: 16px 32px;
          z-index: 100;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .menu-button {
          background: rgba(107, 114, 128, 0.1);
          border: none;
          border-radius: 12px;
          padding: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #6b7280;
        }

        .menu-button:hover {
          background: rgba(107, 114, 128, 0.2);
          transform: scale(1.05);
        }

        .header-brand {
          font-size: 20px;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 16px;
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
          transition: all 0.3s ease;
        }

        .user-avatar:hover {
          transform: scale(1.05);
          box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
        }

        .main-content-area {
          flex: 1;
          padding: 24px;
          margin: 0 12px 12px 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 24px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
          overflow-y: auto;
        }

        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 999;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }

        .sidebar-overlay.open {
          opacity: 1;
          visibility: visible;
        }

        @media (max-width: 768px) {
          .sidebar-glass {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            width: 280px;
            margin: 0;
            border-radius: 0 24px 24px 0;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }

          .sidebar-glass.mobile-open {
            transform: translateX(0);
            border-radius: 0 24px 24px 0;
            margin: 0;
          }

          .header-glass {
            margin: 12px;
          }

          .main-content-area {
            margin: 0 12px 12px 12px;
          }
        }
      `}</style>

      <div className="layout-container flex h-screen">
        <div
          className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`}
          onClick={() => setSidebarOpen(false)}
        ></div>

        <div
          className={`${
            sidebarOpen ? "translate-x-0 mobile-open" : "-translate-x-full"
          } md:translate-x-0 fixed md:relative md:flex flex-col w-64 h-screen sidebar-glass transition-transform duration-300 ease-in-out z-10`}
        >
          <div className="sidebar-header">
            <h2 className="brand-title">Taskly</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden close-button"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <div className="nav-section">
            <nav>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <svg
                  className="nav-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  ></path>
                </svg>
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/teams"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <svg
                  className="nav-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  ></path>
                </svg>
                <span>Teams</span>
              </NavLink>

              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <svg
                  className="nav-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
                <span>Profile</span>
              </NavLink>
            </nav>

            <div className="user-section">
              <div className="user-info">
                <svg
                  className="user-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
                <span>{user?.name}</span>
              </div>

              <button onClick={handleLogout} className="logout-button">
                <svg
                  className="logout-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  ></path>
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        <div className="main-content">
          <header className="header-glass">
            <div className="header-content">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden menu-button"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </button>

              <div className="relative">
                <span className="header-brand">Taskly</span>
              </div>

              <div className="flex items-center">
                <div className="relative">
                  <div className="user-avatar">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="main-content-area">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default MainLayout;
 */