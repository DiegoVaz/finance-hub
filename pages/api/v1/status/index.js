import database from 'infra/database.js'

async function status(request, response) {
  const databaseName = process.env.POSTGRES_DB
  const databaseVersion = await database.query('SHOW server_version')
  const databaseMaxConections = await database.query('SHOW max_connections')
  const databaseOpenedConnections = await database.query({
    text: `SELECT COUNT(*)::int FROM pg_stat_activity where datname = $1 ;`,
    values: [databaseName],
  })

  const updateAt = new Date().toISOString()

  response.status(200).json({
    updated_at: updateAt,
    dependencies: {
      database: {
        version: databaseVersion.rows[0].server_version,
        max_connections: parseInt(
          databaseMaxConections.rows[0].max_connections
        ),
        opened_connections: databaseOpenedConnections.rows[0].count,
      },
    },
  })
}

export default status
