module.exports = async (client, CSGO, steamFriends, message) => {
    if (message.author.bot) return;
    if (!message.guild || message.guild == undefined) return;

    const prefix = client.prefix;
    const channel = message.channel;
    const author = message.author;
    const guild = message.guild;

    if (!message.content.toLowerCase().startsWith(prefix)) return;

    const args = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/g);

    const command = args.shift().toLowerCase();

    if (!command) return;

    const cmd = client.commands.get(command);

    if (!cmd) return;

    return cmd.run(client, message, args, CSGO, steamFriends);
}