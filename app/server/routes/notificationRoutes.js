import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  countUnread,
  deleteNotification,
} from "../controllers/notificationController.js";

const router = Router();

router.get("/mine", requireAuth, getMyNotifications);
router.get("/count-unread", requireAuth, countUnread);
router.put("/:notificationId/read", requireAuth, markAsRead);
router.put("/read-all", requireAuth, markAllAsRead);
router.delete("/:notificationId", requireAuth, deleteNotification);

export default router;
