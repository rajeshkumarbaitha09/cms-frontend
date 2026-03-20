"use client";

export default function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Sora:wght@400;500&display=swap');

        .footer-pill {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 50;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 14px;
          background: rgba(5,6,15,0.85);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 100px;
          backdrop-filter: blur(20px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          text-decoration: none;
          font-family: 'Sora', sans-serif;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
          animation: slideIn 0.5s 0.3s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes slideIn {
          from { opacity:0; transform:translateY(12px) scale(0.95); }
          to   { opacity:1; transform:translateY(0)   scale(1);    }
        }
        .footer-pill:hover {
          border-color: rgba(10,102,194,0.5);
          background: rgba(10,102,194,0.12);
          box-shadow: 0 8px 32px rgba(10,102,194,0.2), 0 0 0 1px rgba(10,102,194,0.15);
          transform: translateY(-2px);
        }

        /* LinkedIn icon circle */
        .footer-li-icon {
          width: 26px; height: 26px;
          background: #0a66c2;
          border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(10,102,194,0.4);
        }
        .footer-pill:hover .footer-li-icon {
          background: #0d78d9;
          box-shadow: 0 4px 14px rgba(10,102,194,0.55);
        }

        /* Text */
        .footer-text {
          display: flex; flex-direction: column;
          gap: 1px;
        }
        .footer-label {
          font-family: 'Space Mono', monospace;
          font-size: 8.5px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(240,244,255,0.25);
          line-height: 1;
        }
        .footer-name {
          font-size: 12.5px; font-weight: 600;
          color: rgba(240,244,255,0.75);
          line-height: 1;
          transition: color 0.2s;
        }
        .footer-pill:hover .footer-name { color: #63b3ed; }

        /* Arrow */
        .footer-arrow {
          color: rgba(240,244,255,0.2);
          flex-shrink: 0;
          transition: all 0.2s;
        }
        .footer-pill:hover .footer-arrow {
          color: rgba(99,179,237,0.7);
          transform: translateX(2px);
        }
      `}</style>

      <a
        href="https://www.linkedin.com/in/kumarashish0217/"
        target="_blank"
        rel="noopener noreferrer"
        className="footer-pill"
      >
        {/* LinkedIn Icon */}
        <div className="footer-li-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </div>

        {/* Text */}
        <div className="footer-text">
          <span className="footer-label">Developed by</span>
          <span className="footer-name">Ashish Gupta</span>
        </div>

        {/* Arrow */}
        <svg className="footer-arrow" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </>
  );
}