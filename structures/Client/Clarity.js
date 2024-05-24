const {Collection, Client} = require('discord.js');
const {Database, Mongo, Pgp , Sequelize} = require("../handlers/Database")
const {Logger} = require('advanced-command-handler')
const fs = require('fs');
const Cluster = require("discord-hybrid-sharding");
const config = require('../config/index')
const logs = require('discord-logs');
class Clarity extends Client {
    constructor(options) {
        super(options);
        if (config.sharding) {
            this.cluster = new Cluster.Client(this);
        }
        this.setMaxListeners(0);
        this.cachedChannels = new Map()
        this.config = config;
        this.commands = new Collection();
        this.events = new Collection();
        this.aliases = new Collection();
        logs(this, {
            debug: true
        });
        this.cooldown = new Collection();
        this.data2 = new Database("Clarity2").useClarityDB();
        this.snipes = new Collection();
        this.snipesEdit = new Collection();
        this.unavailableGuilds = 0;
        this.Logger = Logger;
        this.functions = require("../functions/index")
        this.ms = require("../utils/ms")
        this.afk = require("../utils/afk");
        this.version = require("../config/version");
        this.lang = require("../utils/getLang")
        this.connectToken();
        this.initCommands();
        this.initEvents();
    }
    async initWebSocket() {
        const eventsF = fs.readdirSync('./events/webSocket').filter(file => file.endsWith('.js'));
        Logger.info(`Loading ${eventsF.length} webSocket Events`, `Starting`);
        for (const file of eventsF) {
            const eventFile = require(`../events/webSocket/${file}`);
            const Event = new eventFile(this);
            this.claritySocket.on(Event.name, (...args) => Event.run(this.claritySocket, this, ...args));
        }
    }

    async connectToken() {
        this.login(this.config.token)
        .then(() => {
            var x = setInterval(() => {
                if (this.ws.reconnecting || this.ws.destroyed) {
                    this.login(this.config.token).catch((err) => {
                        clearInterval(x);
                        Logger.error(`Erreur pendant la connexion au token : ${err}`);
                    });
                }
            }, 30000)
        })
            .catch((err) => {
                Logger.error(err);
                if(err?.code?.toLowerCase()?.includes("token")) return;
                setTimeout(() => {
                    this.connectToken();
                }, 10000)
            })
    }
    async refreshConfig() {
        delete this.config;
        delete require.cache[require.resolve("../config/index.js")];
        this.config = require("../config/index");
    }
    async initCommands() {
        const commandsF = fs.readdirSync('./commands')
        Logger.info(`Loading ${commandsF.length} commands`, `Starting`);
       for (const folder of commandsF) {
            const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
            for (const commandFile of commandFiles) {
                const command = require(`../../commands/${folder}/${commandFile}`);
                command.category = folder;
                command.commandFile = commandFile;
                this.commands.set(command.name, command);
                if (command.aliases && command.aliases.length > 0) {
                    for (const alias of command.aliases) {
                        this.aliases.set(alias, command.name);
                    }
                }
            }
            let finale = new Collection();
            this.commands.map(cmd => {
                if (finale.has(cmd.name)) return;
                finale.set(cmd.name, cmd);
                this.commands.filter((v) => v.name.startsWith(cmd.name) || v.name.endsWith(cmd.name)).map((cm) => finale.set(cm.name, cm));
            });
            this.commands = finale;
        }
       }
       async initEvents() {
        const eventsF = fs.readdirSync('./events')
        Logger.info(`Loading ${eventsF.length} events`, `Starting`);
        for (const folder of eventsF) {
            const eventsFiles = fs.readdirSync(`./events/${folder}`).filter((f) => f.endsWith(".js"));
            for (const eventFile of eventsFiles) {
                const event = require(`../../events/${folder}/${eventFile}`);
                if (event.once) {
                    this.once(event.name, (...args) => event.run(this,...args));
                } else {
                    this.on(event.name, (...args) => event.run(this,...args));
                }
            }
        }
       }




}

module.exports = {
    Clarity
}