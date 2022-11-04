# Example - Showing suspense vs cascading hooks

The concept shows how a "PromiseResource" can be used in various ways in comparison to hooks.

Issue: React 18.2 seems to shift where the rerendering occurs from in Suspense. Before 18.2 the re-rendering would start at the component that threw, now it seems to start at a Suspense boundary.

**url**
https://smacpherson64.github.io/tale-of-two-components
