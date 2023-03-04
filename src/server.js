import http from "http";
import SocketIO from "socket.io";
import express from "express";

/*
    room?
    socket IO에 내장되어 있는 기능으로, user가 website로 가면 방을 만들거나, 방에 참가할 수 있는 form을 보게 될 것이다.
    간단하게 방에 참가하거나 떠나는 것을 구현 가능하다. 또한 방에 메시지를 보내는 것 등등 다양한 기능 구현을 간단하게 할 수 있다.
*/
/*
    Adapter?
    현재 우리는 서버의 memory에서 im memory Adapter을 사용하고 있다. 만약 서버 3개를 생성한다면, 3개의 memory가 생기지만 서로 메시지를 주고 받거나 하는 둥 공유는 불가능하다.
    이러한 공유를 가능하게 해주는 것이, 해결방법이 바로 Adapter을 사용하는 것이다. 즉, 다른 서버들간의 실시간 어플리케이션을 동기화해주는 역할을 한다.
    규모가 큰 어플리케이션에서는 원활한 connection을 위해 많은 서버를 가지게 될 것이다. 그리고 3:10
        ex) MongoDB Adapter : MongoDB를 사용해서 서버간의 통신을 해준다. "A server" -> mongo adapter -> mongoDB -> mongo adapter -> "B server"

*/

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

function publicRooms(){
    const {
        sockets : {
            adapter : {sids, rooms}, /* wsServer.sockets.adapter로 부터 sids와 rooms를 가져와서-
                                       const sids = wsServer.socket.adapter.sids;
                                       const rooms = wsServer.socket.adapter.rooms;*/
        },
    } = wsServer;
    const publicRooms = [];
    rooms.forEach((_,key) => {
        if(sids.get(key) === undefined){ /*private rooms이 아닌 public rooms을 찾기*/
            publicRooms.push(key)
        }
    })
    return publicRooms;
}

function countRoom(roomName){
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;

}

wsServer.on("connection", (socket) => {
    // console.log(socket); // **websocket이 아닌 socketIO의 socket**으로 connection 받을 준비 완료, 또한 서버가 다운되면 자동으로 재연결을 계속 시도한다.
    // wsServer.socketsJoin("announcement") //모든 socket을 공지(announcement)방에 들어가게 만들어서 공지사항을 보낼 수도 있다.
    socket["nickname"] = "Anonymous";
    socket.onAny((event)=>{
        console.log(wsServer.socket.adapter); /*memory에 있는 Adapter을 확인 할 수 있다.
                                                    1.map에 있는 어플리케이션의 모든 rooms을 확인 할 수 있다.
                                                    2.sids(socket id)를 확인 할 수 있다.
                                              */
        console.log(`Socket Event:${event}`); // onAny : Socket에 있는 모든 event를 확인 할 수 있다.
    });
    socket.on("enter_room", (objectType,numberType,stringType,booleanType, roomName, done) => {
        // console.log(objectType);
        // console.log(numberType);
        // console.log(stringType);
        // console.log(booleanType);
        // console.log(roomName);

        // console.log(socket.id); //각 방(소켓)은 고유 방(소켓)의 id를 가지고 있다.
        // console.log(socket.rooms); //기본적으로 user은 이미 방에 들어가 있다. 이를 확인하기 위해서 rooms을 확인하면 된다.
        socket.join(roomName) // join만 해줌으로써 방(socket)에 참가할 수 있다.
        // console.log(socket.rooms);

        done();

        socket.to(roomName).emit("welcome" , socket.nickname, countRoom(roomName));// to emit : 자신을 제외한 방에 있는 모두에게 메시지를 보낼 수 있다.
        wsServer.sockets.emit("room_change", publicRooms());// 모든 소켓에 방 생성 메시지 보내기.


        // setTimeout(()=> { //주로 처리 비용이 크고 시간이 오래 걸리는 작업을 백엔드서버에서 완료 후 프론트에 전달하는 용도로 많이 사용한다.
        //     done("hello from the backend"); // argument를 fromt에 전달 할 수도 있다.
        // }, 10000);
    });
    socket.on("disconnecting", ()=>{ //disconnecting : 고객이 접속을 중단할 것이지만 아직 방을 완전히 나가지는 않은 상태.
        socket.rooms.forEach((room) =>
            socket.to(room).emit("bye", socket.nickname,  countRoom(room) -1)
        );
    });
    socket.on("disconnect", ()=>{ //disconnect : 연결이 완전히 끊어졌다는 것
        wsServer.sockets.emit("room_change", publicRooms());
    });
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname} : ${msg}`);
        done();
    });
    socket.on("nickname", (nickname) => socket["nickname"] = nickname);
});

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);


