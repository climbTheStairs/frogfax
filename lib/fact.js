"use strict"

const config = require("../etc/config.json")
const facts = require("../srv/facts.json")
const D = require("./d.js")

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
        const { embedClr: color } = config
        
        let { content, embed } = this
        
        if (isReverse)
            content = content.match(/<@\d+>|./gu).reverse().join("")
        content = fmtStr.replace(/\${fact}/g, content)
        
        if (embed)
            embed = { ...embed, color }
        
        const split = true
        
        return { content, embed, split }
    }
    getEmbed(msg) {
        const { embedClr: color } = config
        
        const {
            id,
            content,
            addedBy,
            addedAt,
            removedBy,
            removedAt,
            removeReason,
        } = this
        const {
            title: caption,
            image: { url } = {},
        } = this.embed || {}
        
        const title = removedBy && removedAt
            ? `~~Fact #${id}~~`
            : `Fact #${id}`
        const thumbnail = { url }
        const description = content
        const fields = [{
            _condition: caption,
            name: "Image caption",
            value: caption,
            inline: false,
        }, {
            _condition: addedBy && addedAt,
            name: "Added by",
            value: `<@${addedBy}> on ${new D(addedAt).mmmddyyyy()}`,
            inline: true,
        }, {
            _condition: removedBy && removedAt,
            name: "Removed by",
            value: `<@${removedBy}> on ${new D(removedAt).mmmddyyyy()}`,
            inline: true,
        }, {
            _condition: removedBy && removedAt,
            name: "Remove reason",
            value: removeReason,
            inline: false,
        }].filter(({ _condition }) => _condition)
        const footer = { text: msg }
        
        const embed = {
            color,
            title,
            thumbnail,
            description,
            fields,
            footer,
        }
        return { embed }
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