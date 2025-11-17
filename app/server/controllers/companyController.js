import db from "../configs/db.config.js";

/**
  @param {object} req - Request object
  @param {object} res - Response object
 */

export const getAllCompanies = async (req, res) => {
    try {
        const { search = "" } = req.query;
        const searchTerm = `%${search}%`;

        const sql = `
                    SELECT E.ID_Employer, E.Company_Name, E.Company_Logo, E.Company_Address,
                    COUNT(J.ID_Job) AS JobCount
                    FROM Employer E
                    LEFT JOIN Job J ON E.ID_Employer = J.ID_Employer
                    WHERE LOWER(E.Company_Name) LIKE (?) OR LOWER(E.Company_Address) LIKE (?)
                    GROUP BY E.ID_Employer
                    ORDER BY E.Company_Name ASC
            `;
        
        const [rows] = await db.query(sql, [searchTerm, searchTerm]);
        return res.json(rows);
    } catch (err) {
        console.error("[GET ALL COMPANIES ERROR]", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

/**
 * Lấy chi tiết 1 công ty và danh sách job đang mở
 */
export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;

    // Lấy thông tin công ty
    const companySql = `
      SELECT E.ID_Employer, E.Company_Name, E.Company_Logo, E.Company_Address,
             E.Company_Email, E.Company_Description, E.Company_Website, 
             E.Company_Phone, E.Founded_Date
      FROM Employer E
      WHERE E.ID_Employer = ?
    `;
    const [companyRows] = await db.query(companySql, [id]);

    if (companyRows.length === 0) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Lấy danh sách job đang mở
    const jobSql = `
      SELECT ID_Job, Name_Job, Job_Location, Salary, End_Date, Job_Status
      FROM Job
      WHERE ID_Employer = ? AND Job_Status = 'opened'
      ORDER BY End_Date ASC
    `;
    const [jobRows] = await db.query(jobSql, [id]);

    return res.json({ company: companyRows[0], jobs: jobRows });
  } catch (err) {
    console.error("[GET COMPANY BY ID ERROR]", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};