var Discordie = require("discordie");
var client = new Discordie();

var cryptochannel;

client.connect({
    token: ""
});

client.Dispatcher.on("GATEWAY_READY", e => {
        initBot();
        console.log("Connected as: " + client.User.username);
});

client.Dispatcher.on("MESSAGE_CREATE", e => {
    if(e.message.channel.id == ""){
        if(e.message.content == "ping"){
            testChannel.sendMessage("pong");
        }
        console.log(e.message);
    }
});

function initBot(){
    cryptochannel = client.Channels.get("");
}
