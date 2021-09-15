module.exports = {
    name: 'playlist_delete',
    aliases: [],
    cooldown: 0,
    description: 'deletes playlist from database',
    async execute(message, args, queue, Discord, admin) {
        const DB = admin.firestore()
        
        if (!args[0]) return message.channel.send('Enter playlist name');


        let server_data = await DB.collection(message.guild.id).doc('server_data').get();

        if (!server_data.exists) {
            await DB.collection(message.guild.id).doc('server_data').set({
                server_owner_id: message.guild.ownerId,
                num_playlists: 0
            })

            let embed = new Discord.MessageEmbed()
            .setDescription('❌ This server has no playlists')
            .setColor('RED');

            return message.channel.send(embed);
        } 

        let list = args.join(' ');
        let doc = await DB.collection(message.guild.id).doc(list).get();

        if (doc.exists) {
            let server_owner = server_data.data().server_owner_id;
            let playlist_author = doc.data().author_id;

            if (playlist_author === message.author.id || server_owner === message.author.id) {
                await DB.collection(message.guild.id).doc(args[0]).delete().then(() => {
                    let embed = new Discord.MessageEmbed()
                    .setDescription(`👍 Playlist '${args[0]}' deleted!`)
                    .setColor('GREEN');
                    
                    message.channel.send(embed)
                });
                
                const res = await DB.collection(message.guild.id).doc('server_data').update({
                    num_playlists: admin.firestore.FieldValue.increment(-1)
                });

            } else {
                let embed = new Discord.MessageEmbed()
                .setDescription('❌ Only the playlist author or server owner can delete this playlist')
                .setColor('RED');

                return message.channel.send(embed);
            }

        } else {
            let embed = new Discord.MessageEmbed()
            .setDescription('❌ Playlist not found')
            .setColor('RED');

            return message.channel.send(embed);
        }
    }
}