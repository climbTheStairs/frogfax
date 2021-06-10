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

const fs = require("fs")
const Discord = require("discord.js")
const config = require("../etc/config.json")
const cmds = require("./cmds.json")
const Facts = require("./facts")

// Init bot
const client = new Discord.Client()
client.once("ready", () => {
    const { info, presence } = config
    console.log(info.ready)
    client.user.setPresence(presence)
})

// On server join
client.on("guildCreate", ({ channels }) => {
    const { info, prefix } = config
    const channel = channels.cache.find(({ name }) => name === "frogfax")
    channel.send(info.welcome.replace(/\${prefix}/g, prefix))
})

// Commands
client.cmds = new Discord.Collection()
cmds.forEach(({ name: cmdName }) => {
    const cmd = require(`./cmds/${cmdName}.js`)
    client.cmds.set(cmdName, cmd)
})
client.execCmd = (cmdName, msg, ...args) => {
    const { channel } = msg
    
    cmdName = cmdName.toLowerCase()
    
    const cmd = client.cmds.get(cmds.find(({ name, aliases }) => {
        return name === cmdName || aliases.includes(cmdName)
    })?.name)
    if (!cmd)
        return channel.send(Facts.reportErr("cmdInvalid"))
    
    cmd(msg, ...args)
}

// Message event
client.on("message", (msg) => {
    const { info, interruptChance, prefix } = config
    
    const { author, channel, content } = msg
    if (author.bot)
        return
    
    const [cmdName, ...args] = content.trim().slice(prefix.length).split(/ +/)
    if (content.trim().toLowerCase().startsWith(prefix))
        try {
            return client.execCmd(cmdName, msg, ...args)
        } catch (err) {
            return channel.send(Facts.reportErr("unknown", err))
        }
    
    if (content.toLowerCase().includes("frog"))
        msg.react("795210639006105641").catch(() => {})
    
    if (channel.type === "dm")
        return channel.send(info.dm)

    if (Math.random() < 1 / interruptChance)
        return channel.send(Facts.getRand()?.getMsg(info.interrupt))
})

// Log in
const token = fs.readFileSync(__dirname + "/../etc/token.txt", "utf-8").trim()
client.login(token)