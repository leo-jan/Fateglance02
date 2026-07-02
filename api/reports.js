// api/reports.js
const { neon } = require('@neondatabase/serverless');

export default async function handler(req, res) {
    // 设置 CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // ✅ 检查环境变量
    if (!process.env.DATABASE_URL) {
        console.error('❌ DATABASE_URL 环境变量未设置');
        return res.status(500).json({ 
            error: 'Database not configured',
            details: 'DATABASE_URL environment variable is missing'
        });
    }

    try {
        const sql = neon(process.env.DATABASE_URL);
        
        if (req.method === 'GET') {
            const { date } = req.query;
            let query = 'SELECT * FROM daily_reports';
            const params = [];
            
            if (date) {
                query += ' WHERE date = $1';
                params.push(date);
            }
            query += ' ORDER BY id DESC';
            
            console.log('📊 执行查询:', query, params);
            const result = await sql(query, params);
            return res.status(200).json(result);
        }

        if (req.method === 'POST') {
            const { 
                Date, Area, Team, Tag, Code, Category, 
                Description, Unit, Qty, PipeLength, Manpower, 
                Manhours, Foreign, Remark, CreatedBy 
            } = req.body;

            const result = await sql`
                INSERT INTO daily_reports 
                (date, area, team, tag_number, code, sub_item, description, unit, 
                 qty, pipe_length, manpower, manhours, non_chinese, remark, created_by)
                VALUES (${Date}, ${Area}, ${Team}, ${Tag}, ${Code}, ${Category}, 
                        ${Description}, ${Unit}, ${Qty}, ${PipeLength}, ${Manpower}, 
                        ${Manhours}, ${Foreign}, ${Remark}, ${CreatedBy})
                RETURNING *
            `;
            return res.status(201).json(result[0]);
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
