// Library imports
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { Client } = require('pg');

// Module imports
const dbManager = require('../modules/dbManager');

// Set up router
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());

/**
 * Finds a user on the DB by their id and returns the first result.
 * @param {Number} id userId to be fetched from the database 
 * @returns {Object} the first user returned from the database (and hopefully only becuase id is unique)
 */
async function findUserById(id) {
  return new Promise((resolve, reject) => {
    if (!id) { 
      reject("No ID provided!"); 
    } else {
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
    }
  });
}

/**
 * Finds a user on the DB by their id and returns their hashed password.
 * @param {Number} id userId to find password for
 * @returns {Object} a row containing just the user's password (Not a string, though! It's still an object!)
 */
async function findHashByUserId(id) {
  return new Promise((resolve, reject) => {
    if (!id) { 
      reject("No ID provided!"); 
    } else {
      console.log("Fetching hash for user where [id] = [" + id + "]");
      const queryString = "SELECT password FROM " + dbManager.USERTABLE + " WHERE id IN ('" + id + "');";
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
    }
  });
}

/**
 * Finds a user on the DB by their phone Number and returns the first result.
 * @param {Number} num phone number to be fetched from the database 
 * @returns {Object} the first user returned from the database (and hopefully only becuase phone_number is unique)
 */
async function findUserByPhoneNumber(num) {
  return new Promise((resolve, reject) => {
    if (!num) { 
      reject("No phone number provided!"); 
    } else {
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
    }
  });
}

/**
 * Receive a POST request at "/database/get-user-by-id" containing a user id.
 * Sends an object to the client representing the user returned from the database.
 * This just sends back front-facing stuff. No passwords!
 */
router.post("/get-user-by-id", async (req, res) => {
  // Pull params from HTTP request
  const id = req.body.id;
  console.log("Searching DB for a user with id [" + id + "]...");
  let data = await findUserById(id);
  // Build a new user object that doesn't include sensitive / unnecessary information
  const user = {
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    phoneNumber: data.phone_number
  }
  const jsonContent = JSON.stringify(user);
  res.end(jsonContent);
});

/**
 * Receive a POST request at "/database/get-user-id-by-number" containing a phone number.
 * This function is only used during the login process, but I thought it made more sense to put
 * it in database so that we didn't have to make a pg client in the login route.
 * Sends an object to the client representing the user's id and their first name.
 */
router.post("/get-user-id-by-number", async (req, res) => {
  // Pull params from HTTP request
  const num = req.body.phoneNumber;
  console.log("Searching DB for a user with phone_number [" + num + "]...");
  let data = await findUserByPhoneNumber(num);
  if (data) {
    // Build a new user object that doesn't include sensitive / unnecessary information
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

/**
 * Receive a POST request at "/database/check-password" containing a user id and a password.
 * Checks whether or not the password in the request is equal to the one hashed in the database.
 * Returns an object containing a string representing whether or not the password was correct.
 */
router.post("/check-password", async (req, res) => {
  // Pull params from HTTP request
  const pass = req.body.password;
  const id = req.body.userId;
  let data = await findHashByUserId(id);
  if (data) {
    bcrypt.compare(pass, data.password, (err, match) => {
      if (err) {
        console.log(err);
      } else {
        if (match) {
          // Send true back to client
          const jsonContent = JSON.stringify({ result: 'accepted' });
          res.end(jsonContent);
        } else {
          // Send false back to client
          const jsonContent = JSON.stringify({ result: 'denied' });
          res.end(jsonContent);
        }
      }
    })
  } else {
    res.status = 404;
    res.end();
  }
});

/**
 * Receive a POST request at "/database/create-new-user" all of the information needed to make a new user.
 * Hashes the password, inserts the user into the database, and sends an object back to the client containing the new user's id
 */
router.post("/create-new-user", (req, res) => {
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }  
 
  // Hash pwd
  const saltRounds = 10; // Don't change this!
  bcrypt.genSalt(saltRounds, function(err, salt) {
    // Hash password and insert user
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      if (err) { 
          console.log("Bcrypt err: " + err) 
      } else {
        // Hashed password is only accessible from inside this callback
        // Pull params from HTTP request and use them to build a quertString
        const queryString = "INSERT INTO " + dbManager.USERTABLE + "(first_name, last_name, phone_number, password) VALUES ('" + capitalizeFirstLetter(req.body.firstName) + "','" + capitalizeFirstLetter(req.body.lastName) + "','" + req.body.phoneNumber + "','" + hash + "') RETURNING id;";
        console.log("QueryString: " + queryString);
        const client = new Client({
          connectionString: dbManager.CONNECTIONSTRING,
          ssl: {
            rejectUnauthorized: false
          }
        });
        
        // Connect to db and send query
        client.connect();
        client.query(queryString, (err, dbRes) => {
          client.end();
          if (err) {
            console.log(err)
          } else {
            console.log("New user created with ID [" + dbRes.rows[0].id + "].");
            // Make an object with the new id and send it back to the client
            const jsonContent = JSON.stringify( {id: dbRes.rows[0].id });
            res.end(jsonContent);
          }
        });
      }
    });
  });
});

module.exports = {
  router: router,
  findUserById: findUserById,
  findHashByUserId: findHashByUserId,
  findUserByPhoneNumber: findUserByPhoneNumber,
}