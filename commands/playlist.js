module.exports = {
    name: 'playlist',
    aliases: ['pl'],
    cooldown: 0,
    description: 'playlist commands',
    async execute(message, args, queue, client, Discord, DB, admin) {

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
            )
            .setColor('RED');

            return message.channel.send(embed);
        }
        
        const cmd = args.shift().toLowerCase();

        switch (cmd) {

            case 'create':
                client.commands.get('playlist_create').execute(message, args, queue, Discord, DB, admin);
                break;

             case 'delete':
                client.commands.get('playlist_delete').execute(message, args, queue, Discord, DB, admin);
                break;

            case 'add':
                client.commands.get('playlist_add').execute(message, args, queue, Discord, DB, admin);
                break;

            case 'remove':
                client.commands.get('playlist_remove').execute(message, args, queue, Discord, DB, admin);
                break;

            case 'play':
                client.commands.get('playlist_play').execute(message, args, queue, Discord, DB, admin);
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









/*
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

module.exports = {
    name: 'playlist',
    aliases: ['pl'],
    cooldown: 0,
    description: 'playlist commands',
    async execute(message, args, queue, Discord, cmd, DB, admin) {

        const voice_channel = message.member.voice.channel;

        if (!voice_channel)
            return message.channel.send('You need to be in a channel to execute this command');

        const server_queue = queue.get(message.guild.id);

        if (!args.length)
            return message.channel.send('You need to send the second argument');
        

        if (cmd === 'create') {
            if (!args[0]) return message.channel.send('Enter playlist name');

            DB.collection("playlists").doc(args[1]).set({
                songs: []
            }).then(() => console.log('playlist created'));


        } else if (cmd === 'play') {
            if (!args[0]) return message.channel.send('Enter list name');

            let list = args.shift();
            let doc = await DB.collection("playlists").doc(list).get()

            if (!doc.exists) return message.channel.send("Playlist not found");
            
            if (!server_queue) {

                const queue_constructor = {
                    voice_channel: voice_channel,
                    text_channel: message.channel,
                    connection: null,
                    songs: []
                }

                queue.set(message.guild.id, queue_constructor);
                doc.data().songs.forEach(song => {
                    queue_constructor.songs.push(song);

                })
                console.log(queue.get(message.guild.id));

                try {
                    const connection = await voice_channel.join();
                    queue_constructor.connection = connection;
                    video_player(message.guild, queue_constructor.songs[0], queue);

                } catch (err) {
                    queue.delete(message.guild.id);
                    message.channel.send('There was an error connecting');
                    throw err;
                }

            } else {
                doc.data().songs.forEach(song => {
                    server_queue.songs.push(song);
                })

                console.log(server_queue);
                //return message.channel.send(`👍 **${song.title}** added to queue!`);
            }
            

        } else if (cmd === 'add') {

            if (args.length < 2) return message.channel.send('Insufficient arguments given');
            
            let list = args.shift();
            let doc = await DB.collection("playlists").doc(list).get()

            if (!doc.exists) return message.channel.send('playlist does not exist')

            console.log("***" + list + "\n***" + args);

            let song = await find_song(args);

            console.log(song);
            
            if (song) {
                try {
                    const unionRes = await DB.collection('playlists').doc(list).update({
                        songs: admin.firestore.FieldValue.arrayUnion(song)
                    });
                    
                } catch (error) {
                    console.log(error);
                }
            } else {
                return message.channel.send("Error finding/adding song");
            }

          

        } else if (cmd === 'remove') {
            if (args.length < 2) return message.channel.send('Insufficient arguments given');
            
            let list = args.shift();
            let doc = await DB.collection("playlists").doc(list).get()

            if (!doc.exists) return message.channel.send('playlist does not exist')

            console.log("***" + list + "\n***" + args);

            let song = await find_song(args);

            console.log(song);
            
            if (song) {
                try {
                    const unionRes = await DB.collection('playlists').doc(list).update({
                        songs: admin.firestore.FieldValue.arrayRemove(song)
                    });
                    
                } catch (error) {
                    console.log(error);
                }
            } else {
                return message.channel.send("Error finding/adding song");
            }

        } 
    }
}

async function find_song(args) {
    if (ytdl.validateURL(args[0])) {
        const song_info = await ytdl.getInfo(args[0]);
        song = { 
            title: song_info.videoDetails.title, 
            url: song_info.videoDetails.video_url 
        }
        return song;

    } else {
        const video_finder = async (query) => {
            const video_result = await ytSearch(query);
            return (video_result.videos.length > 1) ? video_result.videos[0] : null;
        }

        const video = await video_finder(args.join(' '));

        if (video) {
            song = { 
                title: video.title, 
                url: video.url 
            }

            return song;

        } else
            return null;
    }
}

const video_player = async (guild, song, queue) => {
    const song_queue = queue.get(guild.id);

    if (!song) {
        song_queue.voice_channel.leave();
        queue.delete(guild.id);
        return;
    }

    const stream = ytdl(song.url, {
        filter: 'audioonly',
        highWaterMark: 1<<25
    });

    song_queue.connection.play(stream, { seek: 0, volume: 1 }).on('finish', () => {
        song_queue.songs.shift();
        video_player(guild, song_queue.songs[0], queue);
    });

    await song_queue.text_channel.send(`🎶 Now playing **${song.title}**`).then(msg => msg.delete({ timeout: 60000 }))
}

*/