module.exports = {
    name: 'help',
    aliases: [],
    cooldown: 0,
    description: 'sends bot commands',
    async execute(message, Discord) {

        let embed = new Discord.MessageEmbed()
        .setTitle('MUSIC BOT COMMANDS')
        .addFields(
            { 
                name: '!play <Search|YouTubeLink>',
                value: 'search YouTube for a song or play from a link' 
            },
            { 
                name: '!skip', 
                value: 'skips to next song in queue' 
            },
            { 
                name: '!stop',
                value: 'stops playing music' 
            },
            { 
                name: '!queue', 
                value: 'shows songs in queue' 
            },
            { 
                name: '!shuffle', 
                value: 'shuffles songs in queue' 
            },
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
        )
        .setColor('LUMINOUS_VIVID_PINK');

        return message.channel.send(embed);
    }
}