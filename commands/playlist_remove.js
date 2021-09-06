const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

module.exports = {
    name: 'playlist_remove',
    aliases: [],
    cooldown: 0,
    description: 'removes a song from playlist',
    async execute(message, args, queue, Discord, DB, admin) {

        if (!args.length || args.length < 2) {
            let embed = new Discord.MessageEmbed()
            .setDescription('❌ Enter the playlist name and song to remove')
            .setColor('RED');

            return message.channel.send(embed);
        }
        
        let list = args.shift();
        let doc = await DB.collection(message.guild.id).doc(list).get();

        if (!doc.exists) {
            let embed = new Discord.MessageEmbed()
            .setDescription('❌ Playlist not found')
            .setColor('RED');

            return message.channel.send(embed);
        }

        let song = await find_song(args);
        
        if (song) {
            try {
                const unionRes = await DB.collection(message.guild.id).doc(list).update({
                    songs: admin.firestore.FieldValue.arrayRemove(song)
                });

                let embed = new Discord.MessageEmbed()
                .setDescription(`👍 ${song.title} removed from ${list}`)
                return message.channel.send(embed);
                
            } catch (error) {
                console.log(error);
                let embed = new Discord.MessageEmbed()
                .setTitle('❗ ERROR ❗')
                .setDescription('An error occurred while trying to remove the song')
                .setColor('RED')
                .setTimestamp();

                return message.channel.send(embed);
            }
        } else {
            let embed = new Discord.MessageEmbed()
            .setDescription('❌ Song not found')
            .setColor('RED');

            return message.channel.send(embed);
        }

    }
}

async function find_song(args) {
    if (ytdl.validateURL(args[0])) {
        try {
            const song_info = await ytdl.getBasicInfo(args[0]).catch(err => console.log(err));

            song = { 
                title: song_info.videoDetails.title, 
                url: song_info.videoDetails.video_url,
                //duration: fmtMSS(song_info.videoDetails.lengthSeconds), 
                //channel: song_info.videoDetails.ownerChannelName,
                //thumbnail: song_info.videoDetails.thumbnails[0].url
            }

            return song;

        } catch (err) {
            let embed = new Discord.MessageEmbed()
            .setTitle('❗ ERROR ❗')
            .setDescription('An error occurred while trying to find the video')
            .setColor('RED')
            .setTimestamp();

            message.channel.send(embed);
            return null;
        }

    } else {
        const video_finder = async (query) => {
            const video_result = await ytSearch(query);
            return (video_result.videos.length > 1) ? video_result.videos[0] : null;
        }

        const video = await video_finder(args.join(' '));

        if (video) {
            song = { 
                title: video.title, 
                url: video.url,
                //duration: video.duration.timestamp, 
                //channel: video.author.name,
                //thumbnail: video.thumbnail
            }

            return song;

        } else {
            let embed = new Discord.MessageEmbed()
            .setTitle('❗ ERROR ❗')
            .setDescription('An error occurred while trying to find the video')
            .setColor('RED')
            .setTimestamp();

            message.channel.send(embed);
            return null;
        }
    }
}

function fmtMSS(s){return(s-(s%=60))/60+(9<s?':':':0')+s}
