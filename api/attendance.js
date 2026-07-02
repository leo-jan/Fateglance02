// api/attendance.js
import { neon } from '@vercel/postgres';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        if (req.method === 'GET') {
            const { date, team } = req.query;
            let query = 'SELECT * FROM attendance ORDER BY id DESC';
            let params = [];
            let conditions = [];
            
            if (date) {
                conditions.push(`date = $${params.length + 1}`);
                params.push(date);
            }
            if (team) {
                conditions.push(`team = $${params.length + 1}`);
                params.push(team);
            }
            
            if (conditions.length > 0) {
                query = `SELECT * FROM attendance WHERE ${conditions.join(' AND ')} ORDER BY id DESC`;
            }
            
            const result = await neon(query, params);
            // 转换成前端期望的字段名
            const rows = result.rows.map(r => ({
                Date: r.date,
                Team: r.team,
                WorkerType: r.worker_type,
                Total: r.total,
                Present: r.present,
                Absent: r.absent,
                Foreign: r.foreign_count,
                Remark: r.remark,
                ReportedBy: r.reported_by
            }));
            return res.status(200).json(rows);
        }

        if (req.method === 'POST') {
            const body = req.body;
            
            // 先删除旧的（覆盖更新）
            await neon(
                'DELETE FROM attendance WHERE date = $1 AND team = $2 AND worker_type = $3',
                [body.Date, body.Team, body.WorkerType]
            );
            
            const result = await neon(
                `INSERT INTO attendance (date, team, worker_type, total, present, absent, foreign_count, remark, reported_by, created_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
                 RETURNING id`,
                [
                    body.Date, 
                    body.Team, 
                    body.WorkerType, 
                    body.Total || 0, 
                    body.Present || 0, 
                    body.Absent || 0, 
                    body.Foreign || 0, 
                    body.Remark || '', 
                    body.ReportedBy || 'unknown'
                ]
            );
            
            return res.status(200).json({ success: true, id: result.rows[0].id });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (err) {
        console.error('API Error:', err);
        return res.status(500).json({ error: err.message });
    }
}
