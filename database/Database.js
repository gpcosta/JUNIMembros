const keys = require("../config/keys").getDatabaseKeys();

const mariadb = require('mysql');
const util = require('util');

const pool = mariadb.createPool({
	database: keys.database,
	host: keys.host,
	port: keys.port,
	user: keys.user,
	password: keys.password,
	connectionLimit: 10
});

// Ping database to check for common error errors.
pool.getConnection((err, connection) => {
    if (err) {
    	let error = "";
        if (err.code === 'PROTOCOL_CONNECTION_LOST')
            error = "Database connection was closed.";
        if (err.code === 'ER_CON_COUNT_ERROR')
            error = "Database has too many connections.";
        if (err.code === 'ECONNREFUSED')
            error = "Database connection was refused.";

		console.error(error);
		throw error;
    }
    if (connection) connection.release();
});

// Promisify for Node.js async/await.
pool.query = util.promisify(pool.query).bind(pool);

module.exports = pool;
