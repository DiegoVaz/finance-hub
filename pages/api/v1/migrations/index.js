import { createRouter } from 'next-connect'
import migrationRunner from 'node-pg-migrate'
import { resolve } from 'node:path'
import database from 'infra/database'
import controller from 'infra/controller'

const router = createRouter()

router.get(getHandler)
router.post(postHandler)

export default router.handler(controller.errorHandlers)

const defaultMigrationsOptions = {
  dryRun: true,
  dir: resolve('infra', 'migrations'),
  direction: 'up',
  verbose: true,
  migrationsTable: 'pgmigrations',
}

async function getHandler(request, response) {
  let dbClient
  try {
    dbClient = await database.getNewClient()

    const pedingMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dbClient,
    })
    response.status(200).json(pedingMigrations)
  } finally {
    await dbClient.end()
  }
}

async function postHandler(request, response) {
  let dbClient
  try {
    dbClient = await database.getNewClient()

    const migratedMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dbClient,
      dryRun: false,
    })

    if (migratedMigrations.length > 0) {
      response.status(201).json(migratedMigrations)
    }

    response.status(200).json(migratedMigrations)

    await dbClient.end()
  } finally {
    await dbClient.end()
  }
}
