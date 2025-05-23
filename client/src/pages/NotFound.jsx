import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <>
      <style>{`
        .notfound-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          position: relative;
          overflow: hidden;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .notfound-container::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: float 8s ease-in-out infinite;
        }

        .notfound-container::after {
          content: '';
          position: absolute;
          bottom: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
          animation: float 10s ease-in-out infinite reverse;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(180deg); }
        }

        .notfound-card {
          max-width: 600px;
          width: 100%;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 32px;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.2);
          position: relative;
          z-index: 10;
          animation: slideUp 0.8s ease-out;
          text-align: center;
          padding: 60px 40px;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .error-number {
          font-size: 160px;
          font-weight: 900;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
          line-height: 1;
          position: relative;
          animation: pulse 2s ease-in-out infinite alternate;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          100% { transform: scale(1.05); }
        }

        .error-number::before {
          content: '404';
          position: absolute;
          top: 0;
          left: 0;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          z-index: -1;
          transform: translate(4px, 4px);
        }

        .glitch-wrapper {
          position: relative;
          display: inline-block;
        }

        .glitch-wrapper::before,
        .glitch-wrapper::after {
          content: '404';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
          animation: glitch 3s infinite;
        }

        .glitch-wrapper::after {
          clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
          animation: glitch 3s infinite reverse;
        }

        @keyframes glitch {
          0%, 96%, 100% { transform: translate(0); }
          1%, 5% { transform: translate(-2px, 2px); }
          6%, 10% { transform: translate(2px, -2px); }
          11%, 15% { transform: translate(-1px, 1px); }
          16%, 20% { transform: translate(1px, -1px); }
        }

        .error-title {
          font-size: 48px;
          font-weight: 800;
          color: #2d3748;
          margin: 30px 0 20px;
          line-height: 1.1;
        }

        .error-subtitle {
          font-size: 20px;
          color: #718096;
          margin-bottom: 40px;
          line-height: 1.5;
          max-width: 480px;
          margin-left: auto;
          margin-right: auto;
        }

        .home-button {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 18px 32px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          border-radius: 20px;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 12px 30px rgba(102, 126, 234, 0.3);
          position: relative;
          overflow: hidden;
        }

        .home-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s ease;
        }

        .home-button:hover::before {
          left: 100%;
        }

        .home-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 18px 40px rgba(102, 126, 234, 0.4);
        }

        .home-button:active {
          transform: translateY(-1px);
        }

        .home-icon {
          width: 20px;
          height: 20px;
          transition: transform 0.3s ease;
        }

        .home-button:hover .home-icon {
          transform: translateX(-2px);
        }

        .floating-shapes {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 1;
        }

        .shape {
          position: absolute;
          opacity: 0.1;
          animation: floatShape 12s infinite linear;
        }

        .shape-1 {
          top: 20%;
          left: 10%;
          width: 80px;
          height: 80px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          border-radius: 50%;
          animation-delay: 0s;
        }

        .shape-2 {
          top: 60%;
          right: 15%;
          width: 60px;
          height: 60px;
          background: linear-gradient(45deg, #764ba2, #667eea);
          transform: rotate(45deg);
          animation-delay: -4s;
        }

        .shape-3 {
          bottom: 30%;
          left: 20%;
          width: 40px;
          height: 40px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          border-radius: 30%;
          animation-delay: -8s;
        }

        @keyframes floatShape {
          0% { transform: translateY(0px) rotate(0deg); opacity: 0.1; }
          50% { opacity: 0.05; }
          100% { transform: translateY(-20px) rotate(360deg); opacity: 0.1; }
        }

        .brand-text {
          position: absolute;
          top: 40px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 24px;
          font-weight: 700;
          background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          z-index: 20;
        }

        @media (max-width: 768px) {
          .notfound-card {
            margin: 20px;
            padding: 40px 20px;
            border-radius: 24px;
          }
          
          .error-number {
            font-size: 120px;
          }
          
          .error-title {
            font-size: 36px;
          }
          
          .error-subtitle {
            font-size: 18px;
          }
          
          .home-button {
            padding: 16px 28px;
            font-size: 15px;
          }
        }

        @media (max-width: 480px) {
          .error-number {
            font-size: 100px;
          }
          
          .error-title {
            font-size: 28px;
          }
          
          .error-subtitle {
            font-size: 16px;
          }
        }
      `}</style>

      <div className="notfound-container">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>

        <div className="brand-text">Taskly</div>

        <div className="notfound-card">
          <div className="glitch-wrapper">
            <h1 className="error-number">404</h1>
          </div>

          <h2 className="error-title">Oops! Page Not Found</h2>

          <p className="error-subtitle">
            The page you're looking for seems to have wandered off into the
            digital void. Don't worry, even the best explorers sometimes take a
            wrong turn!
          </p>

          <Link to="/" className="home-button">
            <svg
              className="home-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Take Me Home
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
