const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const dbConfig = require('../config/database.config.js')


const app = express();
app.use(bodyParser.json());

require('../routes/api.routes.js')(app);


mongoose.connect(dbConfig.url, {useNewUrlParser: true, useUnifiedTopology: true}).then( () => { 
    app.listen(6969, () => console.log('server is running'));    
} ).catch(error => console.log(error));