// api/reports.js
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
            const { date } = req.query;
            let query = 'SELECT * FROM reports ORDER BY id DESC';
            let params = [];
            
            if (date) {
                query = 'SELECT * FROM reports WHERE date = $1 ORDER BY id DESC';
                params = [date];
            }
            
            const result = await neon(query, params);
            // 转换成前端期望的字段名
            const rows = result.rows.map(r => ({
                Date: r.date,
                Area: r.area,
                Team: r.team,
                Tag: r.tag,
                Code: r.code,
                Category: r.category,
                Description: r.description,
                Unit: r.unit,
                Qty: r.qty,
                PipeLength: r.pipe_length,
                Manpower: r.manpower,
                Manhours: r.manhours,
                Foreign: r.foreign_count,
                Remark: r.remark,
                CreatedBy: r.created_by
            }));
            return res.status(200).json(rows);
        }

        if (req.method === 'POST') {
            const body = req.body;
            
            const result = await neon(
                `INSERT INTO reports (date, area, team, tag, code, category, description, unit, qty, pipe_length, manpower, manhours, foreign_count, remark, created_by, created_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW())
                 RETURNING id`,
                [
                    body.Date, 
                    body.Area, 
                    body.Team, 
                    body.Tag || 'N/A', 
                    body.Code || '', 
                    body.Category || '', 
                    body.Description || '', 
                    body.Unit || '', 
                    body.Qty || 0, 
                    body.PipeLength || 0, 
                    body.Manpower || 0, 
                    body.Manhours || 0, 
                    body.Foreign || 0, 
                    body.Remark || '', 
                    body.CreatedBy || 'unknown'
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
