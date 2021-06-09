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
const Facts = require("../facts")

const debug = ({
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

module.exports = debug
