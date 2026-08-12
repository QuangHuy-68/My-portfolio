const db = require('../db/neon');

module.exports = async (req, res) => {
    // 1. Fixed typo: req.method (was req.mothod)
    if (req.method !== 'GET') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed'
        });
    }

    try {
        // 2. Fixed syntax: Neon (Postgres) uses await db.query()
        const result = await db.query(`
            SELECT * 
            FROM projects
            ORDER BY created_at DESC
        `);

        return res.status(200).json({
            success: true,
            source: 'projects-api-v1',
            // 3. Fixed data access: Postgres puts the array inside result.rows
            data: result.rows
        });
    }
    catch (error) { 
        console.error('Projects API error:', error); 

        return res.status(500).json({
            success: false,
            error: 'Failed to fetch projects'
        });
    }
};