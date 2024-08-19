import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import 'dotenv/config'
import fs from 'node:fs'

const bot = new Telegraf(process.env.BOT_TOKEN)

function parseMessage(text) {
  return text.split(" ");
}

// Luetaan koodisanat ja niiden merkitykset
const tiedostoRaw = fs.readFileSync('viestit.json', 'utf-8', (err, data) => {
  if (err) {
    console.error(err);
    return "";
  }
  return data;
});

const vihjeet = JSON.parse(tiedostoRaw)
const vihjesanat = Object.keys(vihjeet);
console.log(vihjesanat);

const virheviestit = vihjeet.vituiksmanviestit;
const virheviestienLkm = virheviestit.length;

// console.log(koodisanat.ludviginBordellilinnat);

bot.command('kukasiellaon', async (ctx) => {
  // Using context shortcut
  await ctx.reply(vihjeet.tervetuliaisviestiosa1)

  await new Promise(r => setTimeout(r, 5000));

  // Using context shortcut
  await ctx.reply(vihjeet.tervetuliaisviestiosa2)

})


bot.on(message('text'), async (ctx) => {

  const message = ctx.message.text;

  // Katsotaan, onko viestillä mitään merkitystä.
  const avainsanat = parseMessage(message);
  console.log(avainsanat);
  let wordFound = false;

  avainsanat.forEach(sana => {
    if (vihjeet[sana] != undefined) {
      // console.log(`OOSUMA LÖYTYI! Nimittäin teksti \n${vihjeet[sana]}`)
      // Using context shortcut
      ctx.reply(vihjeet[sana])
      wordFound = true;
    }
    else {
      // console.log(`Ei täsmää sana ${sana}`)
    };
  });

  
  const randomVastausInt = Math.floor(Math.random() * virheviestienLkm);
  // Mikäli vihjesanaa ei löytynyt viestistä
  wordFound ? "" : ctx.reply(virheviestit[randomVastausInt]);
  
})

// bot.on('callback_query', async (ctx) => {
//   // Explicit usage
//   await ctx.telegram.answerCbQuery(ctx.callbackQuery.id)

//   // Using context shortcut
//   await ctx.answerCbQuery()
// })

// bot.on('inline_query', async (ctx) => {
//   const result = []
//   // Explicit usage
//   await ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, result)

//   // Using context shortcut
//   await ctx.answerInlineQuery(result)
// })

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))