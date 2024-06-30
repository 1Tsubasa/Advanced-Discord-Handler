const { EmbedBuilder } = require("pwss");

module.exports = {
    name: "messageCreate",
    once: false,
    run: async (client, message) => {
        if (!message.guild) return;
        if (message.author.bot) return;

        try {
            let prefix = await client.db.get(`prefix_${client.user.id}_${message.guild.id}`) || client.config.prefix;
            client.prefix = prefix;
            client.color = await client.db.get(`color_${message.guild.id}`) || client.config.color;
            let lang = await client.db.get(`lang_${message.guild.id}`) || client.config.defaultLang;
            let langdb = await client.lang.get(lang);
            let foot = await client.db.get(`footer_${client.user.id}`) || { text: null, icon_url: null };

            if (!foot.text || !foot.icon_url) {
                client.footer = client.config.footer;
            } else {
                client.footer = foot;
            }

            let thumb = await client.db.get(`thumbnail_${client.user.id}`) || { icon: null };

            if (!thumb.icon) {
                client.thumbnail = client.user.displayAvatarURL({ dynamic: true });
            } else {
                client.thumbnail = thumb.icon;
            }

            if (message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>`) {
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: client.user.username,
                        iconURL: client.user.displayAvatarURL({ dynamic: true }),
                    })
                    .setColor(client.color)
                    .setDescription(`${await langdb.prefix} \`${prefix}\``)
                    .setTimestamp();

                if (client.footer.text && client.footer.icon_url) {
                    embed.setFooter({
                        text: client.footer.text,
                        iconURL: client.footer.icon_url,
                    });
                }

                if (client.thumbnail) {
                    embed.setThumbnail(client.thumbnail);
                }

                return message.reply({ embeds: [embed] });
            }

            const escapeRegex = (str) => {
                if (typeof str !== 'string') {
                    console.error(`Expected a string but got ${typeof str}:`, str);
                    return '';
                }
                return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            };

            const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
            if (!prefixRegex.test(message.content)) return;

            const [, matchedPrefix] = message.content.match(prefixRegex);
            const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);
            const commandName = args.shift()?.toLowerCase().normalize();
            if (!commandName) return;

           

            const cmd = client.commands.get(commandName) || client.aliases.get(commandName);
            if (!cmd) return;

            if (cmd.guildOnly && message.channel.type === "dm") {
                return;
            }
            if (cmd.devOnly && !client.config.clarity.devs.includes(message.author.id)) {
                return;
            }
            if (cmd.buyerOnly && !client.config.buyer.includes(message.author.id)) {
                return;
            }
            if (cmd.bumpOnly && !client.config.owner.includes(message.author.id)) {
                return;
            }
            if (cmd.topGgOnly && !client.config.topGg.includes(message.author.id)) {
                return;
            }
            if (cmd.premiumOnly && !client.config.premium.includes(message.author.id)) {
                return;
            }
            if (cmd.guildOwnerOnly && message.guild.ownerId !== message.author.id) {
                return;
            }
            if (cmd.nsfwOnly && !message.channel.nsfw) {
                return;
            }

            if (cmd.cooldown) {
                if (client.cooldowns.has(`${cmd.name}.${message.author.id}`)) {
                    const timeLeft = (client.cooldowns.get(`${cmd.name}.${message.author.id}`) - Date.now()) / 1000;
                    return message.reply({ content: `Veuillez attendre ${timeLeft.toFixed(1)} secondes avant d'utiliser cette commande.` });
                } else {
                    client.cooldowns.set(`${cmd.name}.${message.author.id}`, Date.now() + cmd.cooldown);
                    setTimeout(() => {
                        client.cooldowns.delete(`${cmd.name}.${message.author.id}`);
                    }, cmd.cooldown);
                }
            }

            // Execute the command if all checks pass
            try {
                cmd.run(client, message, args);
            } catch (error) {
                console.error(error);
            }
        } catch (error) {
            console.error(error);
        }
    }
};
