const db = require('./database');

const projects = db
    .prepare('SELECT * FROM projects')
    .all();

console.log(projects);