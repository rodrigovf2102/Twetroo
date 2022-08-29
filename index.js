import express from "express";
import cors from 'cors';

const usuarios = [];
const tweets = [];
const server = express();
server.use(cors());
server.use(express.json());

server.post('/sign-up', (req, res) => {
    const { username, avatar } = req.body;
    if (username === undefined || avatar === undefined) {
        return res.status(400).send("Todos os campos são obrigatórios!");
    }
    if (!avatar.includes("https://")) {
        return res.sendStatus(401);
    }
    usuarios.push({ username,avatar });
    res.status(201).send("OK");
})

server.post('/tweets', (req, res) => {
    const { username, tweet } = req.body;
    if (username === undefined || tweet === undefined) {
        return res.status(400).send("Todos os campos são obrigatórios!");
    }
    if((usuarios.find(usuario=>usuario.username === username))===undefined){
        return res.sendStatus(401);
    }
    tweets.push({ username, tweet });
    res.status(201).send("OK");
})

server.get('/tweets', (req, res) => {
    const lastTweets = [];
    const tweet = {};
    for (let i = 0; i < 10; i++) {
        if (tweets[i] !== undefined) {
            tweet.username = tweets[i].username;
            tweet.tweet = tweets[i].tweet;
            let usuario = usuarios.find(usuario => usuario.username === tweet.username);
            tweet.avatar = usuario.avatar;
            lastTweets.push({ ...tweet });
        }
    }
    res.send(lastTweets);
})

server.get('/tweets/:username', (req, res) => {
    const username = req.params.username;
    const userTweets = tweets.filter(tweet => tweet.username === username);
    let user;
    if(userTweets.length!==0){
        user = usuarios.find(usuario=>usuario.username === userTweets[0].username);
    }
    if(userTweets.length === 0){ 
        return res.status(400).send("Usuário não encontrado")
    }
    for(let i=0;i<userTweets.length;i++){
        userTweets[i].avatar = user.avatar;
    }
    res.send(userTweets);
})


server.listen(5000);