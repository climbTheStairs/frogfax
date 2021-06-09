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

const remove = ({
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

module.exports = remove
