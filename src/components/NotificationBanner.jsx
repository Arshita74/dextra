import React, { useState } from 'react';

export default function NotificationBanner({ notifications }) {
  const [closedIds, setClosedIds] = useState([]);

  const activeNotifs = notifications.filter((n) => !closedIds.includes(n.id));

  if (activeNotifs.length === 0) return null;

  return (
    <div className="notifications-container">
      {activeNotifs.map((notif) => (
        <div key={notif.id} className={`notification-item notif-${notif.type}`}>
          <div className="notif-content">
            <span className="notif-icon">
              {notif.type === 'success' ? '🎉' : notif.type === 'reminder' ? '⏰' : '🔔'}
            </span>
            <span className="notif-text">{notif.text}</span>
          </div>
          <button
            className="notif-close"
            onClick={() => setClosedIds((prev) => [...prev, notif.id])}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
