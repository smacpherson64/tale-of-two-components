import * as React from 'react'
import {getUser, getAccounts, getShipments} from '../fetch-data'

/*
 * # Welcome to the Hooks component
 *
 * > **BEFORE STARTING READ THIS:**
 * > Hooks are awesome, the issue is not with hooks.
 * > The issue comes around fetching and caching data. These issues are always incredibly
 * > nuanced and require a lot of thought to solve well.
 *
 * The main focus is on the Root component. This component uses hook based fetchers to retrieve data
 * and show it on the screen. The main constraint is that this component should not be split
 * into multiple components for fetching data.
 *
 * There are three levels of data needed to show the data on the screen:
 * - user
 * - account (requires user.id)
 * - shipments (requires account.id)
 *
 * The three hooks: `useUser`, `useAccounts`, and `useShipments`. are aimed to be realistic.
 * These hooks are setup with the "waterfall" pattern, where the component renders then fires
 * off the request to get the data, then rerenders the component.
 *
 * The emphasis here is stressed to make sure that there is only one Root component.
 * There is no data splitting.
 */

const useUser = function () {
  // Tracking the three parts of state:
  // - do we have the data?
  // - was there an error fetching the data?
  // - are we still loading the data?
  const [data, setData] = React.useState()
  const [error, setError] = React.useState()
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    setLoading(true)

    getUser()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  return React.useMemo(() => {
    return {data, error, loading}
  }, [data, error, loading])
}

const useAccounts = function ({userId}) {
  // Again tracking the three parts of state
  const [data, setAccount] = React.useState()
  const [error, setError] = React.useState()
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    // In this effect, we have some assumptions that have leaked in because
    // of how the hook is used. If this hook were by itself, we would expect
    // there to always be a userId, but we want to reuse the logic
    // and state tracking in this hook. Since our requirement is to only have
    // one component, we need to make a concession because we may not receive a userId.
    //
    // NOTE: To get around this we could inline this logic and state tracking in a useEffect.
    //
    // For fun remove the userId conditional and see what happens.
    if (userId) {
      setLoading(true)

      getAccounts({userId})
        .then(setAccount)
        .catch(setError)
        .finally(() => setLoading(false))
    }
  }, [userId])

  return React.useMemo(() => {
    return {data, error, loading}
  }, [data, error, loading])
}

const useShipments = function ({accountId}) {
  // Again tracking the three parts of state
  const [data, setAccount] = React.useState()
  const [error, setError] = React.useState()
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    // Again, same as above, we are forced to make some assumptions
    // because of how the hook is used and the one component requirement.
    // We need to make a consession because we may not receive an accountId.
    if (accountId) {
      setLoading(true)

      getShipments({accountId})
        .then(setAccount)
        .catch(setError)
        .finally(() => setLoading(false))
    }
  }, [accountId])

  return React.useMemo(() => {
    return {data, error, loading}
  }, [data, error, loading])
}

/**
 * # The Root Component
 */
function Root() {
  // Render 1:
  // - data: undefined
  // - error: undefined
  // - loading: true
  //
  // Render 2:
  // - data: user
  // - error: undefined
  // - loading: false
  const {data: user, error: userError, loading: userLoading} = useUser()

  // Render 1:
  // - data: undefined
  // - error: undefined
  // - loading: true
  // - userId: undefined
  //
  // Render 2:
  // - data: undefined
  // - error: undefined
  // - loading: true
  // - userId: user.id
  //
  // Render 3:
  // - data: accounts
  // - error: undefined
  // - loading: true
  // - userId: user.id
  const {
    data: accountData,
    error: accountError,
    loading: accountLoading,
  } = useAccounts({userId: user?.id})

  // Render 1: undefined
  // Render 2: undefined
  // Render 3: account
  const primaryAccount = accountData?.accounts?.[0]

  // Render 1:
  // - data: undefined
  // - error: undefined
  // - loading: true
  // - accountId: undefined
  //
  // Render 2:
  // - data: undefined
  // - error: undefined
  // - loading: true
  // - accountId: undefined
  //
  // Render 3:
  // - data: undefined
  // - error: undefined
  // - loading: true
  // - accountId: account.id
  //
  // Render 4:
  // - data: shipments
  // - error: undefined
  // - loading: false
  // - accountId: account.id
  const {
    data: shipmentsData,
    error: shipmentsError,
    loading: shipmentsLoading,
  } = useShipments({accountId: primaryAccount?.id})

  // At this point we are NOT guarenteed that we have any data. The component must
  // handle possibly not having the data, loading, error states

  // Handling data, we could put this inline too which is nice, exiting quickly here
  // to keep data safe.
  if (userError || accountError || shipmentsError) {
    return <div>Oh Snap!</div>
  }

  // No hooks allowed past this point

  // Handle the loading screen inline, to move this we need to move the hooks as well.
  if (accountLoading || userLoading || shipmentsLoading) {
    return <div>Loading...</div>
  }

  // At this point, because we have carefully made sure each error and loading state
  // has been handled, we can have a bit of confidence that we have our data. Yay!
  // happy path.

  // We do have some downsides here though:
  // 1. We are constrained to where the loading screen occurs, (we could do an error boundary still!)
  // 2. The hooks themselves need to be adjusted to assume they may not have the data they need (or not be used)
  // 3. We tightly constrain where we can put hooks, unless we start moving into useEffects and inlining state.
  // 4. There are a lot of paths in this one component to think about when it comes to data.

  return (
    <div>
      Welcome {user.firstName} {user.lastName}!
      <div>
        You are connected with {accountData?.accounts?.length} account(s)
      </div>
      <div>
        <div>Shipments for account:</div>
        <div className="text-xs my-2 font-mono bg-teal-200 rounded p-2">
          <ol>
            {shipmentsData?.shipments.map((shipment) => {
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

export default function Page() {
  return (
    <div className="flex w-full flex-1 items-center justify-center">
      <Root />
    </div>
  )
}
