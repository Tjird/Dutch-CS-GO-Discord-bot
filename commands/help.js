const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    const embed = new Discord.RichEmbed()
        .setColor('ff0000')
        .setTitle('Help menu')
        .setDescription(`Hey! Ik heb maar 1 opdracht die jij mij kan laten uitvoeren. Dit betreft !rank <friend_code>.
        Door dit commando uit te voeren kan jij een Discord rank krijgen gelijk aan jou CS:GO rank.
        Om dit process te kunnen uitvoeren moet jij jou eigen "friend code" invoeren.`)
        .addField("Waar kun jij een friend code vinden?", `1. Klik bovenin bij Steam het kopje "Friends"
        2. Klik op "Add a Friend..."
        Nu zal je onder "Your Friend Code" een code zien, dit is jou friend code!`);

    return message.channel.send(embed);
}