const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose'); 
const dotenv = require('dotenv');
const User = require('./model/User');

const auth = require('./routes/auth');
const posts = require('./routes/posts');

const port = process.env.PORT || 3000;
const host = '0.0.0.0';

const app = express();

dotenv.config();

// const db_url = process.env.DB_URL;
const db_url = 'mongodb://localhost:27017/auth_node';

mongoose.connect(db_url, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true 
    }, 
    (err) => {
        console.log('Connected to DB');
    }
);

//Middlewares
//For sercurity
app.use(cors());

//For logging
app.use(morgan('dev'));

//For json
app.use(express.json());

//Secure routes middleware
app.use('/auth', auth);
app.use('/posts', posts);

//Routers
app.get('/', (req, res) => {
    User.find({}, 'name email date', (err, user) => res.json(user)); 
});


app.listen(port, host,() => console.log(`Listening on http://${host}:${port}`));