import fs from "fs/promises";// fs là module có sắn trong Node.js đề làm viêcj với hệ thông tệp(dọc, ghi, xóa, sửa)
import path from "path";
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
        Company_Description: "", // NOTE: theo tên cột hiện có của em (sai chính tả)
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
      Company_Description: r.Company_Description || "", // NOTE
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
    return res.status(500).json({ message: err.message });
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

    // Map linh hoạt (bắt tất cả biến thể, kể cả sai chính tả)
    const Company_Name = b.Company_Name ?? b.name ?? null;
    const Company_Phone = b.Company_Phone ?? b.phone ?? null;
    const Company_Address = b.Company_Address ?? b.location ?? null;
    const Company_Email = b.Company_Email ?? b.email ?? null;
    const Company_Website = b.Company_Website ?? b.website ?? null;
    const Company_Description =
      b.Company_Description ?? // đúng
      b.Company_Desciption ?? // SAI chính tả – FE của em đang gửi cái này
      b.describe ??
      b.description ??
      b.desc ??
      null;

    const Founded_Date = normalizeDate(
      b.Founded_Date ?? b.foundedDate ?? b.founded_date ?? null
    );

    const logoPath = req.file
      ? `/uploads/${req.file.filename}`
      : b.Company_Logo ?? null;

    // Upsert dùng alias, prefix rõ ràng tránh "ambiguous"
    const sql = `
  INSERT INTO Employer (
    ID_User, Company_Name, Company_Address, Company_Email,
    Company_Description, Company_Website, Company_Phone,
    Founded_Date, Company_Logo
  ) VALUES (?,?,?,?,?,?,?,?,?)
  AS ins
  ON DUPLICATE KEY UPDATE
    Company_Name        = ins.Company_Name,
    Company_Address     = ins.Company_Address,
    Company_Email       = ins.Company_Email,
    Company_Description = ins.Company_Description,
    Company_Website     = ins.Company_Website,
    Company_Phone       = ins.Company_Phone,
    Founded_Date        = ins.Founded_Date,
    Company_Logo        = COALESCE(ins.Company_Logo, Employer.Company_Logo)
`;

    await db.query(sql, [
      userId,
      Company_Name,
      Company_Address,
      Company_Email,
      Company_Description,
      Company_Website,
      Company_Phone,
      Founded_Date,
      logoPath,
    ]);

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
    return res.status(500).json({ message: err.message });
  }
};