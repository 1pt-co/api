import query from "./db.js";
export const verifyTable = async(req,res,next) => {
    const tableExistsQuery = `SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = '1ptco' AND table_name = '1pt';`
    const insertTableQuery =  `CREATE TABLE \`1pt\` (\`short_url\` varchar(10) NOT NULL,\`long_url\` varchar(256) NOT NULL,\`timestamp\` date NOT NULL DEFAULT current_timestamp(), \`hits\` int(11) NOT NULL, \`ip\` varchar(32) NOT NULL, \`email\` varchar(64) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
    const exists = await query(tableExistsQuery)
    if (!exists[0]) await query(insertTableQuery)
    next()
}