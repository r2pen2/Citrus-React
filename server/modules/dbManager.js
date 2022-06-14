
const USERTABLE = 'users';
const DBUSER = 'r2pen2'
const DBPASSWORD = 'sop26Jmd!'
const DBHOST = 'citrus-financial.cyckglvgzvfw.us-east-1.rds.amazonaws.com';
const DBPORT = '5432';
const DBNAME = 'postgres';
const CONNECTIONSTRING = 'postgres://' + DBUSER + ':' + DBPASSWORD + '@' + DBHOST + ':' + DBPORT + '/' + DBNAME;

module.exports = {
    // Constants
    USERTABLE: USERTABLE,
    CONNECTIONSTRING: CONNECTIONSTRING,
}