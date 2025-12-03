import db from "../configs/db.config.js";

// Hàm tạo thông báo (dùng nội bộ)
export const createNotification = async (
  userId,
  type,
  title,
  message,
  relatedId = null
) => {
  try {
    await db.query(
      // Thay đổi tên cột trong câu SQL INSERT
      `INSERT INTO notification (ID_User, Notification_Type, Notification_Title, Notification_Content, Related_ID) 
             VALUES (?, ?, ?, ?, ?)`,
      [userId, type, title, message, relatedId]
    );
    console.log(`✅ Đã tạo thông báo cho user ${userId}: ${title}`);
  } catch (err) {
    console.error("[CREATE NOTIFICATION ERROR]", err);
  }
};

// ...
// Sửa tên cột khi SELECT thông báo
export const getMyNotifications = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const [notifications] = await db.query(
      // SỬA: Dùng ALIAS để trả về tên cột mà Frontend mong đợi
      `SELECT ID_Notification, 
              Notification_Type as Type,
              Notification_Title as Title,
              Notification_Content as Message,
              Related_ID, Is_Read, Created_At
             FROM notification 
             WHERE ID_User = ? 
             ORDER BY Created_At DESC 
             LIMIT 50`,
      [userId]
    );

    return res.json({ notifications });
  } catch (err) {
    console.error("[GET NOTIFICATIONS ERROR]", err);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// Đánh dấu 1 thông báo đã đọc
export const markAsRead = async (req, res) => {
  const userId = req.user?.id;
  const { notificationId } = req.params;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const [result] = await db.query(
      `UPDATE notification 
             SET Is_Read = TRUE 
             WHERE ID_Notification = ? AND ID_User = ?`,
      [notificationId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy thông báo" });
    }

    return res.json({ message: "Đã đánh dấu đọc" });
  } catch (err) {
    console.error("[MARK AS READ ERROR]", err);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// Đánh dấu tất cả thông báo đã đọc
export const markAllAsRead = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await db.query(
      `UPDATE notification 
             SET Is_Read = TRUE 
             WHERE ID_User = ? AND Is_Read = FALSE`,
      [userId]
    );

    return res.json({ message: "Đã đánh dấu tất cả" });
  } catch (err) {
    console.error("[MARK ALL AS READ ERROR]", err);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// Đếm số thông báo chưa đọc
export const countUnread = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.json({ count: 0 });
  }

  try {
    const [rows] = await db.query(
      `SELECT COUNT(*) as count 
             FROM notification 
             WHERE ID_User = ? AND Is_Read = FALSE`,
      [userId]
    );

    return res.json({ count: rows[0]?.count || 0 });
  } catch (err) {
    console.error("[COUNT UNREAD ERROR]", err);
    return res.status(500).json({ message: "Lỗi máy chủ", count: 0 });
  }
};

// Xóa thông báo
export const deleteNotification = async (req, res) => {
  const userId = req.user?.id;
  const { notificationId } = req.params;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const [result] = await db.query(
      `DELETE FROM notification 
             WHERE ID_Notification = ? AND ID_User = ?`,
      [notificationId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy thông báo" });
    }

    return res.json({ message: "Đã xóa thông báo" });
  } catch (err) {
    console.error("[DELETE NOTIFICATION ERROR]", err);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
