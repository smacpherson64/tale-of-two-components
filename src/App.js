import * as React from 'react'
import './styles.css'

// Example using React state as cache
import SuspenseView from './Suspense/promise-all'

// Example using React state as cache (multiple resources at once)
// import SuspenseView from "./Suspense/promise-all";

// Example using a cache which means only one component is needed
// import SuspenseView from "./Suspense/cache";

// Example using different loading messages
// import SuspenseView from "./Suspense/loading-states";

import HooksView from './Hooks'

/**
 * # Welcome to the Tale of two components
 *
 * Back in 2015 Dan Abramov made a blog post about
 * ["Container" components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0).
 * The gist is separating business logic from visual components.The main benefits of this
 * pattern are:
 * - The consuming components are guarenteed  to have the data when they render.
 * - The visual can be tested by passing in data
 * They do not need to deal with loading the data or errors. They only need
 * to focus on the "happy path".
 *
 * &nbsp;
 *
 * He has since suggested to start using hooks because, like Redux,
 * people became obsessed with how things were organized.
 * E.G. it must be in separate folders one labeled `containers` one labeled `components`.
 * This unnecessary focus on strict separation in file structure, caused a lot
 * of layers and indirection and made the pattern cumbersome to use.
 *
 * &nbsp;
 *
 * IMO the problem was not the pattern of separating data from presentation.
 * This pattern can be extremely helpful especially around interconnected data.
 *
 * &nbsp;
 *
 * So getting into the code we have two components:
 * A hooks based component and a suspense based component each doing similar things.
 * The comments go through the Hooks component first, then go to the suspense component.
 *
 * Go ahead and jump into ./Hooks/index.js
 */
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
