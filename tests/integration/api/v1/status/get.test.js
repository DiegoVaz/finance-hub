import orchestrator from 'tests/orchestrator.js'

beforeAll(async () => {
  await orchestrator.waitForAllServices()
})

describe('GET /api/v1/status', () => {
  describe('Anonymous user', () => {
    test('Retriveing current system status', async () => {
      const response = await fetch('http://localhost:3000/api/v1/status')
      expect(response.status).toBe(200)

      const responseBody = await response.json()
      expect(responseBody.update_at).toBeDefined()

      const praseUpdateAt = new Date(responseBody.update_at).toISOString()
      expect(responseBody.update_at).toEqual(praseUpdateAt)

      expect(responseBody.dependencies.database.version).toEqual('16.8')
      expect(responseBody.dependencies.database.max_connections).toEqual(100)
      expect(responseBody.dependencies.database.opened_connections).toEqual(1)
    })
  })
})
