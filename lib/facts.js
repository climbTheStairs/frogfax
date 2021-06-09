"use strict"

const fsp = require("fs").promises
const config = require("../etc/config.json")
const facts = require("../srv/facts.json")
const Fact = require("./fact.js")

const _facts = facts.map((fact) => new Fact(fact))
const Facts = {
    get(id) {
        const facts = this.getAll()
        const fact = facts.find((fact) => fact.id === id)
        return fact
    },
    getRand() {
        const facts = this.getActive()
        const i = ~~(Math.random() * facts.length)
        const fact = facts[i]
        return fact
    },
    getAll() {
        const facts = [..._facts]
        return facts
    },
    getActive() {
        const facts = _facts.filter(({ removedBy, removedAt }) => {
            return !(removedBy && removedAt)
        })
        return facts
    },
    getRemoved() {
        const facts = _facts.filter(({ removedBy, removedAt }) => {
            return removedBy && removedAt
        })
        return facts
    },
    getMaxId() {
        const facts = this.getAll()
        const ids = facts.map(({ id }) => {
            id = parseInt(id)
            return Number.isNaN(id) ? -1 : id
        })
        return Math.max(...ids, -1)
    },
    add(fact) {
        const id = this.getMaxId() + 1
        fact = new Fact({ id, ...fact })
        _facts.push(fact)
        return new Promise((resolve, reject) => {
            try {
                this.save()
                return resolve(fact)
            } catch (err) {
                return reject(err)
            }
        })
    },
    edit(id, changes) {
        const fact = this.get(id)
        fact.edit(changes)
        return new Promise((resolve, reject) => {
            try {
                this.save()
                return resolve(fact)
            } catch (err) {
                return reject(err)
            }
        })
    },
    save() {
        const data = JSON.stringify(this.getAll(), null, 4)
        fsp.writeFile(__dirname + "/../srv/facts.json", data)
    },
    reportErr(errCode, err = "") {
        const { errs } = config
        err = err.toString()
        if (err.length > 2000 - 6)
            err = err.slice(0, 2000 - 6 - 16) + "... (incomplete)"
        err = err && "```" + err + "```"
        const content = `**ERROR:** ${errs[errCode]}\n` + err
        const split = true
        return { content, split }
    },
}

module.exports = Facts