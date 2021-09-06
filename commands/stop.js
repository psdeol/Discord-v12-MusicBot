module.exports = {
    name: 'stop',
    aliases: ['st'],
    cooldown: 0,
    description: 'stops playing music, empties queue',
    async execute(message, args, queue, Discord) {

        const server_queue = queue.get(message.guild.id);
        
        if (!message.member.voice.channel) {
            let embed = new Discord.MessageEmbed()
            .setDescription('❌ You need to join a voice channel to use this command')
            .setColor('RED');

            return message.channel.send(embed);
        }

        server_queue.songs = [];
        
        await server_queue.connection.dispatcher.end();
        
    }
}
