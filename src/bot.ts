import { Bot, webhookCallback } from "grammy";
import express from "express";

const bot = new Bot(process.env.TELEGRAM_TOKEN || "");
const twitterRegex = /https:\/\/(twitter\.com|x\.com)/g;
const tiktokRegex = /vm.tiktok.com|www.tiktok.com/g;
const instagramRegex = /www.instagram.com/g;
const mastodonRegex = /https:\/\/(?!twitter\.com|instagram\.com)[a-zA-Z0-9.-]+\/@[a-zA-Z0-9_]+\/[0-9]+/g

const replyWithIntro = async (ctx: any) => {
  let input = ctx.message.text;

  const isTweet = twitterRegex.test(input);
  const isTikTok = tiktokRegex.test(input);
  const isInstagram = instagramRegex.test(input);
  const isToot = mastodonRegex.test(input);

  const isSocialMediaPost = isTweet || isTikTok || isInstagram || isToot;

  if (isSocialMediaPost) {
    let rant = '';
    switch (true){
      case isInstagram: rant = 'no dd?'; break;
      case isTikTok: rant = 'no vx?'; break;
      case isTweet: rant = 'no fx?'; break;
      case isToot: rant = 'no fxmas?'; break;
    };

    let response = input.match(/https?:\/\/[^\s]+/)[0].split('?')[0];
    let formattedOutput = response;

    if (isToot) {
      const instanceRegex = /([a-zA-Z0-9.-]+)\/@[a-zA-Z0-9_]+\/[0-9]+/;

      // First retrieves full link, then instance name
      const getInstance = response.match(instanceRegex);

      const link = getInstance![0];
      const instance = getInstance![1];

      formattedOutput = link.replace(instance, `https://fxmas.to/${instance}`);
    } else {
      formattedOutput = `${rant} ${response.replace(twitterRegex, "https:\/\/fixupx.com")
      .replace('tiktok', "vxtiktok")
      .replace('instagram', "ddinstagram")}`;
    }

    ctx.reply(formattedOutput, {
      parse_mode: "HTML",
      reply_to_message_id: ctx.msg.message_id,
    });
  }
}

bot.on("message", replyWithIntro);

// Start the server
if (process.env.NODE_ENV === "production") {
  // Use Webhooks for the production server
  const app = express();
  app.use(express.json());
  app.use(webhookCallback(bot, "express"));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Bot listening on port ${PORT}`);
  });
} else {
  // Use Long Polling for development
  bot.start();
}