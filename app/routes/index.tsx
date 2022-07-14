import type { LoaderArgs } from '@remix-run/node'
import { superjson, useSuperLoaderData } from '~/utils/data'

export async function loader({ request }: LoaderArgs) {
  return superjson(
    { greeting: 'hello', today: new Date() },
    { headers: { 'x-superjson': 'true' } },
  )
}

export default function Index() {
  const data = useSuperLoaderData<typeof loader>()

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      <h1>Remix SuperJSON</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <p>Today is {data.today.toLocaleDateString()}</p>
    </div>
  )
}
