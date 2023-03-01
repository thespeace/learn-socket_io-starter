import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public",express.static(__dirname+"/public"));
app.get("/",(req, res) => res.render("home"));
app.get("/*",(req, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer); //socket.io를 설치해주는 것 만으로 url/socket.io/socket.io.js를 제공해준다.
                                       //그 이유는 socketIO는 websocket의 부가기능이 아니기 때문에,  websocket을 사용할 수 없을때 이것들을 사용해 도와준다.(재연결 같은 기능들..)
                                       // go to ==> "home.pug"
wsServer.on("connection", socket => {
    console.log(socket); // **websocket이 아닌 socketIO의 socket**으로 connection 받을 준비 완료.
})

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);
