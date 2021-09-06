module.exports = {
    name: 'skip',
    aliases: ['s', 'sk'],
    cooldown: 0,
    description: 'skip currently playing song in queue',
    async execute(message, args, queue, Discord) {

        const server_queue = queue.get(message.guild.id);
        
        if (!message.member.voice.channel) {
            let embed = new Discord.MessageEmbed()
            .setDescription('❌ You need to join a voice channel to use this command')
            .setColor('RED');

            return message.channel.send(embed);
        }

        if (!server_queue) {
            let embed = new Discord.MessageEmbed()
            .setDescription('❌ No songs are currently playing')
            .setColor('RED');

            return message.channel.send(embed);
        }

        await server_queue.connection.dispatcher.end();
    }
}