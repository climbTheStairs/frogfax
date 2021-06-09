"use strict"

const config = require("../../etc/config.json")
const Facts = require("../facts.js")

module.exports = ({
    author,
    channel,
    client,
    createdTimestamp,
    guild,
    mentions,
}, ...js) => {
    const { allowedEval } = config

    js = js.join(" ")
    if (js.startsWith("```js\n") && js.endsWith("```"))
        js = js.slice(6, -3)
    else if (js.startsWith("```javascript\n") && js.endsWith("```"))
        js = js.slice(14, -3)

    if (!allowedEval.includes(author.id))
        return channel.send(Facts.reportErr("permission"))

    try {
        eval(js)
    } catch (err) {
        channel.send(Facts.reportErr("eval", err))
    }
}