import migrationRunner from 'node-pg-migrate'
import { resolve } from 'node:path'
import database from 'infra/database'

export default async function migrations(request, response) {
  const allowedMethods = ['GET', 'POST']

  if (!allowedMethods.includes(request.method)) {
    return response.status(405).json({
      error: `Method ${request.method} not allowed`,
    })
  }

  let dbClient

  try {
    dbClient = await database.getNewClient()

    const defaultMigrationsOptions = {
      dbClient,
      dryRun: true,
      dir: resolve('infra', 'migrations'),
      direction: 'up',
      verbose: true,
      migrationsTable: 'pgmigrations',
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
    console.error(error)
    throw error
  } finally {
    await dbClient.end()
  }
}
