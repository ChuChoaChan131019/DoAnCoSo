// server/controllers/employerController.js
import db from "../configs/db.config.js";

/** Lấy userId từ middleware requireAuth (gán vào req.user) */
function getUserId(req) {
  return req.user?.id || req.user?.ID_User || null;
}

/** Chuẩn hoá chuỗi ngày về 'YYYY-MM-DD' (MySQL DATE) */
function normalizeDate(d) {
  if (!d) return null;
  // Đã đúng định dạng -> giữ nguyên
  if (typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  const dt = new Date(d);
  if (isNaN(dt)) return null;
  return dt.toISOString().slice(0, 10);
}

/* ===========================================
 * GET /api/employer/me
 * =========================================== */
export const getMyEmployer = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // Lấy email mặc định từ Users (nếu Employer chưa có)
    const [u] = await db.query("SELECT Email FROM Users WHERE ID_User=?", [
      userId,
    ]);
    const defaultEmail = u?.[0]?.Email || "";

    const [rows] = await db.query("SELECT * FROM Employer WHERE ID_User=?", [
      userId,
    ]);
    if (!rows.length) {
      // Trả skeleton rỗng cho FE prefill
      return res.json({
        ID_Employer: "",
        Company_Name: "",
        Company_Address: "",
        Company_Email: defaultEmail,
        Company_Desciption: "", // NOTE: theo tên cột hiện có của em (sai chính tả)
        Company_Website: "",
        Company_Phone: "",
        Founded_Date: "",
        Company_Logo: "",
      });
    }

    const r = rows[0];
    res.json({
      ID_Employer: r.ID_Employer,
      Company_Name: r.Company_Name || "",
      Company_Address: r.Company_Address || "",
      Company_Email: r.Company_Email || defaultEmail,
      Company_Desciption: r.Company_Desciption || "", // NOTE
      Company_Website: r.Company_Website || "",
      Company_Phone: r.Company_Phone || "",
      Founded_Date: r.Founded_Date ? String(r.Founded_Date).slice(0, 10) : "",
      Company_Logo: r.Company_Logo || "",
    });
  } catch (err) {
    console.error("[GET EMPLOYER ERROR]", err);
    if (err?.code === "ER_DUP_ENTRY")
      return res.status(400).json({ message: "Email/Website đã tồn tại." });
    if (err?.code === "ER_BAD_FIELD_ERROR")
      return res
        .status(400)
        .json({ message: "Sai tên cột hoặc field gửi lên." });
    if (err?.code === "ER_TRUNCATED_WRONG_VALUE_FOR_FIELD")
      return res
        .status(400)
        .json({ message: "Định dạng dữ liệu không hợp lệ (có thể là ngày)." });
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

/* ===========================================
 * POST /api/employer/me  (multipart/form-data; file field: 'logo')
 * - Upsert: nếu chưa có bản ghi thì tạo, có rồi thì cập nhật
 * - Chấp nhận cả tên field FE cũ/lệch để tránh nổ (name/phone/location/describe…)
 * =========================================== */
export const upsertMyEmployer = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const b = req.body || {};

    // Map linh hoạt: nhận cả tên “chuẩn” theo DB và tên FE cũ nếu có
    const Company_Name = b.Company_Name ?? b.name ?? null;
    const Company_Phone = b.Company_Phone ?? b.phone ?? null;
    const Company_Address = b.Company_Address ?? b.location ?? null;
    const Company_Email = b.Company_Email ?? b.email ?? null;
    const Company_Website = b.Company_Website ?? b.website ?? null;
    // NOTE: DB của em hiện đang dùng cột viết sai chính tả "Company_Desciption"
    const Company_Desciption =
      b.Company_Desciption ?? b.Company_Description ?? b.describe ?? null;

    // Chuẩn hoá ngày để tránh "Tue Sep 02" gây ER_TRUNCATED...
    const Founded_Date = normalizeDate(b.Founded_Date ?? b.foundedDate ?? null);

    // Logo: ưu tiên file upload; nếu không upload thì giữ Company_Logo hiện có (nếu FE gửi lại)
    const logoPath = req.file
      ? `/uploads/${req.file.filename}`
      : b.Company_Logo ?? null;

    // Đảm bảo có bản ghi để UPDATE (ID_User phải là UNIQUE/PRIMARY trong bảng Employer)
    await db.query(
      "INSERT INTO Employer (ID_User) VALUES (?) ON DUPLICATE KEY UPDATE ID_User=VALUES(ID_User)",
      [userId]
    );

    // Cập nhật
    await db.query(
      `UPDATE Employer SET
        Company_Name=?,
        Company_Address=?,
        Company_Email=?,
        Company_Desciption=?,  -- giữ nguyên chính tả đang có trong DB của em
        Company_Website=?,
        Company_Phone=?,
        Founded_Date=?,
        Company_Logo=IFNULL(?, Company_Logo)
       WHERE ID_User=?`,
      [
        Company_Name,
        Company_Address,
        Company_Email,
        Company_Desciption,
        Company_Website,
        Company_Phone,
        Founded_Date,
        logoPath,
        userId,
      ]
    );

    // Trả lại bản ghi sau cập nhật
    const [after] = await db.query("SELECT * FROM Employer WHERE ID_User=?", [
      userId,
    ]);
    return res.json(after?.[0] || {});
  } catch (err) {
    console.error("[UPSERT EMPLOYER ERROR]", err);
    if (err?.code === "ER_DUP_ENTRY")
      return res.status(400).json({ message: "Email/Website đã tồn tại." });
    if (err?.code === "ER_BAD_FIELD_ERROR")
      return res
        .status(400)
        .json({ message: "Sai tên cột hoặc field gửi lên." });
    if (err?.code === "ER_TRUNCATED_WRONG_VALUE_FOR_FIELD")
      return res
        .status(400)
        .json({ message: "Định dạng dữ liệu không hợp lệ (có thể là ngày)." });
    return res.status(500).json({ message: "Server error" });
  }
};
