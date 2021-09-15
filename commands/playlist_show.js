module.exports = {
    name: 'playlist_show',
    aliases: [],
    cooldown: 0,
    description: 'shows names of playlist for server',
    async execute(message, args, queue, Discord, admin) {
        const DB = admin.firestore();

        if (!args[0])
            return message.channel.send('Enter second argument');

        if (args[0] === 'all' || args[0] === 'names') {
            const col = await DB.collection(message.guild.id);
            const snapshot = await col.get();

            if (snapshot.size > 1) {
                let index = 1;
                let string = "";

                snapshot.forEach(doc => {
                    if (doc.id !== 'server_data')
                        string += `**${index++}.** **${doc.id}** created by **${doc.data().author_name}**\n`;
                })

                let embed = new Discord.MessageEmbed()
                .setAuthor(`Playlists for ${message.guild.name}`, message.guild.iconURL)
                .setDescription(string);

                return message.channel.send(embed);

            } else {
                let embed = new Discord.MessageEmbed()
                .setDescription('❌ No playlists found')
                .setColor('RED');

                return message.channel.send(embed);
            }

        } else {
            const list = args.join(' ');
            const doc = await DB.collection(message.guild.id).doc(list).get();

            if (!doc.exists) {
                let embed = new Discord.MessageEmbed()
                .setDescription('❌ Playlist not found')
                .setColor('RED');

                return message.channel.send(embed);

            } else {
                let songs = doc.data().songs;
                let index = 1;
                let string = "";

                songs.forEach(song => {
                    string += `**${index++}.** ${song.title}\n`;
                })

                if (string !== "") {
                    return message.channel.send(string, { split: true });
                    
                } else {
                    let embed = new Discord.MessageEmbed()
                    .setDescription('❌ No songs in this playlist')
                    .setColor('RED');

                    return message.channel.send(embed);
                }
            }
        }
    }
}