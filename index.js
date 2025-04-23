import { Player } from 'discord-player';
import { YoutubeiExtractor } from 'discord-player-youtubei';
import { Client, GatewayIntentBits, Partials } from 'discord.js';
import 'dotenv/config';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

const player = new Player(client);
player.extractors.register(YoutubeiExtractor, {});

player.events.on('playerStart', (queue, track) => {
  queue.metadata.channel.send(`🎶 Lecture en cours : **${track.title}**`);
});

player.events.on('playerError', (queue, error) => {
  queue.metadata.channel.send(`❌ Erreur lors de la lecture : ${error.message}`);
  console.error('Erreur du lecteur:', error);
});

player.events.on('error', (queue, error) => {
  queue.metadata.channel.send(`❌ Erreur de la queue : ${error.message}`);
  console.error('Erreur de la queue:', error);
});

client.once('ready', () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return;

  const prefix = '!';
  if (!message.content.startsWith(prefix)) return;

  const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/\s+/);

  // Commande !play
  if (cmd === 'play') {
    const query = args.join(' ');
    if (!query) return message.reply('❌ Donne-moi un lien ou un terme de recherche !');

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply('❌ Tu dois être dans un salon vocal !');

    const searchMsg = await message.reply(`🔍 Recherche : **${query}**...`);

    // Crée ou récupère la queue
    const queue = player.nodes.create(message.guild, {
      metadata: { channel: message.channel },
      leaveOnEmpty: true,
      leaveOnEmptyCooldown: 60_000,
      leaveOnEnd: true,
      leaveOnEndCooldown: 60_000,
      volume: 80,
      selfDeaf: true
    });

    try {
      if (!queue.connection) await queue.connect(voiceChannel);

      const result = await player.search(query, {
        requestedBy: message.author,
        searchEngine: 'youtube'
      });

      if (!result.hasTracks()) {
        await searchMsg.edit('❌ Aucun résultat trouvé.');
        return;
      }

      await queue.addTrack(result.tracks[0]);
      await searchMsg.edit(`✅ **${result.tracks[0].title}** ajouté à la file d'attente !`);

      if (!queue.isPlaying()) await queue.node.play();
    } catch (err) {
      console.error(err);
      await searchMsg.edit('❌ Erreur lors de la lecture.');
    }
  }

  // Commande !next
  if (cmd === 'next') {
    const queue = player.nodes.get(message.guild.id);
    if (!queue || !queue.isPlaying()) return message.reply('❌ Rien à passer !');
    await queue.node.skip();
    message.reply('⏭️ Musique suivante !');
  }

  // Commande !disconnect
  if (cmd === 'disconnect') {
    const queue = player.nodes.get(message.guild.id);
    if (!queue) return message.reply('❌ Je ne suis pas connecté !');
    queue.delete();
    message.reply('👋 Déconnecté !');
  }
});

client.login(process.env.BOT_TOKEN);
