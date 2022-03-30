const express = require('express');
const mongoose = require("mongoose");
const path = require('path');
//const db = require('./config/connection');
const routes = require('./routes');
const {typeDefs, resolvers} = require("./schemas")
const {ApolloServer} = require("apollo-server-express");
const { authMiddleware } = require('./utils/auth');
const app = express();
const PORT = process.env.PORT || 3001;
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/google-books", { useNewUrlParser: true }); 

const startServer = async()=>{

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context:authMiddleware
  })

  await server.start()
  server.applyMiddleware({app})
  console.log("graph ql should be online now!!!")

}

startServer();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get("*",(req,res)=>{
    res.sendFile(path.join(path.join(__dirname, '../client/build/index.html')))
  })
}

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useFindAndModify: false
});


app.listen(PORT, () => {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});