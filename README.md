# Example - Showing suspense vs cascading hooks

The concept shows how a "PromiseResource" can be used in various ways in comparison to hooks.

## Update React 18.2 suspense change

React 18.2 shifts where the re-rendering occurs in Suspense. Before 18.2 the re-renders only the component that threw, now the re-render starts at the Suspense boundary.

**url**
https://smacpherson64.github.io/tale-of-two-components
