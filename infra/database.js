import { Client } from 'pg'

async function query(queryObject) {
  let client

  try {
    client = await getNewClient()
    const result = await client.query(queryObject)

    return result
  } catch (err) {
    console.error(err)
    throw err
  } finally {
    await client.end()
  }
}

export async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  })

  await client.connect()
  return client
}

export default {
  query,
  getNewClient,
}

function getSSLValues() {
  return process.env.NODE_ENV === 'production' ? true : false
}
