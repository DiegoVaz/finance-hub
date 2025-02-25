import migrationRunner from 'node-pg-migrate'
import { join } from 'node:path'
import database from 'infra/database'

export default async function migrations(request, response) {
  const dbClient = await database.getNewClient()

  const defaultMigrationsOptions = {
    dbClient,
    dryRun: true,
    dir: join('infra', 'migrations'),
    direction: 'up',
    verbose: true,
    migrationsTable: 'pgmigrations',
  }

  try {
    if (request.method !== 'GET' && request.method !== 'POST') {
      response.status(405).json({
        message: 'Method not Allowed',
      })
    }

    if (request.method === 'GET') {
      const pedingMigrations = await migrationRunner(defaultMigrationsOptions)

      response.status(200).json(pedingMigrations)
    }

    if (request.method === 'POST') {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationsOptions,
        dryRun: false,
      })

      if (migratedMigrations.length > 0) {
        response.status(201).json(migratedMigrations)
      }

      response.status(200).json(migratedMigrations)
    }
  } catch (error) {
    console.log(error)
  } finally {
    await dbClient.end()
  }
}
