// api/area-distribution.js
const { neon } = require('@neondatabase/serverless');

export default async function handler(req, res) {
    // 设置 CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const sql = neon(process.env.DATABASE_URL);

    try {
        if (req.method === 'GET') {
            const { date, team } = req.query;
            let query = 'SELECT * FROM area_distribution';
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
            query += ' ORDER BY id';

            console.log('查询区域出勤:', query, params); // 调试日志
            const result = await sql(query, params);
            return res.status(200).json(result);
        }

        if (req.method === 'POST') {
            const { date, team, worker_type, area, count, created_by } = req.body;
            console.log('保存区域出勤:', { date, team, worker_type, area, count, created_by }); // 调试日志
            
            const result = await sql`
                INSERT INTO area_distribution 
                (date, team, worker_type, area, count, created_by)
                VALUES (${date}, ${team}, ${worker_type}, ${area}, ${count}, ${created_by})
                RETURNING *
            `;
            return res.status(201).json(result[0]);
        }

        if (req.method === 'DELETE') {
            const { date, team } = req.query;
            if (date && team) {
                await sql`DELETE FROM area_distribution WHERE date = ${date} AND team = ${team}`;
            } else {
                return res.status(400).json({ error: 'Missing date or team parameter' });
            }
            return res.status(200).json({ success: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
