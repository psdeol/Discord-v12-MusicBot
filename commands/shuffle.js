module.exports = {
    name: 'shuffle',
    aliases: ['sh'],
    cooldown: 0,
    description: 'shuffles songs in queue',
    async execute(message, args, queue, Discord) {

        let server_queue = queue.get(message.guild.id);

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

        if (!server_queue.songs[2]) {
             let embed = new Discord.MessageEmbed()
            .setDescription('❌ There is only 1 song in queue')
            .setColor('RED');

            return message.channel.send(embed);
        }

        //console.log(server_queue.songs);
        server_queue.songs = shuffle(server_queue.songs);
        //console.log(server_queue.songs);

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

function shuffle(array) {
    var max = array.length - 1;
    var min = 1;

    for (var i = max; i >= min; i--) {
        var randomIndex = Math.floor(Math.random() * (max - min + 1)) + min;
        var itemAtIndex = array[randomIndex];
        array[randomIndex] = array[i];
        array[i] = itemAtIndex;
    }

    return array
}