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

const config = require("../etc/config.json")
const facts = require("../srv/facts.json")
const dayjs = require("dayjs")

const Fact = class {
    constructor(facts) {
        Fact.keys.forEach((key) => {
            if (facts.hasOwnProperty(key))
                this[key] = facts[key]
            else
                this[key] = null
        })
    }
    edit(changes) {
        Fact.keys.forEach((key) => {
            if (changes.hasOwnProperty(key))
                this[key] = changes[key]
        })
    }
    getMsg(fmtStr = "${fact}", isReverse = false) {
        const color = config.embedClr
        let { content, embed } = this
        if (isReverse)
            content = content.match(/<@\d+>|./gu).reverse().join("")
        content = fmtStr.replace(/\${fact}/g, content)
        if (embed)
            embed = { ...embed, color }
        const split = true
        return { content, embed, split }
    }
    getEmbed(footerText) {
        const embed = {}
        embed.color = config.embedClr
        embed.title = this.getTitle()
        embed.thumbnail = { url: this.embed?.image.url }
        embed.description = this.content
        embed.fields = this.getFields()
        embed.footer = { text: footerText }
        return { embed }
    }
    getFields() {
        const caption = this.embed?.title
        const dateFmt = "MMM DD, YYYY"
        const addedDate = dayjs(this.addedAt).format(dateFmt)
        const removedDate = dayjs(this.removedAt).format(dateFmt)
        const allFields = [
            {
                _exists: caption,
                name: "Image caption",
                value: caption,
                inline: false,
            },
            {
                _exists: true,
                name: "Added by",
                value: `<@${this.addedBy}> on ${addedDate}`,
                inline: true,
            },
            {
                _exists: this.isRemoved(),
                name: "Removed by",
                value: `<@${this.removedBy}> on ${removedDate}`,
                inline: true,
            },
            {
                _exists: this.isRemoved(),
                name: "Remove reason",
                value: this.removeReason,
                inline: false,
            },
        ]
        const fields = allFields.filter(f => f._exists)
        fields.forEach(f => delete f._exists)
        return fields
    }
    getTitle() {
        let title = `Fact #${this.id}`
        if (this.isRemoved())
            title = `~~${title}~~`
        return title
    }
    isRemoved() {
        return this.removedBy && this.removedAt
    }
    static keys = [
        "id",
        "content",
        "embed",
        "addedBy",
        "addedAt",
        "removedBy",
        "removedAt",
        "removeReason",
    ]
}

module.exports = Fact
