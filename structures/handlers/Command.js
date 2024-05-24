module.exports = class Command {
    constructor(opt) {
        this.name = opt.name;
        this.description = opt.description;
        this.usage = opt.usage;
        this.aliases = opt.aliases || [];
        this.cooldown = opt.cooldown || 0;
        this.guildOnly = opt.guildOnly || false;
        this.userPermissions = opt.userPermissions || [];
        this.botPermissions = opt.botPermissions || [];
        this.ownerOnly = opt.ownerOnly || false;
        this.topGgOnly = opt.topGgOnly || false;
        this.bumpOnly = opt.bumpOnly || false;
        this.guildOwnerOnly = opt.guildOwnerOnly || false;
        this.guildCrownOnly = opt.guildCrownOnly || false;
        this.buyerOnly = opt.buyerOnly || false;
        this.devOnly = opt.devOnly || false;
        this.clariteamOnly = opt.clariteamOnly || false;
    }
    async run(client, message, args) {

    }
}