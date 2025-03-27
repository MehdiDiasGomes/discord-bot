import { Client, GatewayIntentBits } from 'discord.js';
import { Player } from 'discord-player';
import { YoutubeiExtractor } from "discord-player-youtubei"

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Créer l'instance du Player
const player = new Player(client);

// Initialiser le player et enregistrer les extracteurs
player.extractors.register(YoutubeiExtractor, {})

// Initialiser les événements
player.events.on('playerError', (queue, error) => {
    console.error('Erreur du lecteur:', error);
});

player.events.on('error', (queue, error) => {
    console.error('Erreur de la queue:', error);
});

// Événement pour indiquer le début d'une piste
player.events.on('playerStart', (queue, track) => {
    queue.metadata.channel.send(`🎵 Lecture en cours: **${track.title}** - ${track.author}`);
});

client.once("ready", () => {
    console.log(`✅ Connecté en tant que ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
    // Ignore les messages des bots
    if (message.author.bot) return;

    // Commande de déconnexion
    if (message.content === "!disconnect") {
        try {
            const queue = player.nodes.get(message.guildId);

            if (queue) {
                queue.delete();
                return message.reply("👋 Allez salam !");
            } else {
                return message.reply("❌ Je ne suis pas connecté à un salon vocal !");
            }
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
            return message.reply("❌ Une erreur s'est produite lors de la déconnexion!");
        }
    }

    // Commande next pour passer à la musique suivante
    if (message.content === "!next") {
        try {
            const queue = player.nodes.get(message.guildId);

            if (!queue) {
                return message.reply("❌ Je ne suis pas en train de jouer de la musique !");
            }

            if (queue.tracks.size === 0) {
                return message.reply("❌ Il n'y a pas de musique suivante dans la file d'attente !");
            }

            await queue.node.skip();
            return message.reply("⏭️ Musique suivante !");
        } catch (error) {
            console.error("Erreur lors du passage à la musique suivante:", error);
            return message.reply("❌ Une erreur s'est produite lors du passage à la musique suivante!");
        }
    }

    // Commande play
    if (message.content.startsWith("!play")) {
        const args = message.content.split(" ");
        const query = args.slice(1).join(" ");

        if (!query) return message.reply("❌ Donne-moi un lien YouTube ou un terme de recherche !");

        // Vérifier si l'utilisateur est dans un salon vocal
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.reply("❌ Tu dois être dans un salon vocal pour utiliser cette commande !");

        try {
            const searchMessage = await message.reply(`🔍 Recherche en cours pour: **${query}**...`);

            // Créer une file d'attente ou utiliser celle existante
            const queue = player.nodes.create(message.guild, {
                metadata: {
                    channel: message.channel,
                    client: message.client,
                    requestedBy: message.author
                },
                selfDeaf: true,
                volume: 80,
                leaveOnEmpty: true,
                leaveOnEmptyCooldown: 60000, // 1 minute
                leaveOnEnd: true,
                leaveOnEndCooldown: 60000, // 1 minute
            });

            // Se connecter au salon vocal si ce n'est pas déjà fait
            if (!queue.connection) {
                await queue.connect(voiceChannel);
            }

            // Recherche de la musique - essayer avec youtube comme moteur de recherche
            const result = await player.search(query, {
                requestedBy: message.author,
                searchEngine: "youtube" // Utiliser le moteur de recherche standard YouTube
            });

            console.log("Résultat de la recherche:", result);

            if (!result || !result.tracks || !result.tracks.length) {
                await searchMessage.edit("❌ Aucune musique trouvée !");
                return;
            }

            // Ajouter la piste à la file d'attente
            const track = result.tracks[0];
            await queue.addTrack(track);

            await searchMessage.edit(`✅ **${track.title}** a été ajouté à la file d'attente!`);

            // Démarrer la lecture si nécessaire
            if (!queue.isPlaying()) {
                await queue.node.play();
            }
        } catch (error) {
            console.error("Erreur lors de la lecture:", error);
            message.reply(`❌ Une erreur s'est produite: ${error.message}`);
        }
    }
});

// Remplacez par une variable d'environnement dans un environnement de production
client.login("MTAxNzAwMDczMTc5MTg1MTYwMg.GZTW2Q.ArtkwetL4J15Zp583-BD3X6KbIgyx-v2Vo2Hxc");
