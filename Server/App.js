import 'dotenv/config';
// import counterRoutes from './counter-routes';
// import {app,PORT} from './server-setup';
import queryString from 'query-string'
import cookieParser from 'cookie-parser'
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import axios from 'axios';
import jwt from 'jsonwebtoken'

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));
app.use(express.json());
app.use(cookieParser());

// MongoDB Connection
mongoose
  .connect('mongodb://0.0.0.0:27017/counter_db')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

  const counterSchema = new mongoose.Schema({
    count: { type: Number, default: 0 },
    mycount: { type: Number, default: 0 },
    email:{type: String}
 }, { collection: 'counters' });
  
const Counter = mongoose.model('Counter', counterSchema);
  
const config = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    authUrl: 'https://accounts.google.com/o/oauth2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    redirectUrl: process.env.REDIRECT_URL,
    clientUrl: process.env.CLIENT_URL,
    tokenSecret: process.env.TOKEN_SECRET,
    tokenExpiration: 1000000000000000,
    postUrl: 'https://jsonplaceholder.typicode.com/posts',
}

const authParams = queryString.stringify({
    client_id: config.clientId,
    redirect_uri: config.redirectUrl,
    response_type: 'code',
    scope: 'openid profile email',
    access_type: 'offline',
    state: 'standard_oauth',
    prompt: 'consent',
})

const getTokenParams = (code) =>
    queryString.stringify({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: config.redirectUrl,
    })

    const auth = (req, res, next) => {
        try {
            const token = req.cookies.token
            if (!token) return res.status(401).json({ message: 'Unauthorized' })
            jwt.verify(token, config.tokenSecret)
            return next()
        } catch (err) {
            console.error('Error: ', err)
            res.status(401).json({ message: 'Unauthorized' })
        }
    }
app.get('/auth/url', (_, res) => {
    res.json({
        url: `${config.authUrl}?${authParams}`,
    })
})


app.get('/auth/token', async (req, res) => {
    const { code } = req.query
    if (!code) return res.status(400).json({ message: 'Authorization code must be provided' })
    try {
        // Get all parameters needed to hit authorization server
        const tokenParam = getTokenParams(code)
        // Exchange authorization code for access token (id token is returned here too)
        // console.log(`${config.tokenUrl}?${tokenParam}`);
        const {
            data: { id_token },
        } = await axios.post(`${config.tokenUrl}?${tokenParam}`)
        if (!id_token) return res.status(400).json({ message: 'Auth error' })
        // Get user info from id token
        const { email, name, picture } = jwt.decode(id_token)
        const user = { name, email, picture }
        // Sign a new token
        const token = jwt.sign({ user }, config.tokenSecret, { expiresIn: config.tokenExpiration })
        // Set cookies for user
        res.cookie('token', token, { 
            maxAge: config.tokenExpiration, 
            // httpOnly: true,
            domain: 'localhost', // Match the domain where React is served from
            path: '/', // Match the path of your React application
            sameSite: 'Lax'
            });
        // You can choose to store user in a DB instead
        res.json({ loggedIn: true, user:user })
    } catch (err) {
        console.error('Error: ', err)
        res.status(500).json({ message: err.message || 'Server error' })
    }
})

app.get('/auth/logged_in', (req, res) => {
    try {
        // Get token from cookie        
        const token = req.cookies.token
        if (!token) return res.json({ loggedIn: false })
        const { user } = jwt.verify(token, config.tokenSecret)
        const newToken = jwt.sign({ user }, config.tokenSecret, { expiresIn: config.tokenExpiration })
        // Reset token in cookie
        res.cookie('token', newToken, { 
            maxAge: config.tokenExpiration, 
            // httpOnly: true,
            domain: 'localhost', // Match the domain where React is served from
            path: '/', // Match the path of your React application
            sameSite: 'Lax'
            });
        res.json({ loggedIn: true, user })
    } catch (err) {
        res.json({ loggedIn: false })
    }
})

app.post('/auth/logout', (_, res) => {
    // clear cookie
    res.clearCookie('token').json({ message: 'Logged out' })
})

app.get('/api/counter', async (req, res) => {

    try {
        
        const counter = await Counter.findOne();

        res.json(counter);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.get('/api/mycounter', async (req, res) => {
    // console.log("Reached GET method")
    try {
        
        const counter = await Counter.findOne();
        // console.log(counter);
        res.json(counter);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});
app.post('/api/counter/increment', async (req, res) => {
    try {
        let counter = await Counter.findOne();
        if (!counter) {
            counter = new Counter();
        }
        counter.count++;
        await counter.save();
        res.json(counter);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});
app.post('/api/counter/myincrement', async (req, res) => {
    try {
        let counter = await Counter.findOne();
        if (!counter) {
            counter = new Counter();
        }
        counter.mycount++;
        await counter.save();
        res.json(counter);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.post('/api/counter/decrement', async (req, res) => {
    try {
        let counter = await Counter.findOne();
        if (!counter) {
            counter = new Counter();
        }
        counter.count--;
        await counter.save();
        res.json(counter);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});
app.post('/api/counter/mydecrement', async (req, res) => {
    try {
        let counter = await Counter.findOne();
        if (!counter) {
            counter = new Counter();
        }
        counter.mycount--;
        await counter.save();
        res.json(counter);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// app.use(counterRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
