import path from 'path'
import fs from 'fs'
import connection from '../connection'

export default async function insertTables(afterFinish?: Function) {
  const entitiesPath = path.join(__dirname, '..', 'entities')
  const hasPath = fs.existsSync(entitiesPath)

  if(hasPath) {
    const entities = fs.readdirSync(entitiesPath)

    entities.forEach(async entity => {
      const fileContent = fs.readFileSync(path.join(entitiesPath, entity))

      await runQuery(fileContent.toString())
    })
  }

  else {
    console.log("\ninsertTables function: Entities Folder doesn't exists.\n")
  }

  afterFinish && await afterFinish()
}

async function runQuery(fileContent: string) {
  try {
    await connection.execute(fileContent)
  } catch {
    console.error("\nrunQuery function: Failed to insert table.\n")
  }
}
