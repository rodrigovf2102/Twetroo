import express from "express";
import cors from 'cors';

const usuarios = [];
const tweets = [];
const server = express();
server.use(cors());
server.use(express.json());

server.get('/sign-up', (req, res) => {
    res.send("lalala");
    console.log(usuarios);
});
server.post('/sign-up', (req, res) => {
    if (req.body.username !== undefined) {
        if (req.body.avatar !== undefined) {
            if (req.body.avatar.includes("https://")) {
                usuarios.push({ ...req.body });
            }
        }
    }
    res.send("OK");
})

server.post('/tweets', (req, res) => {
    if (req.body.username !== undefined) {
        if (req.body.tweet !== undefined) {
            tweets.push({ ...req.body });
        }
    }
    res.send("OK");
})

server.get('/tweets', (req, res) => {
    const lastTweets = [];
    const tweet = {};
    for (let i = 0; i < 10; i++) {
        if(tweets[i] !== undefined) {
            tweet.username = tweets[i].username;
            tweet.tweet = tweets[i].tweet;
            let usuario = usuarios.find(usuario => usuario.username === tweet.username);
            tweet.avatar = usuario.avatar;
            lastTweets.push({...tweet});
        } 
    }
    res.send(lastTweets);
})

server.listen(5000);