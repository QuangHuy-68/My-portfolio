const db = require ('../db/database');

module.exports = async (req, res) => {

    if (req.mothod !== 'GET') {
        return res.status(405).json({
            success:false,
            error: 'Method not allowed'
        });
    }

    try {
        const projects = db 
            .prepare(`
                SELECT * 
                FROM projects
                ORDER BY created_at DESC
                `
            )
            .all();

        return res.status(200).json({
            success: true,
            data: projects
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