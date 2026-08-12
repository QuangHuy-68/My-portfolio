const sql = require('../db/neon');

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed'
        });
    }

    try {
        const projects = await sql`
            SELECT *
            FROM projects
            ORDER BY created_at DESC
        `;

        return res.status(200).json({
            success: true,
            source: 'projects-api-v1',
            data: projects
        });

    } catch (error) {
        console.error('Projects API error:', error);

        return res.status(500).json({
            success: false,
            error: 'Failed to fetch projects'
        });
    }
};