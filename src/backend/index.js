require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');

const routes = require('./routes');
const errorHandler = require('./middlewares/error');
const sequelize = require('./models/index');

const app = express();

// Middlewares
app.use(morgan('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use(
	cors({
		origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
		methods: "GET,POST,PUT,PATCH,DELETE",
		credentials: true
	})
)

app.use(bodyParser.json()) // middleware to parse incoming data from HTTP request as JSON and convert them into JavaScript objects
app.use(bodyParser.urlencoded({extended: true})) // Midđleware to parses incoming data from HTTP requests as URL-encoded and converts them into JavaScript objects

// Static files
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    try {
        // await sequelize.authenticate();
        console.log('Database connected successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});