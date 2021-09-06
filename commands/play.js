const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

module.exports = {
    name: 'play',
    aliases: ['p'],
    cooldown: 0,
    description: 'adds input song to queue',
    async execute(message, args, queue, Discord) {

        const voice_channel = message.member.voice.channel;
        const server_queue = queue.get(message.guild.id);
        let song = {};

        if (!voice_channel) {
            let embed = new Discord.MessageEmbed()
            .setDescription('❌ You need to join a voice channel to use this command')
            .setColor('RED');

            return message.channel.send(embed);
        }

        if (!args.length) {
            let embed = new Discord.MessageEmbed()
            .setDescription('❌ Enter the video to search for and play')
            .setColor('RED');

            return message.channel.send(embed);
        }


        if (ytdl.validateURL(args[0])) {
            try {
                const song_info = await ytdl.getBasicInfo(args[0]).catch(err => console.log(err));
                song = { 
                    title: song_info.videoDetails.title, 
                    url: song_info.videoDetails.video_url,
                    duration: fmtMSS(song_info.videoDetails.lengthSeconds), 
                    channel: song_info.videoDetails.ownerChannelName,
                    thumbnail: song_info.videoDetails.thumbnails[0].url
                }

            } catch (err) {
                let embed = new Discord.MessageEmbed()
                .setTitle('❗ ERROR ❗')
                .setDescription('An error occurred while trying to find the video')
                .setColor('RED')
                .setTimestamp();

                return message.channel.send(embed);
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
                    duration: video.duration.timestamp, 
                    channel: video.author.name,
                    thumbnail: video.thumbnail
                }

            } else {
                let embed = new Discord.MessageEmbed()
                .setTitle('❗ ERROR ❗')
                .setDescription('An error occurred while trying to find the video')
                .setColor('RED')
                .setTimestamp();

                return message.channel.send(embed);
            }
        }

        if (!server_queue) {
            const queue_constructor = {
                voice_channel: voice_channel,
                text_channel: message.channel,
                connection: null,
                songs: []
            }

            queue.set(message.guild.id, queue_constructor);
            queue_constructor.songs.push(song);

            try {
                const connection = await voice_channel.join();
                queue_constructor.connection = connection;
                video_player(message.guild, queue_constructor.songs[0], queue, Discord);

            } catch (err) {
                queue.delete(message.guild.id);
                let embed = new Discord.MessageEmbed()
                .setTitle('❗ ERROR ❗')
                .setDescription('An error occurred while trying to connect')
                .setColor('RED')
                .setTimestamp();

                return message.channel.send(embed);
            }

        } else {
            server_queue.songs.push(song);

            let embed = new Discord.MessageEmbed()
            .setTitle(song.title)
            .setThumbnail(song.thumbnail)
            .setAuthor('👍 Added to queue')
            .setURL(song.url)
            .addFields(
                { name: 'Channel', value: song.channel, inline: true },
                { name: 'Duration', value: song.duration, inline: true },
                { name: 'Queue Position', value: server_queue.songs.length-1, inline: true }
            )
            .setColor('GREEN');

            return message.channel.send(embed);
        }

    }

}

const video_player = async (guild, song, queue, Discord) => {
    const song_queue = queue.get(guild.id);

    if (!song) {
        song_queue.voice_channel.leave();
        queue.delete(guild.id);
        return;
    }

    const stream = ytdl(song.url, { 
        filter: 'audioonly' ,
        highWaterMark: 1<<25
    });

    song_queue.connection.play(stream, { seek: 0, volume: 1 }).on('finish', () => {
        song_queue.songs.shift();
        video_player(guild, song_queue.songs[0], queue, Discord);
    });

    let embed = new Discord.MessageEmbed()
    .setTitle(song.title)
    .setThumbnail(song.thumbnail)
    .setAuthor('🎶 Now Playing')
    .setURL(song.url)
    .addFields(
        { name: 'Channel', value: song.channel, inline: true },
        { name: 'Duration', value: song.duration, inline: true },
        { name: 'Queue Position', value: 'Playing Now', inline: true }
    )
    .setColor('BLUE');

    await song_queue.text_channel.send(embed);
}


function fmtMSS(s){return(s-(s%=60))/60+(9<s?':':':0')+s}
