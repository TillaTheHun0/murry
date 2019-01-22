# murry

[![Coverage Status](https://coveralls.io/repos/github/TillaTheHun0/murry/badge.svg?branch=master)](https://coveralls.io/github/TillaTheHun0/murry?branch=master) [![Build Status](https://travis-ci.org/TillaTheHun0/murry.svg?branch=master)](https://travis-ci.org/TillaTheHun0/murry?branch=master) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![npm version](https://img.shields.io/npm/v/murry.svg)](https://www.npmjs.com/package/murry) [![License](https://img.shields.io/npm/l/murry.svg?maxAge=2592000?style=plastic)](https://github.com/TillaTheHun0/murry/blob/master/LICENSE) [![Greenkeeper badge](https://badges.greenkeeper.io/TillaTheHun0/murry.svg)](https://greenkeeper.io/)


`murry` keeps your controller separate from your routing logic via curried marshalling. This keeps your controller logic separate from whatever framework you choose to handle web-server routing while currying makes it highly composable and prevents duplicated code

## Table of Contents <a name="toc"></a>

- [Installation](#installation)
- [Currying?](#currying)
- [Marshalling?](#marshalling)
- [How It Works](#how-it-works)
- [Usage](#usage)
- [With Ramda](#with-ramda)
- [TODO](#todo)
- [Contribute](#contribute)
- [License](#license)
- [Name](#name)

## Installation <a name="installation"></a>

npm
```bash
$ npm install --save murry
```

yarn
```bash
$ yarn add murry
```

## Currying? <a name="currying"></a>

Currying is a technique used in functional programming for buiilding composable reusuable functions. Instead of repeating it, read a good post about currying [here](https://www.sitepoint.com/currying-in-functional-javascript/)

## Marshalling? <a name="marshalling"></a>

From WikiPedia:

>In computer science, marshalling or marshaling is the process of transforming the memory representation of an object to a data format suitable for storage or transmission,and it is typically used when data must be moved between different parts of a computer program or from one program to another...It simplifies complex communication, using composite objects in order to communicate...

The term Mashalling is most commonly used when when talking about objects in memory or serialization for sending objects across a network. `Murry` _technically_ isn't marshalling, but from a high level sense it is; it is taking the shape of some objects, which the programmer cannot control and is external to his or her code, and turns it into a state that our code can work with.

This separates any web-server library specifics from your business logic. This means **controllers are _much_ easier to test**, as they do not require mocking objects created by an external web-server library. It also promotes separation of concerns, as code for extracting data from incoming requests, and responding to those requests is separate from the "meat" of your program.

## How It Works <a name="how-it-works"></a>

At the root of `Murry` is a curried function like so:

```javascript
function murryer (errorHandler, extractor, responder, controller) {
  return (...args) { // args given to murry by the web-server library

    // extract the data we want from args
    // pass that data to our controller, which just returns a promise
    // respond to the request using the data provided by the controller

    // catch errors, also handling them as the web-server library would

  }
}
```

Lets go through each argument
- `errorHandler` Function<Function (...args)>(err: Error): a function that itself returns a function that handles any errors that arise while handling a request
- `extractor` Function<Array>(...args): a function that extracts the data we want from `args` and returns them as an **Array**. These values are **spread** into the controller function
- `responder` Function<Function<>>(...args): a function that itself returns a function that handles responding to the request using the data returned from the controller call
- `controller` Function<Promise>(...args): a function that returns a promise. What is resolved from the promise returned from the controller will be passed to the responder


`args` are the arguments provided by whatever web-server library you are using. Since the function is curried, we can pass any number of these arguments and then use _those_ new functions to compose distinct flows. This composability compounds for each argument! Utilizing the currying capabilities, you can set up defaults for all or a subset of your `murryers`.

`Murry` has a _tiny_ footprint; It's just a couple functions and some sensisble prebuilt default extractors, responders, and errorHandlers for `ExpressJS`

## Usage <a name="usage"></a>

```javascript

import { curryer } from 'murry'

/**
 * With Express JS
 * 
 * Just call next() and pass it an error argument, which tells Express that an error has occurred
 * and immediatley skips all middleware until the error handling middleware
 **/
const errorHandler = err =>
  (req, res, next) => next(err)

// We only pass in our error handler to the curryer
const defaultMurryer = curryer(errorHandler)

/**
 * Set up lots of murryers with different extractors, but with the same error handling!
 * 
 * Extractors always need to return an array.
 **/
const getReqMurryer = defaultMurryer((req, res, next) => [req.params, req.query]) // extract the url params and query string
const postReqMurryer = defaultMurryer((req, res, next) => [req.body]) // extract the body
const deleteReqMurryer = defaultMurryer((req, res, next) => [req.params]) // extract just the url params

// Now use those murryers for even more flow!
const postReqJsonResMurryer = postReqMurryer(data => (req, res, next) =>  res.json(data))
const postReqStatusResMurryer= postReqMurryer(() => (req, res, next) => res.sendStatus(203))
// ... so on

// =========================================

// Then on a endpoint route somewhere...
import { postReqJsonResMurryer } from '../my.murryers'

/**
 * a controller function that is given the spread values provided by the extractor
 * 
 * It just returns a promise
 */
const controller = async body => {
  body.type = 'foo'
  // whatever else we do with it
  // post the new asset to the database!
  return { id: 1, ...body } // return mocked new persisted asset
}

/**
 * Set up the route on the router
 * 
 * The Murryer extracts the body, invokes the controller
 * providing the extract values, and responds to the client with JSON
 * from the controller
 */
router.post('/api/assets', someOtherMiddleware(), postReqJsonResMurryer(controller))
```

In the example above, notice that the controller function has **no** specific logic for handling request objects, or responding to the client, or handling errors. You've already set up all of that route handling in your `Murryer`! The controller is just passed the extracted values as arguements and then it just returns a `Promise`. This controller is now encapsulated and kept separate from the web-server library. It is **much** easier to unit test and does not require mocking objects for that whatever web-server library you are using.

Decide you want to use a different web-server library, say `Restify`, instead of `ExpressJS`? No problem! Just adjust the `Murryer` to extract and repsond w.r.t the new library and your controllers and tests **just work**!

Decide you want different error handling? Just update the one function and **boom**. It's updated for all routes using that `Murryer`.

Need very specific handling for a route? Just compose a `murryer` from scratch without touching your other `murryers`.

The high composability of `murry` allows you to easily write reusable implementation, minimize changes during refactors, and keep your logic **separate** from the web-server library

## With Ramda <a name="with-ramda"></a>

Ramda is a great library for embracing functional programming. For example, all Ramda functions are automatically curried. One great tool Ramda provides is the `__` function. `__` can be used as a placeholder for functions being passed to a curry function. Say you needed a `murryer` that used an extractor and responder, but needed to be composable to have different error handling? No problem:

```javascript

import { curryer } from 'murry'
import { __ } from 'ramda'

const extractor = req => [req.body]
const responder = (req, res) => data => res.json(data)

const defaultMurryer = curryer(__, extractor, responder) // placehold the errorHandler
```

Then you can pass in the errorHandler later. This also means arguments passed to the curried function can be provided out of order!

## TODO <a name="todo"></a>

- Plugin system for web-server libraries to make `murry` work out of the box with less boilerplate
- Better docs
- Library specific tests ie. Express, Hapi, Restify, etc.

## Contribute <a name="contribute"></a>

Submit an issue or a PR

## License <a name="license"></a>
MIT

## Name <a name="name"></a>
"marshall + curry" => "murry". `Murryer` also rhymes with `Courier` which _sort of_ aligns with the use case for `murry` :)

