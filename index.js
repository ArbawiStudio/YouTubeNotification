const Discord = require("discord.js");
const client = new Discord.Client();
client.db = require("quick.db");
client.request = new (require("rss-parser"))();
client.config = require("./config.js");


const activities_list = [
  'YouTube Video Notification BOT',
  '📢 Watch a Videos now'
  ]
client.on("ready", () => {
  setInterval(() => {

		const index = Math.floor(Math.random() * (activities_list.length - 1) + 1); // generates a random number between 1 and the length of the activities array list (in this case 5).

		client.user.setActivity(activities_list[index]); // sets bot's activities to one of the phrases in the arraylist.

	}, 15000); //

	client.user.setPresence({ status: 'idle' });
    console.log(`Logged in as ${client.user.tag}`)
    console.log(`Support Server > https://www.discord.gg/3Zaxc3EaYt`)
    handleUploads();
  client.user.setActivity(`YourName`, ({type: "WATCHING", url: "https://www.twitch.tv/username"})) //STREAMING
});

function handleUploads() {
    if (client.db.fetch(`postedVideos`) === null) client.db.set(`postedVideos`, []);
    setInterval(() => {
        client.request.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${client.config.channel_id}`)
        .then(data => {
            if (client.db.fetch(`postedVideos`).includes(data.items[0].link)) return;
            else {
                client.db.set(`videoData`, data.items[0]);
                client.db.push("postedVideos", data.items[0].link);
                let parsed = client.db.fetch(`videoData`);
                let channel = client.channels.cache.get(client.config.channel);
                if (!channel) return;
              
              let message = client.config.messageTemplate
                    .replace(/{author}/g, parsed.author)
                    .replace(/{title}/g, Discord.Util.escapeMarkdown(parsed.title))
                    .replace(/{url}/g, parsed.link);
                channel.send(message);
            }
        });
    }, 30000);
}

client.login(process.env.TOKEN);
