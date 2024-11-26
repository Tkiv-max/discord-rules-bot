const { Client, Intents, MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const rules = require('./rules.json');
const fs = require('fs');
const { startServer } = require("./alive.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });


client.once("ready", () => {
  console.log(`Bot is Ready! ${client.user.tag}`);
  console.log(`Code by Wick Studio`);
  console.log(`discord.gg/wicks`);
});


client.on('messageCreate', async message => {
  if (message.content === '!rules') {
    if (message.member.permissions.has("ADMINISTRATOR")) {
      const row = new MessageActionRow()
        .addComponents(
          new MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('يرجى الاختيار')
            .addOptions(rules.map(rule => ({
              label: rule.title,
              description: rule.id,
              value: rule.id,
            }))),
        );

      const embed = new MessageEmbed()
        .setColor('#2bc0e2')
        .setThumbnail('https://media.discordapp.net/attachments/1087801360461873216/1310100390855049357/OS_BLUE...png?ex=6745f7d1&is=6744a651&hm=8bc6ea4adadef0b6f90de86d23deb7b31c7de659fed7f6cb27b666f878f2bbdc&=&format=webp&quality=lossless&width=314&height=314')
        .setTitle('Old Souls RP')
        .setDescription('**جميع القوانين التابعه لسيرفر اولد سولز نرجوا منك إتباع جميع القوانين لكي لا يتم محاسبتك**')
        .setImage('https://media.discordapp.net/attachments/1087801360461873216/1310100347255263325/Old_souls_banner_png.png?ex=6745f7c7&is=6744a647&hm=f151460ef76d03a067f2505dd8b62b5ecb8feeba4a16ee1c827d1b2ed9cefb1c&=&format=webp&quality=lossless&width=1619&height=909')
        .setFooter({ text: 'Developer Department For Old Souls' })
        .setTimestamp();

      const sentMessage = await message.channel.send({ embeds: [embed], components: [row] });
      await message.delete();
    } else {
      await message.reply({ content: "You need to be an administrator to use this command.", ephemeral: true });
    }
  }
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isSelectMenu()) {
    const rule = rules.find(r => r.id === interaction.values[0]);
    const text = fs.readFileSync(rule.description, 'utf-8');
    const ruleEmbed = new MessageEmbed()
      .setColor('#f8ca3d')
      .setTitle(rule.title)
      .setDescription(text)
      .setFooter({ text: 'Developer Department For Old Souls' })
      .setTimestamp();

    await interaction.reply({ embeds: [ruleEmbed], ephemeral: true });
  }
});

startServer();

client.login(process.env.TOKEN);
