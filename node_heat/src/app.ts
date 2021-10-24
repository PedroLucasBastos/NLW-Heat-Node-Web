import "dotenv/config";
import express from "express";
import { router } from "./routes";
import http from "http";
import cors from "cors";
import { Server } from "socket.io"


const app = express();
app.use(cors());// habilitando o cors para o app.ts

const serverHttp = http.createServer(app); //criando o server e a coneção com o web socket
const io = new Server(serverHttp, {
    cors: {
        origin: "*"//isso permite que outras fontes, como frontend e mobal se conectem, tanto com o nosso http, como o express, e tanto como com o web socket
    }
});

io.on("connection", socket => {
    console.log(`Usuario connectado no socket${socket.id}`); //essa função fica ouvindo as conecções 
});

app.use(express.json());


app.use(router);

app.get("/github", (request, response) => {
    response.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`); //pedido de permição para a autenticação na aplicação
});

app.get("/signin/callback", (request, response) => {
    const { code } = request.query; // comando responsavel por pegar o codigo do usuario que o github passa.

    return response.json(code);
});

export { serverHttp, io }
