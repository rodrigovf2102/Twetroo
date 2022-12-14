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
        return res.status(401).send("Formato de avatar inválido");
    }
    if(usuarios.find(usuario =>usuario.username === username)!== undefined){
        return res.status(401).send("Usuário já cadastrado");
    }
    usuarios.push({ username,avatar });
    res.status(201).send("OK");
})

server.post('/tweets', (req, res) => {
    const { tweet } = req.body;
    const { username } = req.headers
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
    let page = req.query.page;
    if(page===undefined){
        page = 1;
    }
    page = parseInt(page);
    if(page<0 || isNaN(page)){
        return res.status(401).send("Informe uma página válida");
    } 
    const lastTweets = [];
    const tweet = {};
    const reverseTweets = [...tweets];
    reverseTweets.reverse();
    for (let i = (page-1)*10; i < page*10; i++) {
        if (reverseTweets[i] !== undefined) {
            tweet.username = reverseTweets[i].username;
            tweet.tweet = reverseTweets[i].tweet;
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