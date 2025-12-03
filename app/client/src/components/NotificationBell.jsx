import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./NotificationBell.css";

export default function NotificationBell({ user }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // Lấy token từ localStorage
  const getToken = () => {
    const userStorage = localStorage.getItem("user");
    if (!userStorage) return null;
    try {
      const userData = JSON.parse(userStorage);
      return userData.token;
    } catch {
      return null;
    }
  };

  // Lấy số thông báo chưa đọc
  const fetchUnreadCount = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(
        "http://localhost:5000/api/notifications/count-unread",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setUnreadCount(data.count || 0);
    } catch (err) {
      console.error("Lỗi khi lấy số thông báo:", err);
    }
  };

  // Lấy danh sách thông báo
  const fetchNotifications = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/notifications/mine", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error("Lỗi khi lấy thông báo:", err);
    }
  };

  // Đánh dấu đã đọc
  const markAsRead = async (notificationId) => {
    const token = getToken();
    if (!token) return;

    try {
      await fetch(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUnreadCount();
      fetchNotifications();
    } catch (err) {
      console.error("Lỗi khi đánh dấu đọc:", err);
    }
  };

  // Đánh dấu tất cả đã đọc
  const markAllAsRead = async () => {
    const token = getToken();
    if (!token) return;

    try {
      await fetch("http://localhost:5000/api/notifications/read-all", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchUnreadCount();
      fetchNotifications();
    } catch (err) {
      console.error("Lỗi khi đánh dấu tất cả:", err);
    }
  };

  // Xử lý click vào thông báo
  const handleNotificationClick = (notif) => {
    if (!notif.Is_Read) {
      markAsRead(notif.ID_Notification);
    }

    if (notif.Type === "new_job") {
      navigate(`/jobs/${notif.Related_ID}`);
    } else if (notif.Type === "new_application") {
      navigate("/listcandidate");
    }

    setShowDropdown(false);
  };

  // Format thời gian
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return "Vừa xong";
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`;

    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    if (showDropdown) {
      fetchNotifications();
    }
  }, [showDropdown]);

  if (!user) return null;

  return (
    <div className="notification-bell">
      <button
        className="bell-button"
        onClick={() => setShowDropdown(!showDropdown)}
        title="Thông báo"
      >
        🔔
        {unreadCount > 0 && (
          <span className="badge">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Thông báo</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="mark-all-btn">
                Đánh dấu tất cả
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <p className="no-notifications">Không có thông báo</p>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.ID_Notification}
                  className={`notification-item ${
                    !notif.Is_Read ? "unread" : ""
                  }`}
                  onClick={() => handleNotificationClick(notif)}
                >
                  <h4>{notif.Title}</h4>
                  <p>{notif.Message}</p>
                  <span className="time">{formatTime(notif.Created_At)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
