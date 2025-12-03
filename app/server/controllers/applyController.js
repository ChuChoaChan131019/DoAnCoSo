import db from "../configs/db.config.js";
import { createNotification } from "./notificationController.js"; // ✅ THÊM DÒNG NÀY

function getUserId(req) {
  return req.user?.id || req.user?.ID_User || null;
}

export const applyForJob = async (req, res) => {
  const userId = getUserId(req);
  const { jobId } = req.params;

  if (!userId || req.user.role !== "candidate") {
    return res
      .status(403)
      .json({ message: "Chỉ ứng viên đã đăng nhập mới được ứng tuyển" });
  }

  if (!jobId) {
    return res.status(400).json({ message: "Thiếu ID công việc" });
  }

  try {
    // Lấy thông tin ứng viên
    const [candidateRows] = await db.query(
      "SELECT ID_Candidate, Resume_URL, FullName FROM Candidate WHERE ID_User = ?",
      [userId]
    );

    if (!candidateRows.length) {
      return res
        .status(400)
        .json({ message: "Ứng viên chưa có hồ sơ cá nhân" });
    }

    const { ID_Candidate, Resume_URL, FullName } = candidateRows[0];

    if (!Resume_URL) {
      return res
        .status(400)
        .json({ message: "Vui lòng upload CV/Hồ sơ trước khi ứng tuyển." });
    }

    // Kiểm tra công việc và lấy thông tin nhà tuyển dụng
    const [jobRows] = await db.query(
      `SELECT j.ID_Job, j.Name_Job, j.Job_Location, 
                    e.ID_User as Employer_User_Id, e.Company_Name
             FROM Job j
             JOIN Employer e ON j.ID_Employer = e.ID_Employer
             WHERE j.ID_Job = ? AND j.Job_Status = 'opened'`,
      [jobId]
    );

    if (!jobRows.length) {
      return res
        .status(400)
        .json({ message: "Công việc không tồn tại hoặc đã đóng" });
    }

    const jobInfo = jobRows[0];

    // Kiểm tra đã ứng tuyển chưa
    const [existingApplication] = await db.query(
      "SELECT * FROM Application WHERE ID_Candidate = ? AND ID_Job = ?",
      [ID_Candidate, jobId]
    );

    if (existingApplication.length > 0) {
      return res
        .status(400)
        .json({ message: "Bạn đã ứng tuyển công việc này rồi" });
    }

    // Tạo đơn ứng tuyển
    await db.query(
      `INSERT INTO Application (ID_Job, ID_Candidate, Date_Applied, Application_Status) 
             VALUES (?, ?, NOW(), 'pending')`,
      [jobId, ID_Candidate]
    );

    console.log(
      `✅ Ứng viên ${FullName} đã ứng tuyển vào công việc: ${jobInfo.Name_Job}`
    );

    // ✅ GỬI THÔNG BÁO CHO NHÀ TUYỂN DỤNG
    try {
      await createNotification(
        jobInfo.Employer_User_Id,
        "new_application",
        "📋 Có ứng viên mới",
        `${FullName || "Một ứng viên"} vừa ứng tuyển vào vị trí: ${
          jobInfo.Name_Job
        }`,
        jobId
      );
      console.log(`✅ Đã gửi thông báo đến nhà tuyển dụng`);
    } catch (notifErr) {
      console.error("⚠️ Lỗi khi gửi thông báo:", notifErr);
    }

    return res.status(201).json({
      message: "Ứng tuyển thành công! Thông tin hồ sơ và CV đã được gửi.",
    });
  } catch (err) {
    console.error("[APPLY JOB ERROR]", err);
    return res.status(500).json({ message: "Lỗi máy chủ khi ứng tuyển" });
  }
};

// GIỮ NGUYÊN CÁC HÀM KHÁC
export const listMyApplications = async (req, res) => {
  const userId = req.user?.id;

  if (!userId || req.user.role !== "candidate") {
    return res.status(403).json({ message: "Chỉ ứng viên mới được truy cập" });
  }

  try {
    const [candidateRows] = await db.query(
      "SELECT ID_Candidate FROM Candidate WHERE ID_User = ?",
      [userId]
    );
    if (!candidateRows.length) {
      return res.json({ applications: [] });
    }
    const { ID_Candidate } = candidateRows[0];

    const sql = `
            SELECT 
                A.ID_Job, A.Date_Applied, A.Application_Status,
                J.Name_Job, J.Job_Location, J.Salary, J.Start_Date,
                E.Company_Name, E.Company_Logo
            FROM Application A
            JOIN Job J ON A.ID_Job = J.ID_Job
            JOIN Employer E ON J.ID_Employer = E.ID_Employer
            WHERE A.ID_Candidate = ?
            ORDER BY A.Date_Applied DESC
        `;
    const [rows] = await db.query(sql, [ID_Candidate]);

    const normalized = rows.map((r) => ({
      ...r,
      Company_Logo: r.Company_Logo
        ? `/uploads/${r.Company_Logo.split("/").pop()}`
        : null,
    }));

    return res.json({ applications: normalized });
  } catch (err) {
    console.error("[LIST MY APPLICATIONS ERROR]", err);
    return res
      .status(500)
      .json({ message: "Lỗi máy chủ khi lấy danh sách ứng tuyển" });
  }
};

export const countNewApplications = async (req, res) => {
  const userId = req.user?.id;

  if (!userId || req.user.role !== "employer") {
    return res.json({ count: 0 });
  }

  try {
    const [empRows] = await db.query(
      "SELECT ID_Employer FROM Employer WHERE ID_User = ?",
      [userId]
    );
    if (!empRows.length) {
      return res.json({ count: 0 });
    }
    const { ID_Employer } = empRows[0];

    const sql = `
            SELECT COUNT(A.ID_Job) AS NewCount
            FROM Application A
            JOIN Job J ON A.ID_Job = J.ID_Job
            WHERE J.ID_Employer = ? AND A.Application_Status = 'pending'
        `;
    const [rows] = await db.query(sql, [ID_Employer]);

    return res.json({ count: rows[0]?.NewCount || 0 });
  } catch (err) {
    console.error("[COUNT NEW APPLICATIONS ERROR]", err);
    return res.status(500).json({ message: "Lỗi máy chủ", count: 0 });
  }
};
