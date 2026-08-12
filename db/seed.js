const db = require('./database');

const insertProject = db.prepare(`
    INSERT INTO projects
    (title, description, tech_stack, github_url, demo_url, image_url)
    VALUES (?, ?, ?, ?, ?, ?)
`);

insertProject.run(
    'Portfolio Website',
    'My personal developer portfolio.',
    'HTML, CSS, JavaScript, Node.js',
    'https://github.com/QuangHuy-68/My-portfolio',
    'https://my-portfolio-wuanintheair.vercel.app',
    ''
);

insertProject.run(
    'Parking Management System',
    'A desktop application for managing parking spaces.',
    'Java, JavaFX, MySQL',
    'https://github.com/QuangHuy-68',
    '',
    ''
);

console.log('✅ Sample projects inserted');