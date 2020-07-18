import server from './core/server'
import insertTables from './database/utils/insertTables'

const port = 3200

server.listen(port, () => {
  console.log(`Server running | port ${port}`)
  insertTables()
})