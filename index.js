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
        .setThumbnail('https://images-ext-1.discordapp.net/external/gOAtmmNdVbNivCINrR4456FHrFrybNjQdgWjW_1T3XQ/%3Fsize%3D512/https/cdn.discordapp.com/icons/1102954233013215272/f2130546947ed5072fef66d386d95e9a.png?format=webp&quality=lossless&width=460&height=460')
        .setTitle('Old Souls RP')
        .setDescription('**جميع القوانين التابعه لسيرفر اولد سولز نرجوا منك إتباع جميع القوانين لكي لا يتم محاسبتك**')
        .setImage('https://media.discordapp.net/attachments/1087801360461873216/1310100347255263325/Old_souls_banner_png.png?ex=6743fd87&is=6742ac07&hm=ad018fa4ab624529a3ecd2c6a376a8e31cb9a11f9dd0c7069bfc9254afc12cc9&=&format=webp&quality=lossless&width=494&height=278')
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
