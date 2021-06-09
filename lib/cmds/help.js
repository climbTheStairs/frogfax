"use strict"

const config = require("../../etc/config.json")
const cmds = require("../cmds.json")
const Facts = require("../facts.js")

module.exports = ({ channel }) => {
    const {
        avatar,
        info,
        id,
        embedClr,
        prefix,
    } = config

    const color = embedClr

    const title = prefix + "HELP"

    const url = `https://media.discordapp.net/avatars/${id}/${avatar}`
    const thumbnail = { url }

    const description = info.help.replace(/\${prefix}/g, prefix)

    const createField = ({ name, parameters, description, aliases, example }) => {
        name = prefix + name
        parameters = parameters.map((x) => `[${x}]`).join(", ")
        aliases = aliases.map((alias) => "`" + alias + "`").join(", ")
        aliases = aliases && `\nAliases: ${aliases}`
        example = example.join(" ")
        example = example && `\nExample: \`${name} ${example}\``

        const field = {
            name: `**${name}** ${parameters}`.trim(),
            value: description + aliases + example,
        }
        return field
    }
    const fields = cmds.map(createField)

    const embed = { color, title, thumbnail, description, fields }
    channel.send({ embed }).catch((err) => {
        channel.send(Facts.reportErr("unknown", err))
    })
}