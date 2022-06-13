const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser');
const dbManager = require('../modules/dbManager');
const bcrypt = require('bcrypt');const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgres://vkomrkzyjwznxo:76441366b18f5c2ad63967ed8ba1f101382fc2e7701b8739231c0e05dcb5fe23@ec2-54-227-248-71.compute-1.amazonaws.com:5432/df92gisku1o20f',
  ssl: {
    rejectUnauthorized: false
  }
});
client.connect();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());

function findAllUsersBy(searchCondition, value) {
  console.log("Searching DB for all users where [" + searchCondition + "] = [" + value + "]");
  const queryString = "SELECT * from " + dbManager.USERTABLE + " WHERE " + searchCondition + " LIKE '" + value + "';";
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

router.post("/create-new-user", (req, res) => {
    // Hash pwd
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            if (err) { 
                console.log("Bcrypt err: " + err) 
            } else {
                // Hashed password is only accessible from inside this callback
                const queryString = "INSERT INTO " + dbManager.USERTABLE + "(first_name, last_name, phone_number, password) VALUES ('" + req.body.firstName + "','" + req.body.lastName + "','" + req.body.phoneNumber + "','" + hash + "') RETURNING id;";
                console.log("QueryString: " + queryString);
                client.query(queryString, (err, dbRes) => {
                  if (!err) {
                    client.end();
                    console.log("New user created with ID [" + dbRes.rows[0].id + "].");
                    const jsonContent = JSON.stringify( {id: dbRes.rows[0].id });
                    res.end(jsonContent);
                  }
                });
            }
        });
    });
})

router.get("/ping", (req, res) => {
  res.send("Pong!")
});


module.exports = router