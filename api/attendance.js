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
        // ✅ 使用 @vercel/postgres 的推荐方式
        const sql = neon(process.env.DATABASE_URL);

        // GET：查询
        if (req.method === 'GET') {
            const { date, team } = req.query;
            
            let query = 'SELECT * FROM attendance';
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
                query += ' WHERE ' + conditions.join(' AND ');
            }
            query += ' ORDER BY id DESC';
            
            const result = await sql(query, params);
            
            const rows = result.map(r => ({
                Date: r.date,
                Team: r.team,
                WorkerType: r.worker_type,
                Total: r.total,
                Present: r.present,
                Absent: r.absent,
                Foreign: r.foreign_count || 0,
                Chinese: r.chinese || 0,
                ChinesePresent: r.chinese_present || 0,
                ForeignExpected: r.foreign_expected || 0,
                ForeignPresent: r.foreign_present || 0,
                ChineseExpected: r.chinese_expected || 0,
                Remark: r.remark || '',
                ReportedBy: r.reported_by || ''
            }));
            
            return res.status(200).json(rows);
        }

        // POST：保存
        if (req.method === 'POST') {
            const body = req.body;
            
            if (!body.Date || !body.Team || !body.WorkerType) {
                return res.status(400).json({ 
                    error: '缺少必填字段: Date, Team, WorkerType' 
                });
            }
            
            // 删除旧记录
            await sql(
                'DELETE FROM attendance WHERE date = $1 AND team = $2 AND worker_type = $3',
                [body.Date, body.Team, body.WorkerType]
            );
            
            // 插入新记录
            const result = await sql(
                `INSERT INTO attendance (
                    date, team, worker_type, 
                    total, present, absent, 
                    foreign_count, foreign_expected, foreign_present,
                    chinese, chinese_expected, chinese_present,
                    remark, reported_by
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
                RETURNING id`,
                [
                    body.Date,
                    body.Team,
                    body.WorkerType,
                    body.Total || 0,
                    body.Present || 0,
                    body.Absent || 0,
                    body.Foreign || 0,
                    body.ForeignExpected || 0,
                    body.ForeignPresent || 0,
                    body.Chinese || 0,
                    body.ChineseExpected || 0,
                    body.ChinesePresent || 0,
                    body.Remark || '',
                    body.ReportedBy || 'unknown'
                ]
            );
            
            return res.status(200).json({ 
                success: true, 
                id: result[0].id 
            });
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (err) {
        console.error('❌ API Error:', err);
        return res.status(500).json({ 
            error: err.message,
            stack: err.stack
        });
    }
}
