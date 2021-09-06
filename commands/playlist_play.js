const ytdl = require('ytdl-core');

module.exports = {
    name: 'playlist_play',
    aliases: [],
    cooldown: 0,
    description: 'plays songs from playlist',
    async execute(message, args, queue, Discord, DB, admin) {

        const voice_channel = message.member.voice.channel;
        const server_queue = queue.get(message.guild.id);

        if (!voice_channel) {
            let embed = new Discord.MessageEmbed()
            .setDescription('❌ You need to join a voice channel to use this command')
            .setColor('RED');

            return message.channel.send(embed);
        }

        if (!args[0]) { 
            let embed = new Discord.MessageEmbed()
            .setDescription('❌ Enter the name of the list to play')
            .setColor('RED');

            return message.channel.send(embed);
        }

        let list = args.shift();
        let doc = await DB.collection(message.guild.id).doc(list).get()

        if (!doc.exists) {
            let embed = new Discord.MessageEmbed()
            .setDescription('❌ Playlist not found')
            .setColor('RED');

            return message.channel.send(embed);
        }
        
        if (!server_queue) {

            const queue_constructor = {
                voice_channel: voice_channel,
                text_channel: message.channel,
                connection: null,
                songs: []
            }

            queue.set(message.guild.id, queue_constructor);
            let songs = await shuffle(doc.data().songs);
            //songs.forEach(song => {queue_constructor.songs.push(song)});
            
            try {
                queue_constructor.connection = await voice_channel.join();
                ///*
                let song_info = await ytdl.getBasicInfo(songs.shift().url);
                songData = { 
                    title: song_info.videoDetails.title, 
                    url: song_info.videoDetails.video_url,
                    duration: fmtMSS(song_info.videoDetails.lengthSeconds), 
                    channel: song_info.videoDetails.ownerChannelName,
                    thumbnail: song_info.videoDetails.thumbnails[0].url
                }
                queue_constructor.songs.push(songData);
                //*/
                video_player(message.guild, queue_constructor.songs[0], queue, Discord);
                ///*
                songs.forEach(async song => {
                    song_info = await ytdl.getBasicInfo(song.url).catch(err => console.log(err));
                    
                    songData = { 
                        title: song_info.videoDetails.title, 
                        url: song_info.videoDetails.video_url,
                        duration: fmtMSS(song_info.videoDetails.lengthSeconds), 
                        channel: song_info.videoDetails.ownerChannelName,
                        thumbnail: song_info.videoDetails.thumbnails[0].url
                    }

                    queue_constructor.songs.push(songData)
                });
                //*/
            } catch (err) {
                queue.delete(message.guild.id);
                console.log(err);

                let embed = new Discord.MessageEmbed()
                .setTitle('❗ ERROR ❗')
                .setDescription('An error occurred while trying to connect')
                .setColor('RED')
                .setTimestamp();

                return message.channel.send(embed);
            }

        } else {
            let songs = await shuffle(doc.data().songs);
            //songs.forEach(song => {server_queue.songs.push(song)});
            ///*
            songs.forEach(async song => {
                const song_info = await ytdl.getBasicInfo(song.url).catch(err => console.log(err));
                songData = { 
                    title: song_info.videoDetails.title, 
                    url: song_info.videoDetails.video_url,
                    duration: fmtMSS(song_info.videoDetails.lengthSeconds), 
                    channel: song_info.videoDetails.ownerChannelName,
                    thumbnail: song_info.videoDetails.thumbnails[0].url
                }
                server_queue.songs.push(songData)
            });
            //*/
            let embed = new Discord.MessageEmbed()
            .setDescription(`👍 **${list}** added to queue`);
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

async function shuffle(array) {
  var currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}