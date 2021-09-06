module.exports = {
    name: 'playlist_delete',
    aliases: [],
    cooldown: 0,
    description: 'deletes playlist from database',
    async execute(message, args, queue, Discord, DB, admin) {

        const voice_channel = message.member.voice.channel;

        if (!voice_channel)
            return message.channel.send('You need to be in a channel to execute this command');

        const server_queue = queue.get(message.guild.id);

        if (!args.length)
            return message.channel.send('You need to send the second argument');
        
        if (!args[0]) return message.channel.send('Enter playlist name');

        await DB.collection(message.guild.id).doc(args[0]).delete().then(() => message.channel.send(`Playlist '${args[0]}' deleted!`));
    }
}