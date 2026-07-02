// api/reports.js
import { neon } from '@vercel/postgres';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const sql = neon(process.env.POSTGRES_URL);

    try {
        if (req.method === 'GET') {
            const { date } = req.query;
            let query = 'SELECT * FROM reports';
            const params = [];
            if (date) {
                query += ' WHERE date = $1 ORDER BY id DESC';
                params.push(date);
            } else {
                query += ' ORDER BY id DESC';
            }
            const result = await sql(query, params);
            return res.status(200).json(result);
        }

        if (req.method === 'POST') {
            const body = req.body;
            const result = await sql(
                `INSERT INTO reports (date, area, team, tag, code, category, description, unit, qty, pipe_length, manpower, manhours, foreign_count, remark, created_by)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
                 RETURNING id`,
                [
                    body.Date, body.Area, body.Team,
                    body.Tag || 'N/A', body.Code || '', body.Category || '',
                    body.Description || '', body.Unit || '',
                    body.Qty || 0, body.PipeLength || 0,
                    body.Manpower || 0, body.Manhours || 0,
                    body.Foreign || 0, body.Remark || '',
                    body.CreatedBy || 'unknown'
                ]
            );
            return res.status(200).json({ success: true, id: result[0].id });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (err) {
        console.error('❌ API 错误:', err);
        return res.status(500).json({ error: err.message });
    }
}
