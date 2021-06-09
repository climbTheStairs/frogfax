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

const facts = ({ channel }, num) => {
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

module.exports = facts
