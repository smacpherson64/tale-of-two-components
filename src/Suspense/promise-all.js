import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {getAccounts, getShipments, getUser} from '../fetch-data'
import {usePromiseResource, PromiseResource} from './PromiseResource'

// Starting to get the user immediately before rendering
const initialUserResource = new PromiseResource(getUser())

/**
 * # Welcome to the promise all suspense version
 *
 * > **BEFORE STARTING READ THIS:**
 * > Suspense is awesome, but it does not replace the need for hooks. **Again, hooks are not bad**.
 *
 * The main focus is on the Root component. This component uses suspense based fetchers to retrieve data
 * and show it on the screen. This component splits gathering data and presenting data.
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
  // Render 1: throw promise
  // Render 2: all data is ready
  const [user, {accounts}, {shipments}] = usePromiseResource(
    userResource,
    accountsResource,
    shipmentsResource,
  )

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
