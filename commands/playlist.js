module.exports = {
    name: 'playlist',
    aliases: ['pl'],
    cooldown: 0,
    description: 'playlist commands',
    async execute(message, args, queue, client, Discord, admin) {

        if (!args.length) {
            let embed = new Discord.MessageEmbed()
            .setTitle(`❌\tEnter a second command`)
            .addFields(
                { 
                    name: '!playlist create <PlaylistName>', 
                    value: 'creates new playlist' 
                },
                { 
                    name: '!playlist delete <PlaylistName>', 
                    value: 'deletes a playlist' 
                },
                { 
                    name: '!playlist add <PlaylistName> <SongName|YouTubeLink>', 
                    value: 'adds a song to playlist' 
                },
                { 
                    name: '!playlist remove <PlaylistName> <SongName|YouTubeLink>', 
                    value: 'removes a song to playlist' 
                },
                { 
                    name: '!playlist play <PlaylistName>', 
                    value: 'adds all songs from playlist into queue' 
                },
                { 
                    name: '!playlist show names', 
                    value: 'shows list of all playlist names for server' 
                },
                { 
                    name: '!playlist show <PlaylistName>', 
                    value: 'shows list of all songs in playlist' 
                },
            )
            .setColor('RED');

            return message.channel.send(embed);
        }
        
        const cmd = args.shift().toLowerCase();

        switch (cmd) {

            case 'create':
                client.commands.get('playlist_create').execute(message, args, queue, Discord, admin);
                break;

             case 'delete':
                client.commands.get('playlist_delete').execute(message, args, queue, Discord, admin);
                break;

            case 'add':
                client.commands.get('playlist_add').execute(message, args, queue, Discord, admin);
                break;

            case 'remove':
                client.commands.get('playlist_remove').execute(message, args, queue, Discord, admin);
                break;

            case 'play':
                client.commands.get('playlist_play').execute(message, args, queue, Discord, admin);
                break;    

            case 'show':
                client.commands.get('playlist_show').execute(message, args, queue, Discord, admin);
                break;

            default:
                let embed = new Discord.MessageEmbed()
                .setDescription('❌Command not found')
                .setColor('RED');
                message.channel.send(embed);
                break;

        }
    }
}
