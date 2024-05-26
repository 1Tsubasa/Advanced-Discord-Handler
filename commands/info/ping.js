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
    cooldown: 5000,
    userPermissions: [],
    botPermissions: [],
    ownerOnly: false,
    toggleOff: false,
    topGgOnly: false,
    bumpOnly: false,
    guildOwnerOnly: false,
    run: async(client, message) => {
      const embed = new MessageEmbed()
    .addField("Ping", `Calcul en cours`, true)
          .setTitle(`🏓 Ping!`)
          .addField("\`Latence Bot\`", `${client.ws.ping}ms`, true)
          .setFooter(client.footer.text, client.footer.icon_url)
          .setThumbnail(client.thumbnail.icon)
          .setColor(client.color);
      const msg = await message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      const embed2 = new MessageEmbed()
          .setTitle(`🏓 Pong!`)
          .addField("\`API Discord\`", `${msg.createdAt - message.createdAt + "ms"}`)
          .addField("\`Latence Bot\`", `${client.ws.ping}ms`)
          .setFooter(client.footer.text, client.footer.icon_url)
          .setThumbnail(client.thumbnail.icon)
          .setColor(client.color);
      return msg.edit({ embeds: [embed2] })

    }
  }
