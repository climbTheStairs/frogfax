"use strict"

const Facts = require("../facts.js")

module.exports = ({ channel }, id) => {
    id = parseInt(id)
    
    const fact = Facts.get(id)
    if (!fact)
        return channel.send(Facts.reportErr("seekMissing"))
    
    channel.send(fact.getEmbed()).catch((err) => {
        channel.send(Facts.reportErr("unknown", err))
    })
}