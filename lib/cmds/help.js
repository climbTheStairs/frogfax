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

const help = ({ channel }) => {
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

module.exports = help
