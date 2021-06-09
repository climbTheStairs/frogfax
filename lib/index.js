"use strict"

const fs = require("fs")
const Discord = require("discord.js")
const config = require("../etc/config.json")
const cmds = require("./cmds.json")
const Facts = require("./facts.js")
const D = require("./d.js")

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
    const { info, prefix } = config
    
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

    if (Math.random() < 1 / 250)
        return channel.send(Facts.getRand()?.getMsg(info.interrupt))
})

// Log in
const token = fs.readFileSync(__dirname + "/../etc/token.txt", "utf-8").trim()
client.login(token)