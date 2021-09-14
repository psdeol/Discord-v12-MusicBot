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
                name: '!playnow <Search|YouTubeLink>',
                value: 'skips current song and plays input song' 
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
                value: 'adds all songs from playlist into queue in random order' 
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
        .setColor('YELLOW');

        return message.channel.send(embed);
    }
}