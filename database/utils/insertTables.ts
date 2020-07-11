import path from 'path'
import fs from 'fs'
import connection from '../connection'

export default function insertTables() {
  const entitiesPath = path.join(__dirname, '..', 'entities')
  const hasPath = fs.existsSync(entitiesPath)

  if(hasPath) {
    const entities = fs.readdirSync(entitiesPath)

    entities.forEach(entity => {
      const fileContent = fs.readFileSync(path.join(entitiesPath, entity))

      runQuery(fileContent.toString())
    })
  }

  else {
    console.log("\ninsertTables function: Entities Folder doesn't exists.\n")
  }
}

async function runQuery(fileContent: string) {
  try {
    await connection.execute(fileContent)
  } catch {
    console.error("\nrunQuery function: Failed to insert table.\n")
  }
}
