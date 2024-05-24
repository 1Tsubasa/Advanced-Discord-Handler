const {
    Client,
    Message,
    MessageEmbed
  } = require('discord.js');

  module.exports = {
    name: "ping",
    aliases: ["latency"],
    usage: '',
    description: "Gives you information on how fast the Bot can respond to you",
    category: "info",
    cooldown: 10,
    userPermissions: "",
    botPermissions: "",
    ownerOnly: false,
    toggleOff: false,
    
  }