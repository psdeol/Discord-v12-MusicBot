module.exports = {
    name: 'queue',
    aliases: ['q'],
    cooldown: 0,
    description: 'displays songs in queue',
    async execute(message, args, queue, Discord) {

        const server_queue = queue.get(message.guild.id);
        
        if (!server_queue) {
            let embed = new Discord.MessageEmbed()
            .setDescription('❌ No songs are currently playing')
            .setColor('RED');

            return message.channel.send(embed);
        }

        let index = 1;
        let string = "";

        if(server_queue.songs[0]) string += `__**Currently playing**__\n ${server_queue.songs[0].title}\n\n`;
        if(server_queue.songs[1]) string += `__**Rest of queue**__\n ${server_queue.songs.slice(1, 10).map(x => `**${index++})** ${x.title}`).join("\n")}`;

        let embed = new Discord.MessageEmbed()
        .setAuthor(`Current Queue for ${message.guild.name}`, message.guild.iconURL)
        .setDescription(string);

        return message.channel.send(embed);
    }
}