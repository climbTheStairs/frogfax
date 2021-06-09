"use strict"

const config = require("../../etc/config.json")
const Facts = require("../facts.js")

module.exports = ({ channel }, id) => {
    const { info } = config
    
    id = parseInt(id)
    
    const fact = Facts.get(id)
    const changes = {
        removedBy: null,
        removedAt: null,
        removeReason: null,
    }
    
    if (!fact)
        return channel.send(Facts.reportErr("restoreMissing"))
    if (!(fact.removedBy && fact.removedAt))
        return channel.send(Facts.reportErr("restoreActive"))
    
    Facts.edit(id, changes).then((fact) => {
        channel.send(fact.getEmbed(info.restored)).catch((err) => {
            channel.send(Facts.reportErr("unknown", err))
        })
    }).catch((err) => channel.send(Facts.reportErr("unknown", err)))
}