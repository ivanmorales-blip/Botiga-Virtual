import React, { useEffect, useState } from "react";
import { subscribeNotification } from "../utils/notification.js";

export default function NotificationListener() {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeNotification((data) => {
      setNotification(data);

      // auto-hide after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    });

    return unsubscribe;
  }, []);

  if (!notification) return null;

  const { message, type } = notification;

  return (
    <div className="success-popup-overlay" onClick={() => setNotification(null)}>
      <div className={`success-popup ${type}`} onClick={(e) => e.stopPropagation()}>
        <p>{message}</p>

        <button onClick={() => setNotification(null)}>
          Tancar
        </button>
      </div>

          <style jsx>{`
        .success-popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .success-popup {
          background: #fff;
          padding: 2rem;
          border-radius: 1rem;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .success-popup button {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background: #f97316;
          color: white;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: bold;
        }
      `}</style>
    </div>

  );
}
