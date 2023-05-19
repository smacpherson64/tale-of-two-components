import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {getAccounts, getShipments, getUser} from '../fetch-data'
import {usePromiseResource, PromiseResource} from './PromiseResource'

// Starting to get the user immediately before rendering
const initialUserResource = new PromiseResource(getUser())

/**
 * # Welcome to the Suspense Component
 *
 * > **BEFORE STARTING READ THIS:**
 * > Suspense is awesome, but it does not replace the need for hooks. **Again, hooks are not bad**.
 *
 * The main focus is on the Root component. This component uses suspense based fetchers to retrieve data
 * and show it on the screen. This compeonent splits gathering data and presenting data.
 *
 * There are three levels of data needed to show the data on the screen:
 * - user
 * - account (requires user.id)
 * - shipments (requires account.id)
 *
 * We wrap the direct api calls in a promise resource, these are aimed to be realistic.
 * Loading the user starts before rendering (or while rendering). Loading accounts and
 * shipments happens inside of the component is more waterfall.
 */
export const Root = () => {
  const [userResource] = React.useState(initialUserResource)

  const accountsResource = React.useMemo(
    () =>
      new PromiseResource(
        // We use the user promise and wait for the data to resolve
        // then use that to make the accounts request.
        userResource.promise.then((user) => getAccounts({userId: user.id})),
      ),
    [userResource],
  )

  const shipmentsResource = React.useMemo(
    () =>
      new PromiseResource(
        // We use the accounts promise and wait for the data to resolve
        // then use that to make the shipments request.
        accountsResource.promise.then(({accounts}) => {
          const primaryAccount = accounts?.[0]

          if (!primaryAccount) {
            return {shipments: []}
          }

          return getShipments({accountId: primaryAccount.id})
        }),
      ),
    [accountsResource],
  )

  // Here we split data gathering from presentation:
  // Root knows how the data is gathered but not presented
  // Root.SuspendingView knows how the data is presented but not gathered.

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Root.SupendingView
        userResource={userResource}
        accountsResource={accountsResource}
        shipmentsResource={shipmentsResource}
      />
    </React.Suspense>
  )
}

Root.SupendingView = function RootSuspendingView({
  userResource,
  accountsResource,
  shipmentsResource,
}) {
  // React handles the loading and render states:
  // if the promise is not done, it throws and waits for that promise
  // it stops rendering at the point that it throws and rerenders the component
  // (this ensures we are in the happy path afterwards).

  // Below the renders assume a waterfall loading that the calls did not finish in time

  // Render 1: The data is still loading, throw
  // Render 2: The data is returned
  // Render 3: The data is returned
  const user = usePromiseResource(userResource)

  // Render 1: not reached - rendering stopped
  // Render 2: the data is loading, throw
  // Render 3: the data is returned
  const {accounts} = usePromiseResource(accountsResource)

  // Render 1: not reached - rendering stopped
  // Render 2: not reached - rendering stopped
  // Render 3: the data is loading, throw
  // Render 4: the data is returned
  const {shipments} = usePromiseResource(shipmentsResource)

  // The renders here are intentionally similar to the hook components. The differences are:
  // 1. The data is guarenteed to exist, we are always in the happy path
  // 2. The loading state is handled by React internally
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
        <Root />
      </ErrorBoundary>
    </div>
  )
}
