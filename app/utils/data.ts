import { useLoaderData } from '@remix-run/react'
import * as _superjson from 'superjson'

export type SuperJsonFunction = <Data extends unknown>(
  data: Data,
  init: number | ResponseInit,
) => SuperTypedResponse<Data>

export declare type SuperTypedResponse<T extends unknown = unknown> =
  Response & {
    superjson(): Promise<T>
  }

type AppData = any
type DataFunction = (...args: any[]) => unknown // matches any function
type DataOrFunction = AppData | DataFunction

export type UseDataFunctionReturn<T extends DataOrFunction> = T extends (
  ...args: any[]
) => infer Output
  ? Awaited<Output> extends SuperTypedResponse<infer U>
    ? U
    : Awaited<ReturnType<T>>
  : Awaited<T>

export const superjson: SuperJsonFunction = (data, init = {}) => {
  let responseInit = typeof init === 'number' ? { status: init } : init
  let headers = new Headers(responseInit.headers)
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json; charset=utf-8')
  }
  return new Response(_superjson.stringify(data), {
    ...responseInit,
    headers,
  }) as SuperTypedResponse<typeof data>
}

export function useSuperLoaderData<T = AppData>(): UseDataFunctionReturn<T> {
  const data = useLoaderData()
  return _superjson.deserialize(data)
}

export type RedirectFunction = (
  url: string,
  init?: number | ResponseInit,
) => SuperTypedResponse<never>

/**
 * A redirect response. Sets the status code and the `Location` header.
 * Defaults to "302 Found".
 *
 * @see https://remix.run/api/remix#redirect
 */
export const redirect: RedirectFunction = (url, init = 302) => {
  let responseInit = init
  if (typeof responseInit === 'number') {
    responseInit = { status: responseInit }
  } else if (typeof responseInit.status === 'undefined') {
    responseInit.status = 302
  }

  let headers = new Headers(responseInit.headers)
  headers.set('Location', url)

  return new Response(null, {
    ...responseInit,
    headers,
  }) as SuperTypedResponse<never>
}
