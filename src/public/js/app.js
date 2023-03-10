/*
    io function?
    port, ws를 작성할 필요없이, 자동으로 socket.io를 실행하고 있는 서버를 찾아 연결해 줄 것이다.
    즉 자동으로 back-end socket.io와 연결 해주는 기본 제공 function이다.
*/
const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message){
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function handleMessageSubmit(event){
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", input.value, roomName, () => {
        addMessage(`You : ${value}`);
    });
    input.value = "";
}

function handleNicknameSubmit(event){
    event.preventDefault();
    const input = room.querySelector("#name input");
    socket.emit("nickname", input.value);
}

function showRoom(){
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room : ${roomName}`

    const msgForm = room.querySelector("#msg");
    msgForm.addEventListener("submit", handleMessageSubmit);
    const nameForm = room.querySelector("#name");
    nameForm.addEventListener("submit", handleNicknameSubmit);
}

function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room",{payload:input.value}, 1, "hello", true, input.value, showRoom)
                                            //메세지를 send할 필요 없이 특정한 어떤 event던지 emit해주면 서버로 전송 할 수 있다.
                                            //그리고 두번째 argument로 어떤 타입으로든 보낼 수 있고, 한가지만 보내야한다는 제약도 없다.(websocket은 text만 가능)
                                            //그리고 **마지막** argument에는 서버에서 function(callback function)을 호출해서 프론트에서 해당 함수를 실행할 수 있다.
                                            // 마지막 argument에 콜백함수를 사용할 때, 절대!! 백엔드서버에서 함수가 실행되도록 하면 안된다. 보안에 심각한 문제가 생길 수도 있다.
                                            // 이 모든 것들을 emit만 해주면 socketIO가 알아서 핸들링 해준다.
                                            /*
                                                *websocket vs socket.io
                                                websocket은 message라는 event를 사용했어야 하는데, socketio는 원하는 이벤트를 서버에 전달 할 수있게 되었다.
                                                websocket은 string type의 data만 전송 가능 했는데, socketIO는 object 형식으로 전달 가능해졌다.(socketIO의 핸들링 덕분)
                                            */
    roomName = input.value;
    input.value = ""
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room : ${roomName} (${newCount})`
    addMessage(`${user} arrived! 😀`);
})// on : 백엔드 서버에서 emit한 함수를 프론트에서 받을 수 있다.

socket.on("bye", (left, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room : ${roomName} (${newCount})`
    addMessage(`${left} left.. 😥`);
})

socket.on("new_message", addMessage); // === (msg) => { addMessage(msg) };
// socket.on("room_change", console.log); // === (msg) => console.log(msg);
socket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector("ul");
    roomList.innerText = "";
    if(rooms.length === 0){
        return;
    }
    rooms.forEach(room => {
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    })
});