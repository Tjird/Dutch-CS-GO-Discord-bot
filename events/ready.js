module.exports = (client) => {
    console.log("Discord is ready.");

    let usercount = client.guilds.get("656565865667624990");

    client.user.setActivity(`${usercount.memberCount} users`, {
        type: "WATCHING"
    });

    setInterval(() => {
        usercount = client.guilds.get("656565865667624990");

        client.user.setActivity(`${usercount.memberCount} users`, {
            type: "WATCHING"
        });
    }, 1000);
}