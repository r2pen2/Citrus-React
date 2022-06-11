const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgres://vkomrkzyjwznxo:76441366b18f5c2ad63967ed8ba1f101382fc2e7701b8739231c0e05dcb5fe23@ec2-54-227-248-71.compute-1.amazonaws.com:5432/df92gisku1o20f',
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

function getAllUsers() {
    client.query('SELECT * from login_user;', (err, res) => {
        if (err) throw err;
        for (let row of res.rows) {
          console.log(JSON.stringify(row));
        }
        client.end();
    });
}

module.exports = {
    getAllUsers: getAllUsers
}