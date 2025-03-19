import useSWR from 'swr'

async function fetchAPI(key) {
  const response = await fetch(key)
  const responseBody = await response.json()
  return responseBody
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <h1>Database</h1>
      <DatabaseStatus />
    </>
  )
}

function UpdatedAt() {
  const { isLoading, data } = useSWR('/api/v1/status', fetchAPI, {
    refreshInterval: 10000,
  })

  return (
    <>
      {!isLoading && data ? (
        <div>
          <p>
            Última atualização:{' '}
            <span>{new Date(data.updated_at).toLocaleString('pt-BR')}</span>
          </p>
        </div>
      ) : (
        'Carregando...'
      )}
    </>
  )
}
function DatabaseStatus() {
  const { isLoading, data } = useSWR('/api/v1/status', fetchAPI, {
    refreshInterval: 10000,
  })

  return (
    <>
      {!isLoading && data ? (
        <div>
          <p>
            Versão do PostgresSQL:{' '}
            <span>{data.dependencies.database.version}</span>
          </p>
          <p>
            Número máximo de conexões:{' '}
            <span>{data.dependencies.database.max_connections}</span>
          </p>
          <p>
            Número de conexões abertas: {''}
            <span>{data.dependencies.database.opened_connections}</span>
          </p>
        </div>
      ) : (
        'Carregando...'
      )}
    </>
  )
}
