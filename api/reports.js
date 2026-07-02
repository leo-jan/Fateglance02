import { createClient } from 'redis';

let redisClient = null;

async function getRedis() {
    if (!redisClient) {
        const url = process.env.KV_URL;
        if (!url) throw new Error('KV_URL not configured');
        redisClient = createClient({ url });
        await redisClient.connect();
    }
    return redisClient;
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const redis = await getRedis();

        if (req.method === 'GET') {
            const { date } = req.query;
            const data = await redis.get('reports');
            const reports = data ? JSON.parse(data) : [];
            if (date) {
                const filtered = reports.filter(r => r.Date === date);
                return res.status(200).json(filtered);
            }
            return res.status(200).json(reports);
        }

        if (req.method === 'POST') {
            const newReport = req.body;
            const data = await redis.get('reports');
            const reports = data ? JSON.parse(data) : [];
            newReport.id = Date.now();
            newReport.createdAt = new Date().toISOString();
            reports.push(newReport);
            await redis.set('reports', JSON.stringify(reports));
            return res.status(200).json({ success: true, id: newReport.id });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
