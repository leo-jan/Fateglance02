// api/reports.js
// ✅ 添加 try-catch 包裹整个导入过程
let neon;
try {
    neon = require('@neondatabase/serverless').neon;
} catch (error) {
    console.error('❌ 无法加载 @neondatabase/serverless:', error.message);
}

export default async function handler(req, res) {
    // 设置 CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // ✅ 检查 neon 是否加载成功
    if (!neon) {
        console.error('❌ neon 未加载');
        return res.status(500).json({ 
            error: 'Database driver not loaded',
            details: 'Please check if @neondatabase/serverless is installed'
        });
    }

    // ✅ 检查 DATABASE_URL
    if (!process.env.DATABASE_URL) {
        console.error('❌ DATABASE_URL 未设置');
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
            query += ' ORDER BY id DESC LIMIT 500';
            
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
                VALUES (${Date}, ${Area}, ${Team}, ${Tag || 'N/A'}, ${Code || ''}, ${Category || ''}, 
                        ${Description || ''}, ${Unit || ''}, ${Qty || 0}, ${PipeLength || 0}, 
                        ${Manpower || 0}, ${Manhours || 0}, ${Foreign || 0}, ${Remark || ''}, 
                        ${CreatedBy || 'unknown'})
                RETURNING *
            `;
            return res.status(201).json(result[0]);
        }

        if (req.method === 'DELETE') {
            const { id } = req.query;
            if (id) {
                await sql`DELETE FROM daily_reports WHERE id = ${id}`;
                return res.status(200).json({ success: true });
            }
            return res.status(400).json({ error: 'Missing id parameter' });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('❌ API 错误:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}
