const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const cronLib = require('./cron/AliasExpiration.js');
const cron = require('node-cron');

// Routes
const aliasRoutes = require('./routes/alias.js');
const authRoutes = require('./routes/auth.js');
const userRoutes = require('./routes/user.js')

const authMiddleWare = require('./middlewares/auth.js')

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

app.use('/api/aliases', aliasRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', authMiddleWare.validateWebToken,userRoutes);

app.use( (error,req,res,next)=> {
	const status = error.statusCode || 500;
	const name = error.name || 'Internal Server Error';
	const message = error.message || "The server has encountered an error."
	res.status(status).json({message: message, error:{name}});
})

//cron.schedule('* * * * *', cronLib.CheckExpiredAliases)

mongoose.connect(mongoUrl, mongoOptions).then( () => {
	const port = process.env.PORT || 3000;
	app.listen(port, () => console.log(`server is running on port ${port}`));
} ).catch(error => console.log(error));
