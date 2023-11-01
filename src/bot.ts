import { Bot, webhookCallback } from "grammy";
import express from "express";

const bot = new Bot(process.env.TELEGRAM_TOKEN || "");
const twitterRegex = /https:\/\/(twitter\.com|x\.com)/g;
const tiktokMobileRegex = /vm.tiktok.com/g;
const tiktokDesktopRegex = /www.tiktok.com/g;

const replyWithIntro = (ctx: any) => {
  let input = ctx.message.text;

  const isTweet = twitterRegex.test(input);
  const isTikTok = tiktokMobileRegex.test(input) || tiktokDesktopRegex.test(input);

  if (isTweet || isTikTok) {
    let rant = isTweet ? 'no fx?' : 'no vx?';
    let formattedOutput = `${rant} ${input.replace(twitterRegex, "https:\/\/fixupx.com")
                                          .replace(tiktokMobileRegex, "vm.vxtiktok.com")
                                          .replace(tiktokDesktopRegex, "www.vxtiktok.com")}
  `;

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