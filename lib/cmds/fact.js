"use strict"

const Facts = require("../facts.js")

module.exports = ({ channel }) => {
    const fact = Facts.getRand()
    if (!fact)
        return channel.send(Facts.reportErr("noFacts"))
    channel.send(fact.getMsg("**FACT:** ${fact}")).catch((err) => {
        channel.send(Facts.reportErr("unknown", err))
    })
}