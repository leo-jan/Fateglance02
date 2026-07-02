// api/reports.js
import { createClient } from 'redis';

const getRedisClient = () => {
    const url = process.env.KV_URL || process.env.REDIS_URL;
    if (!url) {
        throw new Error('Redis URL not configured');
    }
    return createClient({ url });
};

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    let redis = null;

    try {
        redis = getRedisClient();
        await redis.connect();
    } catch (err) {
        return res.status(500).json({ 
            error: 'Redis 连接失败', 
            details: err.message 
        });
    }

    try {
        if (req.method === 'GET') {
            const { date } = req.query;
            const data = await redis.get('reports');
            const all = data ? JSON.parse(data) : [];
            const filtered = date ? all.filter(r => r.Date === date) : all;
            await redis.disconnect();
            return res.status(200).json(filtered);
        }

        if (req.method === 'POST') {
            const newReport = req.body;
            const data = await redis.get('reports');
            const all = data ? JSON.parse(data) : [];
            newReport.id = Date.now();
            newReport.created_at = new Date().toISOString();
            all.push(newReport);
            await redis.set('reports', JSON.stringify(all));
            await redis.disconnect();
            return res.status(200).json({ success: true, id: newReport.id });
        }

        await redis.disconnect();
        return res.status(405).json({ error: 'Method not allowed' });

    } catch (err) {
        if (redis) await redis.disconnect().catch(() => {});
        return res.status(500).json({ error: err.message });
    }
}
