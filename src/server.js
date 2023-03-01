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

wsServer.on("connection", (socket) => {
    // console.log(socket); // **websocket이 아닌 socketIO의 socket**으로 connection 받을 준비 완료, 또한 서버가 다운되면 자동으로 재연결을 계속 시도한다.
    socket.on("enter_room", (objectType,numberType,stringType,booleanType, roomName, done) => {
        console.log(objectType);
        console.log(numberType);
        console.log(stringType);
        console.log(booleanType);
        console.log(roomName);

        setTimeout(()=> { //주로 처리 비용이 크고 시간이 오래 걸리는 작업을 백엔드서버에서 완료 후 프론트에 전달하는 용도로 많이 사용한다.
            done("hello from the backend"); // argument를 fromt에 전달 할 수도 있다.
        }, 10000);
    });
});

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);
