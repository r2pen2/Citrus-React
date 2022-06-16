const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser');
const dbManager = require('../modules/dbManager');
const bcrypt = require('bcrypt');
const { Client } = require('pg');
const e = require('express');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());

async function findUserById(id) {
  return new Promise((resolve, reject) => {
    console.log("Searching DB for all users where [id] = [" + id + "]");
  const queryString = "SELECT * FROM " + dbManager.USERTABLE + " WHERE id IN ('" + id + "');";
  console.log("QueryString: " + queryString);
  const client = new Client({
    connectionString: dbManager.CONNECTIONSTRING,
    ssl: {
      rejectUnauthorized: false
    }
  });
  client.connect();
  client.query(queryString, (err, res) => {
    client.end();
    if (err) {
      console.log(err.detail);
      reject(err.detail);
    }
    console.log("Fetch complete.")
    resolve(res.rows[0]);
  });
  });
}

async function findUserByPhoneNumber(num) {
  return new Promise((resolve, reject) => {
    console.log("Searching DB for all users where [phone_number] = [" + num + "]");
  const queryString = "SELECT * FROM " + dbManager.USERTABLE + " WHERE phone_number LIKE '" + num + "';";
  console.log("QueryString: " + queryString);
  const client = new Client({
    connectionString: dbManager.CONNECTIONSTRING,
    ssl: {
      rejectUnauthorized: false
    }
  });
  client.connect();
  client.query(queryString, (err, res) => {
    client.end();
    if (err) {
      console.log(err.detail);
      reject(err.detail);
    }
    console.log("Fetch complete.")
    resolve(res.rows[0]);
  });
  });
}

router.post("/get-user-by-id", async (req, res) => {
  const id = req.body.id;
  console.log("Searching DB for a user with id [" + id + "]...");
  let data = await findUserById(id);
  const user = {
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    phoneNumber: data.phone_number
  }
  const jsonContent = JSON.stringify(user);
  res.end(jsonContent);
});

router.post("/get-user-id-by-number", async (req, res) => {
  const num = req.body.phoneNumber;
  console.log("Searching DB for a user with phone_number [" + num + "]...");
  let data = await findUserByPhoneNumber(num);
  if (data) {
    const user = {
      id: data.id,
      firstName: data.first_name,
    }
    console.log(user)
    const jsonContent = JSON.stringify(user);
    res.end(jsonContent);
  } else {
    res.status = 404;
    res.end();
  }

});

router.post("/create-new-user", (req, res) => {
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }  
 
  // Hash pwd
  const saltRounds = 10;
  bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(req.body.password, salt, function(err, hash) {
          if (err) { 
              console.log("Bcrypt err: " + err) 
          } else {
              // Hashed password is only accessible from inside this callback
              const queryString = "INSERT INTO " + dbManager.USERTABLE + "(first_name, last_name, phone_number, password) VALUES ('" + capitalizeFirstLetter(req.body.firstName) + "','" + capitalizeFirstLetter(req.body.lastName) + "','" + req.body.phoneNumber + "','" + hash + "') RETURNING id;";
              console.log("QueryString: " + queryString);
              const client = new Client({
                connectionString: dbManager.CONNECTIONSTRING,
                ssl: {
                  rejectUnauthorized: false
                }
              });
              client.connect();
              client.query(queryString, (err, dbRes) => {
                client.end();
                if (err) {
                  console.log(err)
                } else {
                  console.log("New user created with ID [" + dbRes.rows[0].id + "].");
                  const jsonContent = JSON.stringify( {id: dbRes.rows[0].id });
                  res.end(jsonContent);
                }
              });
          }
      });
  });
})

module.exports = router