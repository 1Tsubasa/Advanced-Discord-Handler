
const {Clarity} = require("./structures/Client/Clarity")
const config = require("./structures/config/index")
const Cluster = require("discord-hybrid-sharding");
if (config.sharding) {
    new Clarity({
        partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"],
        intents: 3276799,
        allowedMentions: {repliedUser: false},
        restTimeOffset: 0,
        shards: Cluster.data.SHARD_LIST,
        shardCount: Cluster.data.TOTAL_SHARDS
    })
} else {
    new Clarity({
        partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"],
        intents: 3276799,
        allowedMentions: {repliedUser: false},
        restTimeOffset: 0
    })
}

require('events').EventEmitter.defaultMaxListeners = 0;

