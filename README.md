![Version](https://img.shields.io/badge/version-1.0-blue.svg)
![Build Status](https://travis-ci.org/alex030293/code-test.svg?branch=master)
![Test Coverage](https://codeclimate.com/github/alex030293/code-test/badges/coverage.svg)
![Codacy Badge](https://api.codacy.com/project/badge/Grade/8547dab75752418dab6fcf504b91f43f)
![Code Climate](https://codeclimate.com/github/alex030293/code-test/badges/gpa.svg)


# Mobgen Code Test

## Description

This micro web application consists on a SPA (single page application) for managing todos.

Each todo task will have title, description, author, creation date, modification date, done flag and deleted flag.

Deleted flag exists because we're doing soft-deletion instead of fully removing the document. Anyhow, delete method is implemented and tested.

In order to measure code quality, this repo is synced with [Codacy](https://www.codacy.com/) and [Codeclimete](https://codeclimate.com/). You can see their badges in the top of the readme.

The app is hosted in Heroku, available in the following link:

[https://mobgen-code-test.herokuapp.com/](https://mobgen-code-test.herokuapp.com/)


### Backend

We're using [mlab](http://mlab.com) as **MongoDB** database. There are two separated databases for production and development modes. Database can be configured with a environment variable, which is described below. They're described in the **config/connections.js** file.

This is a **Node.js** application using **Express** framework. The aplication follows a MVC pattern, which is described in the **Design Patterns** section.

I've used [Mongoose](http://mongoosejs.com/) instead of Waterline beacause of some drawbacks I found on the internet. For example [this article](https://kev.inburke.com/kevin/dont-use-sails-or-waterline/).

The applications is written following [ECMAScript® 2015 Language Specification](http://www.ecma-international.org/ecma-262/6.0/) standard. Node.js doesn't support all of its features currently ([current status](http://node.green/)), so i'm using [Babel](https://babeljs.io/docs/usage/cli/) to transpile the app and make it fully compatible with any Node.js version.

Dependencies are managed with [npm](https://www.npmjs.com/).

There's one CRUD controller for operating with todo's entities, as required. It's fully independent from it's router and it's model.


### Frontend

The view layer is implemented using [Angular](https://angular.io/) framework v2. It's written in Typescript, so source code must be transpiled. This is made automatically in the "start" script with live reload. (I'm aware of performance impact, it's just development mode).

The framework configuration is set to development mode, so you can see logging information. When eventually building the application for production, some tasks must be made: tree-shaking, rolling-up and set production mode and ahead-of-time compilation. 

Frontend dependencies are also managed via npm, in the main package.json. I've also used [SystemJS](https://github.com/systemjs/systemjs) to make this dependencies available to Angular framework.

This layer follows also a MVC pattern, including others like factory, composition and decorator. They're described below.

### Design Patterns

#### Backend

* **MVC**: in the Nodejs app there is a *services* folder, were there is the TodoService. This file represents the model layer, it's a factory with CRUD methods using Mongoose ODM. 

    The API route is handled by the file in the *controllers* directory. HTTP requests to the API are handled by this file, which is independent from the model and view layers.

    The view layer is accesible in the / path, implemented with Angular and using Jade (now Pug) as template engine. The template engine is barely used, since the view components contain their own markup.

* **Factory**: TodoService implements a factory pattern, since it can be injected and used to perform CRUD operations to the model.

* **Facade**: The API controller uses the TodoService, implementing a facade pattern, becauses it abstracts the usage of the factories for each use case.

#### Frontend

* **MVC**: Angular applications usually follows this pattern, which defines a model layer composed by the services; a controller layer formed by the components themselves and a view layer consisting on the HTML views, related to each component.

* **Factory**: Each service works as a factory, allowing to perfom CRUD operations when injected in any component via the Node.js API endpoint.

* **Composite**: The app is a component tree, some components include smaller components. (app.component contains todo-list.component and todo-details.component).

#### Own pattern

* **Frame pattern**: this is a very simple pattern consisting in controlling which form is displayed in the todo-details component. Add and edit forms are different, in addition to the details view.

    The details component has a method to set and unset the frame that must be displayed in each conext, using *ngIf directive.

    It's a very simple pattern, but allows the application to change the frames without using Angular's router.


### CI

I'm using [TravisCI](https://travis-ci.org/) as a continuous integration service. Each commit is automatically deployed on Heroku only when build is passed successfully.

## Instructions

### Dependencies

- **npm**
- **node**
- **mongodb** *(optional)*


### Install

`npm i`


### Test

`npm test`

`npm run coverage` *(with coverage report)*

![Imgur](http://i.imgur.com/2yXq5Sp.png)

### Run

`npm start`

### Environment variables

* **DB**: defines the database the aplications uses. Options are defined in the `config/connnections.js` file. (local, preDb, etc.)
* **PORT**: defined the port the app runs on. Default port is 1337.

## Sidenotes

I couldn't spend as much time as I'd like to since I have a full-time job right now. I'm almost sure I made some mistakes and I didn't test everything as I should. I've spent about 10 hours in total.

I used a Github repo besides the Bitbucket one because Heroku doesn't hace Bitbucket integration for its continuos deployment feature.

Pagination is implemented in the backend, but not in the frontend since I didn't have time enough to make an infinite scrolling list and many other features I'd like to add. It's just a simple approach.

You can use a local mongodb database running on default port instead of mlab's using `DB=local` environment variable.