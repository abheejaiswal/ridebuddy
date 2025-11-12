
const http = require('http');
require('dotenv').config();
const app = require('./app')
const port = process.env.PORT || 5176








app.listen(port, () => {
    console.log('hejkyb');
    
    console.log(`Server is running on http://localhost:${port}`);
});