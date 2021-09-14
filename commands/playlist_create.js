module.exports = {
    name: 'playlist_create',
    aliases: [],
    cooldown: 0,
    description: 'creates a new playlist in database',
    async execute(message, args, queue, Discord, DB, admin) {
        
        if (!args[0]) return message.channel.send('Enter playlist name');

        let server_data = await DB.collection(message.guild.id).doc('server_data').get();
        let num_playlists = 0;

        if (!server_data.exists) {
            await DB.collection(message.guild.id).doc('server_data').set({
                server_owner_id: message.guild.owner.id,
                num_playlists: 0
            })
        } else {
            num_playlists = server_data.data().num_playlists;
        }

        if (num_playlists <= 10) {
            let list = args.join(' ');

            if (list === 'all' || list === 'names') {
                let embed = new Discord.MessageEmbed()
                .setDescription('❌ Cannot use that name for playlist')
                .setColor('RED');

                return message.channel.send(embed);
            }

            let doc = await DB.collection(message.guild.id).doc(list).get();

            if (doc.exists) {
                let embed = new Discord.MessageEmbed()
                .setDescription('❌ A playlist with that name already exists')
                .setColor('RED');

                return message.channel.send(embed);

            } else {
                await DB.collection(message.guild.id).doc(args[0]).set({
                    author_name: message.author.username,
                    author_id: message.author.id,
                    songs: []
                }).then(() => {
                    let embed = new Discord.MessageEmbed()
                    .setDescription(`👍 Playlist '${args[0]}' created!`)
                    .setColor('GREEN');
                    
                    message.channel.send(embed)
                });  
                
                const res = await DB.collection(message.guild.id).doc('server_data').update({
                    num_playlists: admin.firestore.FieldValue.increment(1)
                });
            }

        } else {
            let embed = new Discord.MessageEmbed()
                .setDescription('❌ This server has reached the maximum number of playlists')
                .setColor('RED');

                return message.channel.send(embed);
        } 
    }
}