import { Bot } from "grammy";

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

bot.start();