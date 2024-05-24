module.exports = {
    async getLang(client, guildId)  {
        let lang = await client.data2.get(`${guildId}_guildlang`) || 'fr';
        let dat = (function() {
            return require(`./lang/${lang}.js`);
        })();
        return dat;
    },

    async setLang(client, guildId, lang) {
        await client.data2.set(`${guildId}_guildlang`, lang);
    },

    async globalLang(client) {
        let lang = await client.data2.get('globallang') || 'fr';
        let dat = (function() {
            return require(`./lang/${lang}.js`);
        })();
        return dat;
    },

    async setGlobalLang(client, lang) {
        await client.data2.set('globallang', lang);
    }

}