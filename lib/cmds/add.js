"use strict"

const config = require("../../etc/config.json")
const Facts = require("../facts.js")

module.exports = ({
    channel,
    author: { id: addedBy },
    createdTimestamp: addedAt,
}, ...content) => {
    const { info } = config
    
    content = content.join(" ")
    if (!content.toLowerCase().includes("frog"))
        return channel.send(Facts.reportErr("addInvalid"))
    
    const fact = { content, addedBy, addedAt }
    Facts.add(fact).then((fact) => {
        channel.send(fact.getEmbed(info.added)).catch((err) => {
            channel.send(Facts.reportErr("unknown", err))
        })
    }).catch((err) => channel.send(Facts.reportErr("unknown", err)))
}
