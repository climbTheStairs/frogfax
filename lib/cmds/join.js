"use strict"

const Facts = require("../facts.js")

module.exports = ({ channel, guild }, ...vcName) => {
    vcName = vcName.join(" ")
    const vcs = guild.channels.cache.filter(({ type }) => type === "voice")
    const vc = vcs.find(({ name }) => name === vcName)
    if (!vc)
        return channel.send(Facts.reportErr("joinChannelMissing"))
        
    vc.join().then((connection) => {
        connection.voice.setSelfDeaf(true)
        const ribbit = __dirname + "/../../srv/audio/ribbit_ribbit_italian.mp3"
        const loop = () => {
            const dispatcher = connection.play(ribbit)
            // dispatcher.on("finish", loop)
        }
        loop()
    }).catch((err) => channel.send(Facts.reportErr("joinInvalid", err)))
}