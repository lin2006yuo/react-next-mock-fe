const bodyParser = require("body-parser")
const path = require("path")
const fs = require("fs")
const cors = require("cors")
const express = require('express')
const list = require('./routes/list')
const detail = require('./routes/detail')

module.exports = (app) => {
  try {
    fs.accessSync(`${process.cwd()}/server/mock_db/app.sqlite`, fs.F_OK)
    console.log("connecting the mock database")
  } catch (e) {
    fs.mkdirSync("mock_db")
    fs.copyFileSync(
      path.resolve(__dirname, `db/app.sqlite`),
      path.resolve(__dirname, `mock_db/app.sqlite`),
      function (err) {
        if (err) {
          console.log("create mock database failed.")
        } else {
          console.log("create mock database successfully.")
        }
      }
    )
  }
  app.use(bodyParser.json())
  // app.use(cors())
  // app.use(function(req, res, next) {
  //   res.header('Access-Control-Allow-Credentials', 'true');
  //   // res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  //   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin");
  //   next();
  // });
  app.use(express.static(__dirname + "/public"))
  app.use('/api', [list, detail])
  // routes(app)
}
