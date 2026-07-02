// api/attendance.js
let neon;
try {
    neon = require('@neondatabase/serverless').neon;
} catch (error) {
    console.error('❌ 无法加载 @neondatabase/serverless:', error.message);
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (!neon) {
        return res.status(500).json({ 
            error: 'Database driver not loaded',
            details: 'Please check if @neondatabase/serverless is installed'
        });
    }

    if (!process.env.DATABASE_URL) {
        return res.status(500).json({ 
            error: 'Database not configured',
            details: 'DATABASE_URL environment variable is missing'
        });
    }

    try {
        const sql = neon(process.env.DATABASE_URL);

        if (req.method === 'GET') {
            const { date, team } = req.query;
            let query = 'SELECT * FROM attendance';
            const conditions = [];
            const params = [];
            let paramIndex = 1;

            if (date) {
                conditions.push(`date = $${paramIndex}`);
                params.push(date);
                paramIndex++;
            }
            if (team) {
                conditions.push(`team = $${paramIndex}`);
                params.push(team);
                paramIndex++;
            }

            if (conditions.length > 0) {
                query += ' WHERE ' + conditions.join(' AND ');
            }
            query += ' ORDER BY id DESC';

            const result = await sql(query, params);
            return res.status(200).json(result);
        }

        if (req.method === 'POST') {
            const { 
                Date, Team, WorkerType, Total, Present, 
                Absent, ForeignExpected, Remark, ReportedBy 
            } = req.body;

            const result = await sql`
                INSERT INTO attendance 
                (date, team, worker_type, total, present, absent, foreign_count, remark, reported_by)
                VALUES (${Date}, ${Team}, ${WorkerType}, ${Total || 0}, ${Present || 0}, 
                        ${Absent || 0}, ${ForeignExpected || 0}, ${Remark || ''}, ${ReportedBy || 'unknown'})
                RETURNING *
            `;
            return res.status(201).json(result[0]);
        }

        if (req.method === 'DELETE') {
            const { id } = req.query;
            if (id) {
                await sql`DELETE FROM attendance WHERE id = ${id}`;
                return res.status(200).json({ success: true });
            }
            return res.status(400).json({ error: 'Missing id parameter' });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('❌ API 错误:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            details: error.message
        });
    }
}
