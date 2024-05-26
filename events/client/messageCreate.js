const { MessageEmbed } = require("discord.js")
module.exports = {
    name: "messageCreate",
    once: false,
    run: async (client, message) => {
        if (!message.guild) return;
        if (message.author.bot) return;
        let guildData;
        let startAt = Date.now()
        let prefix;
        if (client.data2.get(`prefix_${message.guild.id}`)) {
            prefix = client.data2.get(`prefix_${message.guild.id}`)
        } else {
            prefix = client.config.prefix;
        }
        client.prefix = prefix
        client.color = await client.settings.get(`color_${message.guild.id}`) || client.config.color
        let lang = client.settings.get(`lang_${message.guild.id}`) || client.settings.get(`lang_${message.guild.id}`) || client.config.defaultLang;
        let langData = await client.lang.get(lang);
        let foot = client.settings.get(`footer_${client.user.id}`) || {
            text: null,
            icon_url: null
        }


        if (!foot || !foot.text || !foot.icon_url) {
            client.footer = client.config.footer;
        } else {
            client.footer = foot;
        }

        let thumb = client.settings.get(`thumbnail_${client.user.id}`) || {
            icon: null
        }

        if (!thumb || !thumb.icon) {
            client.thumbnail = client.user.displayAvatarURL({ dynamic: true });
        } else {
            client.thumbnail = thumb;
        }


        if (
            message.content === `<@${client.user.id}>` ||
            message.content === `<@!${client.user.id}>`
        ) {
            const embed = new MessageEmbed()
            embed.setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
            embed.setColor(client.color)
            embed.setDescription(`${await langData.prefix} \`${prefix}\``)
            embed.setTimestamp()
            if (client.footer.text && client.footer.icon_url){
                embed.setFooter(client.footer.text, client.footer.icon_url)
            }
            if (client.thumbnail && client.thumbnail.icon){
                embed.setThumbnail(client.thumbnail.icon)
            }
            message.reply({
                embeds: [embed]
            })
        }

        if (!message.content.startsWith(prefix) || message.content === prefix || message.content.startsWith(prefix + ' ')) {
            if (!message.content.startsWith(`<@${client.user.id}>`) && !message.content.startsWith(`<@!${client.user.id}>`)) {
                return;
            }
        }
        const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
        if (!prefixRegex.test(message.content)) return;
        const [, matchedPrefix] = message.content.match(prefixRegex);
        const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);
        const commandName = args.shift()?.toLowerCase().normalize();
        if (!commandName) return;
        
        const cmd = client.commands.get(commandName) || client.aliases.get(commandName);
        if (!cmd) return;
        if (cmd.guildOnly && message.channel.type === "dm") {
            return message.reply({
                content: "Cette commande ne peut être utilisée que dans un serveur.",
            });
        }
        if (cmd.devOnly &&!client.config.devs.includes(message.author.id)) {
            return message.reply({
                content: "Cette commande ne peut être utilisée que par les développeurs.",
            });
        }
        if (cmd.buyerOnly &&!client.config.buyer.includes(message.author.id)) {
            return message.reply({
                content: "Cette commande ne peut être utilisée que par le buyer.",
            });
        }

        if (cmd.guildOwnerOnly && !message.guild.ownerId === message.author.id) {
            return message.reply({
                content: "Cette commande ne peut être utilisée que par le propriétaire du serveur.",
            });
        }
        if (cmd.nsfwOnly &&!message.channel.nsfw) {
            return message.reply({
                content: "Cette commande ne peut être utilisée que dans un salon nsfw.",
            });
        }

        if (cmd.cooldown) {
            if (client.cooldowns.has(`${cmd.name}.${message.author.id}`)) {
                const timeLeft = client.cooldowns.get(`${cmd.name}.${message.author.id}`) - Date.now();
                return message.reply({
                    content: `Veuillez attendre ${timeLeft / 1000} secondes avant d'utiliser cette commande.`,
                });
            } else {
                client.cooldowns.set(`${cmd.name}.${message.author.id}`, Date.now() + cmd.cooldown);
                setTimeout(() => {
                    client.cooldowns.delete(`${cmd.name}.${message.author.id}`);
                }, cmd.cooldown);
            }
        }

        if (cmd.userPermissions &&!message.member.permissions.has(cmd.userPermissions)) {
            return message.reply({
                content: "Vous n'avez pas la permission requise pour utiliser cette commande.",
            });
        }
        if (cmd.botPermissions &&!message.guild.me.permissions.has(cmd.botPermissions)) {
            return message.reply({
                content: "Je n'ai pas la permission requise pour utiliser cette commande.",
            });
        }

        cmd.run(client, message, args);



    }
}