const {SlashCommandBuilder} = require("@discordjs/builders");
const {inlineCode} = require("discord.js");
const Player = require("../gameclasses/Player.cjs");
const addPlayerToGame = require("../util/addPlayerToGame.cjs");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("joingame")
    .setDescription("Join an existing game of tos"),
    execute: joinGame()
};


async function joinGame(client, interaction, params){
    const channelName = interaction.channel.name;
    if (!(new RegExp("^tos-channel(-[1-9])?$").test(channelName))){
        return await interaction.followUp("A game can only be played on a channel with a name matching the format \"tos-channel\" or \"tos-channel-[n]\", where n is a positive integer between 1 and 9.");
    }
    const channelNumber = channelName.split("-").length == 2 ? 0 : +channelName.split("-")[2]; 

    if(!client.games.get(interaction.guildID).get(channelNumber).ongoing){
        return await interaction.followUp(`No game has been started yet! To start a game, use the ${inlineCode("/startgame")} command.`);
    }

    if(client.games.get(interaction.guildID).get(channelNumber).players.filter((player) => {player.id == interaction.member.id}).length){
        return await interaction.followUp(`You've already joined this game!`);
    }

    addPlayerToGame(client, interaction.guildID, channelNumber, new Player(interaction.member.id));
}