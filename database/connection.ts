import mysql2 from 'mysql2'

const pool = mysql2.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'my_ts_node_db',
  waitForConnections: true
})

export default pool.promise()