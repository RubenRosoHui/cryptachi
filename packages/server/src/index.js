const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config({path:'.env.development.local'});

// Routes
const aliasRoutes = require('./routes/alias.js');
const authRoutes = require('./routes/auth.js');

const app = express();

// MongoDB Configuration
const mongoUrl = `mongodb://${process.env.MONGODB_HOSTNAME}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DBNAME}`;

var mongoOptions;
if(process.env.MONGODB_USER){
	mongoOptions = {
		auth: {
			user: process.env.MONGODB_USER,
			password: process.env.MONGODB_PASS,
		},
		useNewUrlParser: true,
		useUnifiedTopology: true
	};
}
else {
	mongoOptions = {
		useNewUrlParser: true,
		useUnifiedTopology: true
	};
}

// Middlewares
app.use(bodyParser.json());

app.use('/api/alias', aliasRoutes);
app.use('/api/auth', authRoutes);

mongoose.connect(mongoUrl, mongoOptions).then( () => {
	app.listen(process.env.PORT, () => console.log('server is running'));
} ).catch(error => console.log(error));
