# Node/Express/Mongoose Url-Shortener App

I am newbie in coding and this is my first project. I would be glad to any advices 😄. 

> ### Url-Shortener app with Node.js (Express.js + Mongoose) containing CRUD pattern and auth.   

<br>

# Getting started  

To get the Node server rinnung locally:
- Clone this repo
- `npm install` to install all required dependencies
- Install MongoDB Community Edition and run it with `mongod`
- Rename `.env.sample` to `.env`, and enter your jwt secret and mongodb connection uri
- `npm run dev` to start the local server
  
# Code overview  
  
## Dependencies  
  
+ [express](https://github.com/expressjs/express) - The server for handling and routing HTTP requests
+ [express-jwt](https://github.com/auth0/express-jwt) - Middleware for validating JWT auth
+ [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - The jwt generator used by auth
+ [mongoose](https://github.com/Automattic/mongoose) - For modeling and mapping MongoDB data to javascript
+ [passport](https://github.com/jaredhanson/passport) - For handling auth
+ [nanoid](https://github.com/ai/nanoid) - For generating url-frendly id stings

## Application Structure  
  
- `index.js` - The entry point to app, defines express server and create connection to MongoDB using mongoose. It also requires config, models and routes.
- `config/` - The folder contains configuration for passport
- `routes/` - The folder contains the route definitions to app API.
- `models/` - The folder contains the schemas definitions for mongoose models
- `middlewares/` - The folder contains the express-jwt middlewares for auth 
  
## Authentication  
  
Requests are authenticated using the `Authorization` header with a valid JWT. There're two express middlewares in `middlewares/auth.js` that used to authenticate requests. The `required` middleware configures the `express-jwt` middleware using  app's secret and will return a 401 status code if the request cannot be authenticated. The payload of the JWT can then be accessed from `req.payload` in the endpoint. The `optional` middleware configures the `express-jwt` in the same way as `required`, but will *not* return a 401 status code if the request cannot be authenticated.

