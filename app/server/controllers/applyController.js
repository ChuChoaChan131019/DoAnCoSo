import db from "../configs/db.config.js";

function getUserId(req) {
    return req.user?.id || req.user?.ID_User || null;
}

export const applyForJob = async (req, res) => {
    const userId = getUserId(req);
    const { jobId } = req.params;

    if (!userId || req.user.role !== "candidate") {
        return res.status(403).json({ message: "Chỉ ứng viên đã đăng nhập mới được ứng tuyển" });
    }

    if (!jobId) {
        return res.status(400).json({ message: "Thiếu ID công việc" });
    }

    try {
        const [candidateRows] = await db.query(
            "SELECT ID_Candidate, Resume_URL FROM Candidate WHERE ID_User = ?",
            [userId]
        );
        if (!candidateRows.length) {
            return res.status(400).json({ message: "Ứng viên chưa có hồ sơ cá nhân" });
        }
        const { ID_Candidate, Resume_URL } = candidateRows[0];
    
        if (!Resume_URL) {
            return res.status(400).json({ message: "Vui lòng upload CV/Hồ sơ trước khi ứng tuyển." });
        }

        const [jobRows] = await db.query(
            "SELECT 1 FROM Job WHERE ID_Job = ? AND Job_Status = 'opened'",
            [jobId]
        );
        if (!jobRows.length) {
            return res.status(400).json({ message: "Công việc không tồn tại hoặc đã đóng" });
        }

        const [result] = await db.query(
            `INSERT IGNORE INTO Application (ID_Candidate, ID_Job) VALUES (?, ?)`,
            [ID_Candidate, jobId]
        );
        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Bạn đã ứng tuyển công việc này rồi" });
        }

        return res.status(201).json({
            message: "Ứng tuyển thành công! Thông tin hồ sơ và CV đã được gửi."
        });
    } catch (err) {
        console.error("[APPLY JOB ERROR]", err);
        return res.status(500).json({ message: "Lỗi máy chủ khi ứng tuyển" });
    }
};

export const listMyApplications = async (req, res) => {
    const userId = req.user?.id;

    if (!userId || req.user.role !== "candidate") {
        return res.status(403).json({ message: "Chỉ ứng viên mới được truy cập" });
    }

    try {
        // Lấy ID_Candidate
        const [candidateRows] = await db.query(
            "SELECT ID_Candidate FROM Candidate WHERE ID_User = ?",
            [userId]
        );
        if (!candidateRows.length) {
            return res.json({ applications: [] });
        }
        const { ID_Candidate } = candidateRows[0];

        // Lấy danh sách ứng tuyển 
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
        
        const normalized = rows.map(r => ({
            ...r,
            Company_Logo: r.Company_Logo ? `/uploads/${r.Company_Logo.split('/').pop()}` : null,
        }));


        return res.json({ applications: normalized });

    } catch (err) {
        console.error("[LIST MY APPLICATIONS ERROR]", err);
        return res.status(500).json({ message: "Lỗi máy chủ khi lấy danh sách ứng tuyển" });
    }
}

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