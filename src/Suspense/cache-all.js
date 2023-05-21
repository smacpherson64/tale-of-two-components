import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {getAccounts, getShipments, getUser} from '../fetch-data'
import {PromiseResource, ResourceCache} from './PromiseResource'

// Starting to get the user immediately before rendering
const initialUserResource = new PromiseResource(getUser())

/**
 * # Welcome to the naive cache version
 *
 * > **BEFORE STARTING READ THIS:**
 * > DO NOT USE THIS, it has not been tested. YOU HAVE BEEN WARNED...
 *
 * The main focus in the cache version is that we are down to one component. There is no longer
 * a separation between how the data is gathered and how the data is presented.
 *
 * There are three levels of data needed to show the data on the screen:
 * - user
 * - account (requires user.id)
 * - shipments (requires account.id)
 *
 * We wrap the direct api calls in a promise resource and cache them, these are aimed to be realistic.
 * Loading the user starts before rendering (or while rendering). Loading accounts and
 * shipments happens inside of the component is more waterfall.
 */
export function Root() {
  // React handles the loading and render states:
  // if the promise is not done, it throws and waits for that promise
  // it stops rendering at the point that it throws and rerenders the component
  // (this ensures we are in the happy path afterwards).

  // Below the renders assume a waterfall loading that the calls did not finish in time

  // Render 1: The data is still loading, throw
  // Render 2: The data is returned
  const [user, {accounts}, {shipments}] = ResourceCache.usePromiseResource(
    {
      key: 'userResource',
      cache: () => initialUserResource,
    },
    {
      key: 'accountsResource',
      cache: () =>
        new PromiseResource(
          // We use the user promise and wait for the data to resolve
          // then use that to make the accounts request.
          ResourceCache.get('userResource').promise.then((user) =>
            getAccounts({userId: user.id}),
          ),
        ),
    },
    {
      key: 'shipmentsResource',
      cache: () =>
        new PromiseResource(
          // We use the accounts promise and wait for the data to resolve
          // then use that to make the shipments request.
          ResourceCache.get('accountsResource').promise.then(({accounts}) => {
            const primaryAccount = accounts?.[0]

            if (!primaryAccount) {
              return {shipments: []}
            }

            return getShipments({accountId: primaryAccount.id})
          }),
        ),
    },
  )

  // The renders here are intentionally similar to the hook components. The differences are:
  // 1. The data is guaranteed to exist, we are always in the happy path
  // 2. The loading state is handled by React internally (it will throw and stop rendering)
  // 3. The error states are handled error boundaries
  // 4. We have less constraints around hooks, we did not need to return to keep in the happy path.

  return (
    <div>
      Welcome {user.firstName} {user.lastName}!
      <div>You are connected with {accounts.length} account(s)</div>
      <div>
        <div>Shipments for account:</div>
        <div className="text-xs my-2 font-mono bg-amber-200 rounded p-2">
          <ol>
            {shipments.map((shipment) => {
              return (
                <li key={shipment.id}>
                  <span className="font-bold">{shipment.id}:</span> from{' '}
                  {shipment.from} to {shipment.to}
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </div>
  )
}

export default function SuspenseView() {
  return (
    <div className="flex w-full flex-1 items-center justify-center">
      <ErrorBoundary fallback={<div>Oh Snap!</div>}>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Root />
        </React.Suspense>
      </ErrorBoundary>
    </div>
  )
}
