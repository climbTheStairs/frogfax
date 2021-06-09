"use strict"

const Facts = require("../facts.js")

module.exports = ({ channel }, num) => {
    num = parseInt(num)
    if (Number.isNaN(num))
        return channel.send(Facts.reportErr("factsNumMissing"))
    
    const facts = Facts.getActive()
    if (Math.abs(num) > facts.length)
        return channel.send(Facts.reportErr("factsNumInvalid"))

    const randFacts = []
    randFacts.unusedFacts = facts.map((fact) => {
        return fact.getMsg("**FACT:** ${fact}", num < 0)
    })
    randFacts.add = function() {
        const i = ~~(Math.random() * this.unusedFacts.length)
        const [fact] = this.unusedFacts.splice(i, 1)
        this.push(fact)
    }
    
    for (let i = 0; i < Math.abs(num); i++)
        randFacts.add()
    
    const msgs = randFacts.reduce((acc, curr) => {
        const prev = acc.pop()
        if (!prev)
            return [curr]
        const isSpecial = (fact) => {
            const mention = /<@\d+>/
            const res = fact.embed || fact.content.match(mention)
            return !!res
        }
        const combine = (prev, curr) => {
            curr.content = prev.content + "\n" + curr.content
            return curr
        }
        if (isSpecial(prev) || isSpecial(curr))
            acc.push(prev, curr)
        else
            acc.push(combine(prev, curr))
        return acc
    }, [])
    msgs.forEach((msg) => {
        channel.send(msg).catch((err) => {
            channel.send(Facts.reportErr("unknown", err))
        })
    })
}