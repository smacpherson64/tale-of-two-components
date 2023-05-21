import * as React from 'react'
import './styles.css'

/**
 * SuspenseView
 *
 * Uncomment the different components to see them in action.
 */

// Default suspense example
import SuspenseView from './Suspense/index'

// Example using different loading messages
// import SuspenseView from "./Suspense/loading-states";

// Example using React state as cache (multiple resources at once)
// import SuspenseView from "./Suspense/promise-all";

// Example using a cache which means only one component is needed
// import SuspenseView from "./Suspense/cache";

// Example using a cache view (multiple resources at once)
// import SuspenseView from './Suspense/cache-all'

// Example using a preloaded cache view
// import SuspenseView from './Suspense/cache-preload'

/**
 * HooksView
 */

import HooksView from './Hooks'

export default function App() {
  return (
    <main className="bg-gray-600 text-white flex flex-col sm:flex-row w-full min-h-screen items-stretch">
      <div className="bg-teal-300 text-teal-900 w-full flex-1 flex relative p-6">
        <div className="absolute text-xs font-bold text-teal-500 top-1 left-1 ">
          HOOKS
        </div>
        <HooksView />
      </div>
      <div className="bg-amber-300 text-amber-900 w-full flex-1 flex relative p-6">
        <div className="absolute text-xs font-bold text-amber-500 top-1 left-1 ">
          SUSPENSE
        </div>
        <SuspenseView />
      </div>
    </main>
  )
}
