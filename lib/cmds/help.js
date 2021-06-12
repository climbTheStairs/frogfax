/**
 * Copyright (C) 2020, 2021 climbTheStairs
 *
 * This file is part of frogfax.
 * 
 * frogfax is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * frogfax is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public
 * License along with frogfax. If not, see
 * <https://www.gnu.org/licenses/>.
 */

"use strict"

const config = require("../../etc/config.json")
const cmds = require("../cmds.json")
const Facts = require("../facts")

const createField = ({ name, parameters, description, aliases, example }) => {
    const { prefix } = config
    name = prefix + name
    parameters = parameters.map((x) => `[${x}]`).join(", ")
    aliases = aliases.map(alias => `\`${alias}\``).join(", ")
    example = example.join(" ")
    if (aliases)
        aliases = `\nAliases: ${aliases}`
    if (example)
        example = `\nExample: \`${name} ${example}\``

    const field = {
        name: `**${name}** ${parameters}`.trim(),
        value: description + aliases + example,
    }
    return field
}
const createHelpEmbed = () => {
    const { avatar, info, id, embedClr, prefix } = config
    const embed = {}
    embed.color = embedClr
    embed.title = prefix + "HELP"
    embed.thumbnail = {
        url: `https://media.discordapp.net/avatars/${id}/${avatar}`,
    }
    embed.description = info.help.replace(/\${prefix}/g, prefix)
    embed.fields = cmds.map(createField)
    return { embed }
}
const help = ({ channel }) => {
    const embed = createHelpEmbed()
    channel.send(embed).catch((err) => {
        channel.send(Facts.reportErr("unknown", err))
    })
}

module.exports = help
