# Socket IO

##### 프론트와 백엔드 간 실시간 통신을 가능하게 해주는 프레임워크 또는 라이브러리로, 실시간, 양방향, event 기반의 통신을 가능하게 한다.
##### 그 중 Websocket은 통신을 제공하는 방법 중 하나로, 만일 어떠한 상황에 Websocket 이용이 불가능하다면, Socket IO는 계속 작동한다. 즉 "Websocket의 부가기능"이 아니다. 탄력성이 있다.
##### Socket IO는 실시간 통신 기능을 구현할때 더 편리한 코드를 제공하고, Websocket보다는 조금 더 무겁다.

---

## Setup!
```
npm init -y
npm i nodemon -D
npm i @babel/core @babel/cli @babel/node @babel/preset-env -D
npm i express
npm i pug
npm i socket.io
npm run dev
```
위와 같이 세팅에 필요한 모듈들을 설치한 후, ``babel.config.json``,``nodemon.json``, ``src/server.js``,``src/public/js/app.js``, ``src/views/home.pug`` 들의 설정을 해주어야 합니다. 자세한 사항은 각 파일을 확인!

## [공식홈페이지](https://socket.io/)