const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());
const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgres://vkomrkzyjwznxo:76441366b18f5c2ad63967ed8ba1f101382fc2e7701b8739231c0e05dcb5fe23@ec2-54-227-248-71.compute-1.amazonaws.com:5432/df92gisku1o20f',
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

function findAllUsersBy(searchCondition, value) {
  console.log("Searching DB for all users where [" + searchCondition + "] = [" + value + "]");
  const queryString = "SELECT * from login_user WHERE " + searchCondition + " LIKE '" + value + "';";
  console.log("QueryString: " + queryString);
  client.query(queryString, (err, res) => {
    if (err) {
      console.log(err);
    }
    console.log(res)
    //return(res.rows)
  });
  client.end();
}

router.post("/get-user-by-number", (req, res) => {
  const num = req.body.phoneNumber;
  console.log("Searching DB for a user with number [" + num + "]...");
  //const data = findAllUsersBy("phone_number", num);
  //const jsonContent = JSON.stringify(data);
  //res.end(jsonContent);
});

router.get("/ping", (req, res) => {
  res.send("Pong!")
});


module.exports = router