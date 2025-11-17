import fs from "fs/promises";
import path from "path";
import db from "../configs/db.config.js";

function getUserId(req) {
  return req.user?.id || req.user?.ID_User || null;
}

function normalizeDate(d) {
  if (!d) return null;
  if (typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  const dt = new Date(d);
  if (isNaN(dt)) return null;
  return dt.toISOString().slice(0, 10);
}
function safeJoinUploads(relPath) {
  if (!relPath) return null;
  const uploadsDir = path.join(process.cwd(), "uploads");
  const clean = relPath.replace(/^\/?uploads\//, "");
  const abs = path.join(uploadsDir, clean);
  if (!abs.startsWith(uploadsDir)) throw new Error("Invalid path");
  return abs;
}

/*  GET /api/employer/me*/
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
      return res.json({
        ID_Employer: "",
        Company_Name: "",
        Company_Address: "",
        Company_Email: defaultEmail,
        Company_Description: "", 
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
      Company_Description: r.Company_Description || "", 
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

/* 
 * - Upsert: nếu chưa có bản ghi thì tạo, có rồi thì cập nhật
  */
export const upsertMyEmployer = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const b = req.body || {};

    // Lấy logo cũ
    const [oldRows] = await db.query(
      "SELECT Company_Logo FROM Employer WHERE ID_User=?",
      [userId]
    );
    const oldLogo = oldRows?.[0]?.Company_Logo || null;

    const Company_Name = b.Company_Name ?? b.name ?? null;
    const Company_Phone = b.Company_Phone ?? b.phone ?? null;
    const Company_Address = b.Company_Address ?? b.location ?? null;
    const Company_Email = b.Company_Email ?? b.email ?? null;
    const Company_Website = b.Company_Website ?? b.website ?? null;
    const Company_Description =
      b.Company_Description ??
      b.Company_Desciption ??
      b.describe ??
      b.description ??
      b.desc ??
      null;

    const Founded_Date = normalizeDate(
      b.Founded_Date ?? b.foundedDate ?? b.founded_date ?? null
    );

    const newLogo = req.file ? `/uploads/${req.file.filename}` : null;
    const removeLogo = b.Remove_Logo === "1" || b.Remove_Logo === "true";

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
        Company_Logo        = CASE
                                WHEN ? = 1 THEN NULL
                                WHEN ins.Company_Logo IS NOT NULL THEN ins.Company_Logo
                                ELSE Employer.Company_Logo
                              END
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
      newLogo,
      removeLogo ? 1 : 0, 
    ]);

    try {
      if (
        (newLogo && oldLogo && newLogo !== oldLogo) ||
        (removeLogo && oldLogo)
      ) {
        const abs = safeJoinUploads(oldLogo);
        if (abs) await fs.unlink(abs);
      }
    } catch (e) {
      console.warn("[UNLINK LOGO WARN]", e.message);
    }

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
