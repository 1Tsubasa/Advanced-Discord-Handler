const fs = require('fs');

class EventHandler {
    constructor(clarity) {
        this.clarity = clarity;
        this.getFiles("events")
    }
    getFiles(path) {
        fs.readdir(`${path}`, (err, files) => {
            this.clarity.Logger.info(`Loading ${files.length} events in category`, `Starting`)
            if (err) throw err;
            files.forEach(file => {

                if (file.endsWith('.disabled')) return;
                if (file.endsWith('.js')) {
                    this.clarity.Logger.comment(`${this.clarity.Logger.setColor('green', `Bind: ${file.split('.js')[0]}`)}`, `Binding events`)
                    return this.registerFile(`${path}/${file}`, this.clarity);
                }
                if (!file.includes("."))
                    this.getFiles(`${path}/${file}`);
            })
        })
    }

    registerFile(file) {
        const event = require(`../../${file}`);
        this.clarity.on(event.name, (...args) => event.run(this.clarity, ...args));
        delete require.cache[require.resolve(`../../${file}`)];
    }
}


class SlashCommandHandler {
    constructor(clarity) {
        this.clarity = clarity;
        this.getFiles("slashCommands");
    }

    getFiles(path) {
        fs.readdir(`${path}`, (err, files) => {
            if (err) throw err;
            files.forEach(file => {
                if (file.endsWith(".disabled")) return;
                if (file.endsWith(".js"))
                    return this.registerFile(`${path}/${file}`, this.clarity);
                if (!file.includes("."))
                    this.getFiles(`${path}/${file}`);
            })
        })
    }

    registerFile(file) {
        const pull = require(`../${file}`);
        if (pull.name)
            this.clarity.slashCommand.set(pull.name.toLowerCase(), pull);
            delete require.cache[require.resolve(`../${file}`)];
    }
}

class CommandHandler {
    constructor(clarity) {
        this.clarity = clarity;
        this.getFiles("commands");
    }

    getFiles(path) {
        fs.readdir(`${path}`, (err, files) => {
            this.clarity.Logger.info(`Loading ${files.length} commands in category`, `Starting`)
            if (err) throw err;
            files.forEach(file => {
                if (file.endsWith('.disabled')) return;
                if (file.endsWith('.js')) {
                    this.clarity.Logger.comment(`${this.clarity.Logger.setColor('green', `Load: ${file.split('.js')[0]}`)}`, `Loading commands`)
                    return this.registerFile(`${path}/${file}`, this.clarity)
                }
                if (!file.includes("."))
                    this.getFiles(`${path}/${file}`);
            })
        })
    }

    registerFile(file) {
        const pull = require(`../../${file}`);
        if (pull.name)
            this.clarity.commands.set(pull.name.toLowerCase(), pull);
            delete require.cache[require.resolve(`../../${file}`)];
        if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => this.clarity.aliases.set(alias.toLowerCase(), pull.name));
    }
}

module.exports = {
    EventHandler,
    CommandHandler,
    SlashCommandHandler
}