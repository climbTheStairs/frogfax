"use strict"

const config = require("../../etc/config.json")
const Facts = require("../facts.js")

module.exports = ({ channel }) => {
    const { info } = config
    channel.send({
        content: info.view,
        files: ["./data/facts.json"],
    }).catch((err) => {
        channel.send(Facts.reportErr("unknown", err))
    })
}