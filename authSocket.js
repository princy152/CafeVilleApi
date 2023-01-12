const http = require("http");
const socket = require("socket.io");
const { User, NotificationSchedule } = require("../carebeeAPI/Models/user");


let io;
module.exports.socketNotification = (server) => {
  io = socket(server);
  console.log('io Checkkkk', io)
  let clients = [];

  io.on("error", function (err) {
    console.log("SOCKET ERROR: ", err);
  });

  io.on("connect", function (socket) {
    // let userId;
    // let room;
    // const clientId = socket.id;
    // clients.push(clientId);
    console.log("Client CONNECTED >>>>>>>", clients);
    //testing of
    let count = 1;
    const internalRes = setInterval(() => {
      socket.emit("NotifyMe", {name: "nitin", count: count++});
    }, 2000)
  
    socket.on("NotificationSchedule", async function (data) {
      const packet = JSON.parse(data);
      // console.log("NotificationSchedule called: ", packet.userId);
      if ( packet && packet.userId ) {
        const roomName = 'room-' + packet.userId;
        // console.log("NotificationSchedule called:vweefwefuewg ", packet, roomName);
         await socketUserwisenotification(packet)
        // io.to(roomName).emit("aNotificationSchedule", notifyMe);
      }
      // socket.emit("NotificationSchedule", User.NotificationSchedule(packet))
      // responce(await User.NotificationSchedule(packet));
    });

    socket.on("disconnect", function () {
       clearInterval( internalRes);
      console.log(" CLIENT DISCONNECTED<<<<<<<<<<<");
      const idx = clients.findIndex((cid) => cid === clientId);
      clients.splice(idx, 1);
      // console.log('gameidClientId=', clients, gameId);
      // socket.leave(room);
    });
  });
};

//note:room created abd send alert msg

async function socketUserwisenotification(data) {
  if (data.length && data ) {
    const roomName = 'room-' + data.userId;
    var notifyMe = await User.NotificationSchedule(data)
    io.to(roomName).emit("socketUserwiseNotification", notifyMe);
  }
}
exports.socketUserwisenotification = socketUserwisenotification;
