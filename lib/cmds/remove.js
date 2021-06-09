"use strict"

const config = require("../../etc/config.json")
const Facts = require("../facts.js")

module.exports = ({
    channel,
    author: { id: removedBy },
    createdTimestamp: removedAt,
}, id, ...removeReason) => {
    const { info } = config
    
    id = parseInt(id)
    removeReason = removeReason.join(" ")
    
    const fact = Facts.get(id)
    const changes = { removedBy, removedAt, removeReason }
    
    if (!fact)
        return channel.send(Facts.reportErr("removeMissing"))
    if (fact.removedBy && fact.removedAt)
        return channel.send(Facts.reportErr("removeAlreadyRemoved"))
    if (!removeReason)
        return channel.send(Facts.reportErr("removeReasonMissing"))
    
    Facts.edit(id, changes).then((fact) => {
        channel.send(fact.getEmbed(info.removed)).catch((err) => {
            channel.send(Facts.reportErr("unknown", err))
        })
    }).catch((err) => channel.send(Facts.reportErr("unknown", err)))
}