import axios from 'axios';

// Set baseURL for axios calls to server
// This will be changed once the server hosted somewhere other than my machine
export default axios.create({
    baseURL: 'http://localhost:3001'
});