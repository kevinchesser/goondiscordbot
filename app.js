var Discordie = require("discordie");
var client = new Discordie();
var request = require('request');
var bodyParser = require('body-parser');

var cryptoChannel;
var cryptoChannelString = "";
var csgoChannel;
var csgoChannelString = "";


client.connect({
	token: ""
});

client.Dispatcher.on("GATEWAY_READY", e => {
		initBot();
		console.log("Connected as: " + client.User.username);
});

client.Dispatcher.on("MESSAGE_CREATE", e => {
	if(e.message.channel.id == cryptoChannel){
		if(e.message.content.substring(0, 1) == "!"){
			var currencyName = e.message.content.substring(1, e.message.content.length);
			if(currencyName === "golem"){
				currencyName = "golem-network-tokens";
			}
			if(currencyName === "eth"){
				currencyName = "ethereum";
			}
			if(currencyName === "ltc"){
				currencyName = "litecoin";
			}
			var url = 'https://api.coinmarketcap.com/v1/ticker/' +
				currencyName + '/';
			request(url, function(error, response, body) {
				if(error){
					cryptoChannel.sendMessage(error);
				}
				var cryptoInfo = JSON.parse(body);
				if(body){
					if(cryptoInfo.error){
						cryptoChannel.sendMessage("Error, id not found");
					} else{
						cryptoChannel.sendMessage("Current " + cryptoInfo[0].symbol +
								" price: " + cryptoInfo[0].price_usd);
					}
				}
			});
		}
	}

	if(e.message.channel.id == csgoChannel){
		var steamId;
		var playerName = null;
		if(e.message.content == "!kevin"){
			steamId	= "76561198023398374";
			playerName = "Kevin";
		}
		if(e.message.content == "!cody"){
			steamId	= "76561198094143387";
			playerName = "Cody";
		}
		if(e.message.content == "!dalton"){
			steamId	= "76561198088007260";
			playerName = "Dalton";
		}
		if(e.message.content == "!sean"){
			steamId	= "76561198043652445";
			playerName = "Sean";
		}
		if(playerName != null){
			var url = "http://api.steampowered.com/ISteamUserStats/" +
				"GetUserStatsForGame/v0002/?appid=730&key=" +
				"&steamid=" + steamId;
			request(url, function(error, response, body) {
				if(error){
					csgoChannel.sendMessage(error);
				}
				var csgoInfo = JSON.parse(body);
				var kills;
				var deaths;
				if(csgoInfo){
					for(var i = 0; i < csgoInfo.playerstats.stats.length; i++){
						if(csgoInfo.playerstats.stats[i].name == "last_match_kills"){
							kills = csgoInfo.playerstats.stats[i].value;
						}
						if(csgoInfo.playerstats.stats[i].name == "last_match_deaths"){
							deaths = csgoInfo.playerstats.stats[i].value;
						}
					}
					csgoChannel.sendMessage(playerName + "'s most recent K/D: " +
						kills + "/" + deaths);
				}
			});
		}
	}
});

function initBot(){
	cryptoChannel = client.Channels.get(cryptoChannelString);
	csgoChannel = client.Channels.get(csgoChannelString);
}
