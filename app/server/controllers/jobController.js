// server/controllers/jobController.js
import db from "../configs/db.config.js";

/** Lấy userId từ middleware requireAuth (gán vào req.user) */
function getUserId(req) {
  return req.user?.id || req.user?.ID_User || null;
}

/** Chuẩn hoá YYYY-MM-DD */
function normalizeDate(d) {
  if (!d) return null;
  if (typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  const dt = new Date(d);
  if (isNaN(dt)) return null;
  return dt.toISOString().slice(0, 10);
}

/** POST /api/jobs  (body: Name_Job, ID_Category, Start_Date, End_Date, Experience, Job_Location, Salary, Job_Description, Job_Status) */
export const createJob = async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const {
      Name_Job,
      ID_Category,
      Start_Date,
      End_Date,
      Experience = "",
      Job_Location = "",
      Salary = null,
      Job_Description = "",
      Job_Status = "opened",
    } = req.body || {};

    // Validate cơ bản bám schema
    const start = normalizeDate(Start_Date);
    const end = normalizeDate(End_Date);
    const errors = {};

    if (!Name_Job?.trim()) errors.Name_Job = "Thiếu Name_Job";
    if (!ID_Category?.trim()) errors.ID_Category = "Thiếu ID_Category";
    if (!start) errors.Start_Date = "Thiếu/invalid Start_Date (YYYY-MM-DD)";
    if (!end) errors.End_Date = "Thiếu/invalid End_Date (YYYY-MM-DD)";
    if (start && end && new Date(start) > new Date(end)) {
      errors.End_Date = "End_Date phải >= Start_Date";
    }
    if (Salary !== null && Salary !== "" && isNaN(Number(Salary))) {
      errors.Salary = "Salary phải là số (DECIMAL)";
    }
    if (!["opened", "closed"].includes(Job_Status)) {
      errors.Job_Status = "Job_Status phải 'opened' hoặc 'closed'";
    }
    if (Object.keys(errors).length) {
      return res.status(400).json({ message: "Invalid payload", errors });
    }

    const catId = ID_Category.toString().padStart(6, "0");
    // Lấy ID_Employer từ user (map Users -> Employer)
    const [empRows] = await db.query(
      "SELECT ID_Employer FROM Employer WHERE ID_User = ?",
      [userId]
    );
    if (!empRows.length) {
      return res.status(403).json({ message: "User chưa có Employer profile" });
    }
    const { ID_Employer } = empRows[0];

    // Kiểm tra Category tồn tại
    const [catRows] = await db.query(
      "SELECT 1 FROM Category WHERE ID_Category = ?",
      [catId]
    );
    if (!catRows.length) {
      return res.status(400).json({
        message: "ID_Category không tồn tại",
        received: ID_Category,
        normalized: catId,
      });
    }


    // Insert Job
    const sql = `INSERT INTO Job
       (ID_Employer, Name_Job, Job_Description, Job_Location, Experience,
        Salary, ID_Category, Start_Date, End_Date, Job_Status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const params = [
      ID_Employer,
      Name_Job.trim(),
      (Job_Description || "").trim(),
      (Job_Location || "").trim(),
      (Experience || "").trim(),
      Salary === null || Salary === "" ? null : Number(Salary),
      catId,
      start,
      end,
      Job_Status,
    ];

    await db.query(sql, params);

    // Lấy ID_Job vừa tạo (dựa vào trigger sinh mã — đơn giản cho bài tập)
    const [lastRow] = await db.query(
      "SELECT ID_Job FROM Job ORDER BY CAST(ID_Job AS UNSIGNED) DESC LIMIT 1"
    );
    const insertedId = lastRow?.[0]?.ID_Job || null;

    return res.status(201).json({
      message: "Tạo job thành công",
      Job: {
        ID_Job: insertedId,
        ID_Employer,
        Name_Job,
        Job_Description,
        Job_Location,
        Experience,
        Salary: Salary === null || Salary === "" ? null : Number(Salary),
        ID_Category,
        Start_Date: start,
        End_Date: end,
        Job_Status,
      },
    });
  } catch (err) {
    console.error("createJob error:", err);
    return res.status(500).json({ message: err.message });
  }
};

export const updateJob = async (req, res) => {
  const userId = req.user?.id || req.user?.ID_User || null;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { id } = req.params; // ID_Job (varchar(6))
  if (!id) return res.status(400).json({ message: "Missing job id" });

  try {
    // Tìm employer tương ứng user
    const [empRows] = await db.query(
      "SELECT ID_Employer FROM Employer WHERE ID_User = ?",
      [userId]
    );
    if (!empRows.length) {
      return res.status(403).json({ message: "User chưa có Employer profile" });
    }
    const { ID_Employer } = empRows[0];

    // Kiểm tra job có thuộc employer này không
    const [jobRows] = await db.query(
      "SELECT * FROM Job WHERE ID_Job = ? AND ID_Employer = ?",
      [id, ID_Employer]
    );
    if (!jobRows.length) {
      return res
        .status(404)
        .json({ message: "Job không tồn tại hoặc không thuộc quyền của bạn" });
    }

    // Lấy dữ liệu cần update
    const {
      Name_Job,
      ID_Category,
      Start_Date,
      End_Date,
      Experience,
      Job_Location,
      Salary,
      Job_Description,
      Job_Status,
    } = req.body || {};

    // Validate nhanh (có thể nới lỏng, nhưng giữ đúng schema)
    const start = Start_Date ? normalizeDate(Start_Date) : null;
    const end = End_Date ? normalizeDate(End_Date) : null;
    const errors = {};
    if (Start_Date && !start) errors.Start_Date = "Start_Date không hợp lệ";
    if (End_Date && !end) errors.End_Date = "End_Date không hợp lệ";
    if (start && end && new Date(start) > new Date(end)) {
      errors.End_Date = "End_Date phải >= Start_Date";
    }
    if (
      Salary !== undefined &&
      Salary !== null &&
      Salary !== "" &&
      isNaN(Number(Salary))
    ) {
      errors.Salary = "Salary phải là số";
    }
    if (Job_Status && !["opened", "closed"].includes(Job_Status)) {
      errors.Job_Status = "Job_Status phải 'opened' | 'closed'";
    }
    if (Object.keys(errors).length) {
      return res.status(400).json({ message: "Invalid payload", errors });
    }

    // Build SET động
    const sets = [];
    const params = [];

    if (Name_Job !== undefined) {
      sets.push("Name_Job = ?");
      params.push(Name_Job?.trim() || "");
    }
    if (Job_Description !== undefined) {
      sets.push("Job_Description = ?");
      params.push(Job_Description?.trim() || "");
    }
    if (Job_Location !== undefined) {
      sets.push("Job_Location = ?");
      params.push(Job_Location?.trim() || "");
    }
    if (Experience !== undefined) {
      sets.push("Experience = ?");
      params.push(Experience?.trim() || "");
    }
    if (Salary !== undefined) {
      sets.push("Salary = ?");
      params.push(Salary === "" || Salary === null ? null : Number(Salary));
    }
    if (ID_Category !== undefined) {
      sets.push("ID_Category = ?");
      params.push(ID_Category ? ID_Category.toString().padStart(6, "0") : null);
    }
    if (Start_Date !== undefined) {
      sets.push("Start_Date = ?");
      params.push(start);
    }
    if (End_Date !== undefined) {
      sets.push("End_Date = ?");
      params.push(end);
    }
    if (Job_Status !== undefined) {
      sets.push("Job_Status = ?");
      params.push(Job_Status);
    }

    if (!sets.length) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const sql = `UPDATE Job SET ${sets.join(
      ", "
    )} WHERE ID_Job = ? AND ID_Employer = ?`;
    params.push(id, ID_Employer);
    await db.query(sql, params);

    // Lấy lại bản ghi đã update để trả về
    const [updatedRows] = await db.query(
      `SELECT ID_Job, ID_Employer, Name_Job, Job_Description, Job_Location,
              Experience, Salary, ID_Category, Start_Date, End_Date, Job_Status
         FROM Job WHERE ID_Job = ?`,
      [id]
    );

    return res.json({
      message: "Cập nhật job thành công",
      Job: updatedRows[0],
    });
  } catch (err) {
    console.error("updateJob error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


export const listMyJobs = async (req, res) => {
  const userId = req.user?.id || req.user?.ID_User || null;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const [empRows] = await db.query(
      "SELECT ID_Employer FROM Employer WHERE ID_User = ?",
      [userId]
    );
    if (!empRows.length) {
      return res.status(200).json({ jobs: [] });
    }
    const { ID_Employer } = empRows[0];

    const [rows] = await db.query(
      `SELECT ID_Job, ID_Employer, Name_Job, Job_Description, Job_Location,
              Experience, Salary, ID_Category, Start_Date, End_Date, Job_Status
         FROM Job
        WHERE ID_Employer = ?
        ORDER BY CAST(ID_Job AS UNSIGNED) DESC`,
      [ID_Employer]
    );

    res.json({ jobs: rows });
  } catch (err) {
    console.error("listMyJobs error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const listAllJobs = async (req, res) => {
  try {
    const {
      q = "",
      location = "",
      categoryId = "",
      experience = "",
      salaryMin,
      salaryMax,
      status = "opened",
      page = 1,
      limit = 30,
    } = req.query;

    const where = [];
    const params = [];

    if (status) {
      where.push("j.Job_Status = ?");
      params.push(status);
    }
    if (q) {
      where.push("(j.Name_Job LIKE ? OR e.Company_Name LIKE ?)");
      params.push(`%${q}%`, `%${q}%`);
    }
    if (location) {
      where.push("j.Job_Location LIKE ?");
      params.push(`%${location}%`);
    }
    if (categoryId) {
      where.push("j.ID_Category = ?");
      params.push(categoryId.toString().padStart(6, "0"));
    }
    if (experience) {
      where.push("j.Experience LIKE ?");
      params.push(`%${experience}%`);
    }
    if (salaryMin) {
      where.push("(j.Salary IS NOT NULL AND j.Salary >= ?)");
      params.push(Number(salaryMin));
    }
    if (salaryMax) {
      where.push("(j.Salary IS NOT NULL AND j.Salary <= ?)");
      params.push(Number(salaryMax));
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const off = Math.max(0, (Number(page) - 1) * Number(limit));
    const lim = Math.max(1, Math.min(Number(limit), 100));

    const sql = `
      SELECT
        j.ID_Job, j.Name_Job, j.Job_Description, j.Job_Location, j.Experience,
        j.Salary, j.ID_Category, j.Start_Date, j.End_Date, j.Job_Status,
        c.Name_Category,
        e.Company_Name, e.Company_Logo        -- 👈 THÊM CỘT NÀY
      FROM Job j
      JOIN Category c ON c.ID_Category = j.ID_Category
      JOIN Employer e  ON e.ID_Employer = j.ID_Employer
      ${whereSql}
      ORDER BY CAST(j.ID_Job AS UNSIGNED) DESC
      LIMIT ? OFFSET ?`;

    const [rows] = await db.query(sql, [...params, lim, off]);

    // Chuẩn hoá đường dẫn logo: tên file -> /uploads/tên; \ -> /
    const normalized = rows.map((r) => {
      let logo = r.Company_Logo || null;
      if (logo) {
        logo = logo.replace(/\\/g, "/");
        if (!/^https?:\/\//i.test(logo)) {
          logo = logo.startsWith("/") ? logo : `/uploads/${logo}`;
        }
      }
      return { ...r, Company_Logo: logo };
    });

    res.json({ jobs: normalized });
  } catch (err) {
    console.error("listAllJobs error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// LẤY CHI TIẾT 1 JOB THEO ID
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params; // ID_Job (varchar(6))
    if (!id) return res.status(400).json({ message: "Missing job id" });

    const sql = `
      SELECT
        j.ID_Job, j.Name_Job, j.Job_Description, j.Job_Location, j.Experience,
        j.Salary, j.ID_Category, j.Start_Date, j.End_Date, j.Job_Status,j.ID_Employer,
        c.Name_Category,
        e.Company_Name, e.Company_Logo
      FROM Job j
      JOIN Category c ON c.ID_Category = j.ID_Category
      JOIN Employer e  ON e.ID_Employer = j.ID_Employer
      WHERE j.ID_Job = ?
      LIMIT 1
    `;
    const [rows] = await db.query(sql, [id]);
    if (!rows.length) return res.status(404).json({ message: "Job not found" });

    // Chuẩn hoá đường dẫn logo
    const r = rows[0];
    let logo = r.Company_Logo || null;
    if (logo) {
      logo = logo.replace(/\\/g, "/");
      if (!/^https?:\/\//i.test(logo)) {
        logo = logo.startsWith("/") ? logo : `/uploads/${logo}`;
      }
    }
    return res.json({ job: { ...r, Company_Logo: logo } });
  } catch (err) {
    console.error("getJobById error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};