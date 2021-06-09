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

const Facts = require("../facts")

const join = ({ channel, guild }, ...vcName) => {
    vcName = vcName.join(" ")
    const vcs = guild.channels.cache.filter(({ type }) => type === "voice")
    const vc = vcs.find(({ name }) => name === vcName)
    if (!vc)
        return channel.send(Facts.reportErr("joinChannelMissing"))
        
    vc.join().then((connection) => {
        connection.voice.setSelfDeaf(true)
        const ribbit = __dirname + "/../../srv/audio/ribbit_ribbit_italian.mp3"
        const loop = () => {
            const dispatcher = connection.play(ribbit)
            // dispatcher.on("finish", loop)
        }
        loop()
    }).catch((err) => channel.send(Facts.reportErr("joinInvalid", err)))
}

module.exports = join
