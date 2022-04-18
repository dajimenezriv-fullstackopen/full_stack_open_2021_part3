# full_stack_open_2021_part3
 
We create our first server with Node.js.<br>
We connect it with the phonebook example of [part 2](https://github.com/dajimenezriv/full_stack_open_2021).

### Part a) Node.js and Express.
Express, nodemon, REST, VSCode REST Client and custom middleware.

### Part b) Deploying app to Internet.
CORS, Heroku.<br>
Create the production build of the phonebook example.

### Part c) Saving data to MongoDB.

### Part d) Validation and ESLint.
Deploying the database backend to production.<br>
ESLint.

## How to run?

### Locally

First, follow the steps of PENDING.

We need to create a database called <b>persons</b> in MongoDB.
Create a file called <b>.env</b> in the root of the folder with the following content:

```
MONGODB_URI='mongodb+srv://<username>:<password>@cluster0.zdudq.mongodb.net/persons?retryWrites=true&w=majority'
PORT=3001
```

Then, in the root of the folder:

```console
# development mode
npm run dev
# production mode
npm start
```

###
