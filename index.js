const { ShardingManager } = require('discord.js')
const config = require("./structures/config/index")

if (config.sharding) {
    const manager = new ShardingManager('./main.js', { token: config.token, respawn: true, totalShards: "auto" })
    manager.on('shardCreate', (shard) => {
        shard.on("ready", () => {
        
            console.log(`[SHARD] : ${shard.id + 1 } est prêt ! `);
        })
        shard.on("disconnect", (event) => {
            console.log(`[SHARD] : ${shard.id} est déconnecté! `);
            console.log(event);
        })
        shard.on("reconnecting", (event) => {
            console.log(`[SHARD] : ${shard.id} est en reconnection! `);
            console.log(event);
        })
        shard.on("error", (event) => {
            console.log(`[SHARD] : ${shard.id} a rencontré une erreur! `);
            console.log(event);
        })
    })
    manager.spawn({
        delay: 10000
    })
} else {
    require("./main.js")
}
