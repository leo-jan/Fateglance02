// api/attendance.js
import { neon } from '@vercel/postgres';

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 获取数据库连接
    const sql = neon(process.env.POSTGRES_URL);

    try {
        // ===== GET =====
        if (req.method === 'GET') {
            const { date, team } = req.query;
            
            let query = 'SELECT * FROM attendance';
            const params = [];
            
            if (date && team) {
                query += ' WHERE date = $1 AND team = $2 ORDER BY id DESC';
                params.push(date, team);
            } else if (date) {
                query += ' WHERE date = $1 ORDER BY id DESC';
                params.push(date);
            } else {
                query += ' ORDER BY id DESC';
            }
            
            const result = await sql(query, params);
            
            // 直接返回数据库字段（前端已经适配）
            return res.status(200).json(result);
        }

        // ===== POST =====
        if (req.method === 'POST') {
            const body = req.body;
            
            // 必填字段验证
            if (!body.Date || !body.Team || !body.WorkerType) {
                return res.status(400).json({ error: '缺少必填字段' });
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
                    body.Foreign || body.ForeignExpected || 0,
                    body.ForeignExpected || body.Foreign || 0,
                    body.ForeignPresent || body.Foreign || 0,
                    body.Chinese || body.ChineseExpected || 0,
                    body.ChineseExpected || body.Chinese || 0,
                    body.ChinesePresent || body.Chinese || 0,
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
        console.error('❌ API 错误:', err);
        return res.status(500).json({ 
            error: err.message,
            stack: err.stack 
        });
    }
}
