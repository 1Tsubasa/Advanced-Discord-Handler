const fs = require('fs');
class EventHandler {
    constructor(clarity) {
        this.clarity = clarity;
        this.getFiles("events")
    }
    getFiles(path) {
        fs.readdir(`${path}`, (err, files) => {
            this.clarity.Logger.info(`Loading ${files.length} events in category ${path}`, `Starting`)
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
        if (event.once) {
            this.clarity.once(event.name, (...args) => event.run(this.clarity,...args));
        } else {
            this.clarity.on(event.name, (...args) => event.run(this.clarity,...args));
        }
        delete require.cache[require.resolve(`../../${file}`)];
    }
}


class LangHandler {
    constructor(clarity) {
        this.clarity = clarity;
        this.getFiles("lang");
    }
    getFiles(path) {
        fs.readdir(`${path}`, (err, files) => {
            if (err) throw err;
            files.forEach(file => {
                if (file.endsWith('.disabled')) return;
                if (file.endsWith('.js')) {
                    this.clarity.Logger.comment(`${this.clarity.Logger.setColor('green', `Load: ${file.split('.js')[0]}`)}`, `Loading languages`)
                    return this.registerFile(`${path}/${file}`, this.clarity);
                }
                if (!file.includes("."))
                    this.getFiles(`${path}/${file}`);
            })
        })
    }

    get(Lang) {
        return this.clarity.langList.get(Lang);
    }
    registerFile(file) {
        const pull = require(`../../${file}`);
        if (pull.name)
        this.clarity.langList.set(file.split("/").pop().slice(0, -3), pull.dictionary);
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
            this.clarity.Logger.info(`Loading ${files.length} commands in category ${path}`, `Starting`)
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
            if (pull.aliases && Array.isArray(pull.aliases))
                pull.aliases.forEach((alias) =>
                    this.clarity.aliases.set(alias.toLowerCase(), pull)
                );
            this.clarity.commands.set(pull.name.toLowerCase(), pull);
            delete require.cache[require.resolve(`../../${file}`)];
    }
}

module.exports = { CommandHandler, EventHandler, LangHandler, SlashCommandHandler}