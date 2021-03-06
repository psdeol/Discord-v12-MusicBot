require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');
const admin = require("firebase-admin");

const client = new Discord.Client();
const token = process.env.TOKEN;
const prefix = process.env.PREFIX;
const queue = new Map();


admin.initializeApp({
    credential: admin.credential.cert({
        "type": process.env.TYPE,
        "project_id": process.env.PROJECT_ID,
        "private_key_id": process.env.PRIVATE_KEY_ID,
        "private_key": process.env.PRIVATE_KEY,
        "client_email": process.env.CLIENT_EMAIL,
        "client_id": process.env.CLIENT_ID,
        "auth_uri": process.env.AUTH_URI,
        "token_uri": process.env.TOKEN_URI,
        "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER_X509_CERT_URL,
        "client_x509_cert_url": process.env.CLIENT_X509_CERT_URL
    })
})


const cmdFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

client.commands = new Discord.Collection();

for (const file of cmdFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}


client.once("ready", () => {
    console.log("Music Bot is online");
    client.user.setActivity("Music", {
        type: "LISTENING",
    });
});

client.once("reconnecting", () => {
    console.log("Music Bot is reconnecting");
});

client.once("disconnect", () => {
    console.log("Music Bot is disconnect");
});


client.on('message', async message => {

    if (!message.content.startsWith(prefix) || message.author.bot) 
        return;

    let args = message.content.slice(prefix.length).trim().split(/ +/);
    let cmd = args.shift().toLowerCase();

    switch (cmd) {

        case 'h':
        case 'help':
            client.commands.get('help').execute(message, Discord);
            break;
            
        case 'p':
        case 'play':
            client.commands.get('play').execute(message, args, queue, Discord);
            break;

        case 'pn':
        case 'playnow':
            client.commands.get('playnow').execute(message, args, queue, Discord);
            break;

        case 's':
        case "skip":
            client.commands.get('skip').execute(message, args, queue, Discord);
            break;

        case 'st':
        case 'stop':
            client.commands.get('stop').execute(message, args, queue, Discord);
            break;

        case 'q':
        case 'queue':
            client.commands.get('queue').execute(message, args, queue, Discord);
            break;

        case 'sh':
        case 'shuffle':
            client.commands.get('shuffle').execute(message, args, queue, Discord);
            break;

        case 'pl':
        case 'playlist':
            client.commands.get('playlist').execute(message, args, queue, client, Discord, admin);
            break;

        default:
            let embed = new Discord.MessageEmbed()
            .setDescription('???Command not found')
            .setColor('RED');
            message.channel.send(embed);
            break;
    }

    //message.delete({ timeout: 60000 }); // 60 second timer
});

client.login(token);