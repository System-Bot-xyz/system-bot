const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const QuickChart = require("quickchart-js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("membercount-chart")
    .setDescription("Shows the member count chart!"),

  async execute(interaction) {
    const guild = interaction.guild;
    const totalMembers = guild.memberCount;
    const botMembers = guild.members.cache.filter(
      (member) => member.user.bot
    ).size;
    const humanMembers = totalMembers - botMembers;

    const chart = new QuickChart();
    chart
      .setConfig({
        type: "bar",
        data: {
          labels: ["Total", "Members", "Bots", "24h", "7D"],
          datasets: [
            {
              label: "Member Count",
              data: [totalMembers, humanMembers, botMembers],
              backgroundColor: [
                "#36a2eb",
                "#ffce56",
                "#ff6384",
                "#cc65fe",
                "#66ff99",
              ],
            },
          ],
        },
      })
      .setWidth(500)
      .setHeight(300)
      .setBackgroundColor("#151515");

    const chartURL = await chart.getShortURL();
    const embed = new EmbedBuilder()
      .setTitle("Member Count Chart")
      .setDescription(
        `😲| Total: **${totalMembers}**\n👷‍♂| Members: **${humanMembers}**\n Bots: **${botMembers}**`
      )
      .setImage(chartURL);

    await interaction.reply({ embeds: [embed] });
  },
};
