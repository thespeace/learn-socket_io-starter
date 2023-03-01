/*
    io function?
    port, ws를 작성할 필요없이, 자동으로 socket.io를 실행하고 있는 서버를 찾아 연결해 줄 것이다.
    즉 자동으로 back-end socket.io와 연결 해주는 기본 제공 function이다.

*/
const socket = io();