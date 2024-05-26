const {Collection, Client} = require('discord.js');
const { CommandHandler , EventHandler, SlashCommandHandler, LangHandler } = require('../handlers/clariHandler');

const {Database, Mongo, Pgp , SequelizeConfig} = require("../handlers/Database")
const {Logger} = require('advanced-command-handler')
const fs = require('fs');
const config = require('../config/index')
const logs = require('discord-logs');
class Clarity extends Client {
    constructor(options) {
        super(options);
        this.setMaxListeners(0);
        this.cachedChannels = new Map()
        this.config = config;
        this.commands = new Collection();
        this.events = new Collection();
        this.aliases = new Collection();
        logs(this, {
            debug: true
        });
        this.cooldowns = new Collection();
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
        new EventHandler(this);
        new CommandHandler(this);
        this.lang = new LangHandler(this)
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
}

module.exports = {
    Clarity
}
