const sql = require('../../db/neon');

module.exports = async (req, res) => {

    if (req.method !== 'GET') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed'
        });
    }

    try {
        const { id } = req.query;
        const projectId = Number(id);

        if (!Number.isInteger(projectId) || projectId <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Invalid project id'
            });
        }

        const projects = await sql`
            SELECT *
            FROM projects
            WHERE id = ${projectId}
            LIMIT 1
        `;

        if (projects.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Project not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: projects[0]
        });

    } catch (error) {
        console.error('Project detail API error:', error);

        return res.status(500).json({
            success: false,
            error: 'Failed to fetch project'
        });
    }
};