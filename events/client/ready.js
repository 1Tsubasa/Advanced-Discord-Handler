const getNow = () => {
    return {
        time: new Date().toLocaleString("fr-FR", {
            timeZone: "Europe/Paris",
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        })
    };
};

module.exports = {
    name: "ready",
    once: true,
    run: async (client) => {
        console.clear();
        console.log(`----------------------------------------------------------------`)
        console.log(`[DATE] : ${getNow().time}`);
        console.log(`[CLIENT] : ${client.user.username}`);
        console.log(`[VERSION] : ${client.version.version}`);
        console.log(`----------------------------------------------------------------`)
    }
}