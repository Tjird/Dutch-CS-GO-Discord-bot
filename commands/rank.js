const SteamID = require('steamid');

const rolesList = [
    656567790484062238, // No rank
    656567577279201301, // Silver 1
    656568905422077972, // Silver 2
    656569577681059884, // Silver 3
    656569974931980288, // Silver 4
    656570119983595521, // Silver Elite
    656570202284359680, // Silver Elite Master
    656570345477898241, // Gold Nova 1
    656570472833482762, // Gold Nova 2
    656570572829884417, // Gold Nova 3
    656570746453360653, // Gold Nova Master
    656570847846203424, // Master Guardian 1
    656570914586099713, // Master Guardian 2
    656572727678861332, // Master Guardian Elite
    656572837296865291, // Distinguished Master Guardian
    656573090528231426, // Legendary Eagle
    656573166709112842, // Legendary Eagle Master
    656573293276692520, // Supreme Master First Class
    656573695233622016 // Global Elite CS GO
];
const ranksList = {
    0: "656567790484062238",
    1: "656567577279201301",
    2: "656568905422077972",
    3: "656569577681059884",
    4: "656569974931980288",
    5: "656570119983595521",
    6: "656570202284359680",
    7: "656570345477898241",
    8: "656570472833482762",
    9: "656570572829884417",
    10: "656570746453360653",
    11: "656570847846203424",
    12: "656570914586099713",
    13: "656572727678861332",
    14: "656572837296865291",
    15: "656573090528231426",
    16: "656573166709112842",
    17: "656573293276692520",
    18: "656573695233622016"
}

exports.run = async (client, message, args, CSGO, steamFriends) => {
    const channel = message.channel;
    const author = message.author;
    const guild = message.guild;
    const member = message.member;
    const roles = member.roles;
    let mTemp;

    if (!args[0] || args[0] == undefined) return channel.send("Je moet wel een friend code invullen anders kan ik jou geen rank geven 🤷 " + author);

    const iSteamID = args[0];

    if (!/^\d+$/.test(iSteamID)) return channel.send("De friend code die jij hebt gestuurd is niet legitiem " + author);

    const SteamID3 = new SteamID(`[U:1:${args[0]}]`);
    const SteamID64 = SteamID3.getSteamID64();

    if (!SteamID3.isValid()) return channel.send("De friend code die jij hebt gestuurd is niet legitiem " + author);

    steamFriends.addFriend(SteamID64);
    channel.send(`Een friend request is naar je toe gestuurd, mijn username is: \`Tjird BOT\`.\nOver 60 seconden worden jou gegevens nagekeken, hiervoor is het accepteren van het friend request nodig... ${author}`)
        .then(m => mTemp = m);

    await sleep(60000);

    const AccountID = CSGO.ToAccountID(SteamID64);

    CSGO.once("playerProfile", async data => {
        if (data.account_profiles.length < 1) return;

        const pData = data.account_profiles[0];

        if (pData.account_id !== AccountID) return;
        if (pData.ranking === null) {
            if (roles.find(r => r.id === "656567790484062238")) return mTemp.edit(`Je moet het friend request wel accepteren knuppel. Heb je dit wel gedaan? Ga verdomme dan competitive spelen!\nJe krijgt hierdoor een \`No Rank\` role alleen in jou geval heb je deze al... ${author}`);

            mTemp.edit(`Je moet het friend request wel accepteren knuppel. Heb je dit wel gedaan? Ga verdomme dan competitive spelen!\nJe krijgt hierdoor een \`No Rank\` role. ${author}`);
            member.addRole("656567790484062238")
                .catch(error => {
                    console.log(error);
                    channel.send(`Je rank kon niet veranderd worden. Deze zou moeten worden verzet naar \`No Rank\`. <@656597707896651829> <@656598790890848259>`);
                });
        }

        steamFriends.removeFriend(SteamID64);

        const rankRole = getRole(pData.ranking.rank_id);

        if (roles.find(r => r.id === rankRole)) return mTemp.edit(`Je CS:GO rank is ongewijzigd. Probeer het later nog eens wanneer je een nieuwe rank hebt. ${author}`);

        for (let role of roles) {
            if (rolesList.includes(role[0])) continue;

            try {
                await member.removeRole(`${role[0]}`);
            } catch (e) {
                console.log(e);
            }
        }

        member.addRole(`${rankRole}`)
            .then(() => {
                mTemp.edit(`Je rank is gewijzigd naar \`${CSGO.Rank.getString(pData.ranking.rank_id)}\`. ${author}`);
            })
            .catch(error => {
                console.log(error);
                mTemp.edit(`Je rank kon niet veranderd worden. Deze zou moeten worden verzet naar \`${CSGO.Rank.getString(pData.ranking.rank_id)}\`. <@656597707896651829> <@656598790890848259>`);
            });
    })

    CSGO.playerProfileRequest(AccountID);
}

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

function getRole(rank_id) {
    return ranksList[rank_id];
}