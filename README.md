# Welcome to the Tale of Two Components

## TDLR

Using suspense for data gathering can help keep visual components focused.

## Content

Back in 2015 Dan Abramov made a blog post about
["Container" components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0).

The gist is separating business logic from visual components. The main benefits of this
pattern are:

- The consuming components are guaranteed to have the data when they render.
- The visual components are able to be focused. The visual components then only have to deal with the path they are made for: loading, errors, or happy path.
- The visual components can each be changed and tested in isolation.

&nbsp;

He has since suggested to start using hooks because, like Redux,
some obsessed with how things are organized instead of the idea.
E.G. the code must be in separate folders one labeled `containers` one labeled `components`.
This unnecessary focus on strict separation in file structure, caused a lot
of layers and indirection and made the pattern cumbersome to use.

&nbsp;

The problem was not the pattern of separating how data is gathered from presentation.
This pattern can be extremely helpful especially around interconnected data.

&nbsp;

The code is annotated, so feel free to jump into various files to see the description of how things work. So getting into the code we have two types of components:
One is a hooks based component and the others are suspense based components. Each aim to do similar things.

The comments go through the Hooks component first, then go to the suspense component.

This makes the hooks component a great place to get started, feel free to jump in: [./src/Hooks/index.js](https://github.com/smacpherson64/tale-of-two-components/blob/main/src/Hooks/index.js)

## How to play with the experiment

1. Clone the repo
2. `npm i`
3. `npm run start`
4. Change the imports in `App.js` for suspense.

## Update React 18.2 suspense change

React 18.2 shifts where the re-rendering occurs in Suspense. Before 18.2 the re-renders only the component that threw, now the re-render starts at the Suspense boundary.

**url**
https://smacpherson64.github.io/tale-of-two-components
