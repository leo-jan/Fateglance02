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
            const { date, team } = req.query;
            const data = await redis.get('attendance');
            const records = data ? JSON.parse(data) : [];
            let filtered = records;
            if (date) filtered = filtered.filter(r => r.Date === date);
            if (team) filtered = filtered.filter(r => r.Team === team);
            return res.status(200).json(filtered);
        }

        if (req.method === 'POST') {
            const newRecord = req.body;
            const data = await redis.get('attendance');
            const records = data ? JSON.parse(data) : [];
            const filtered = records.filter(r =>
                !(r.Date === newRecord.Date && r.Team === newRecord.Team && r.WorkerType === newRecord.WorkerType)
            );
            newRecord.id = Date.now();
            newRecord.createdAt = new Date().toISOString();
            filtered.push(newRecord);
            await redis.set('attendance', JSON.stringify(filtered));
            return res.status(200).json({ success: true, id: newRecord.id });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
