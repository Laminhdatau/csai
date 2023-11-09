const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  makeInMemoryStore
} = require("@whiskeysockets/baileys");

async function connectToWhatsapp() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");
  const store = makeInMemoryStore({});
  store.readFromFile("./baileys_store.json");

  setInterval(() => {
    store.writeToFile("./baileys_store.json");
  }, 1000);

  const sock = makeWASocket({
    level: "debug",
    printQRInTerminal: true,
    auth: state,
  });
  store.bind(sock.ev);
  sock.ev.on("chats.set", () => {
    console.log("got chats", store.chats.all());
  });

  sock.ev.on("contacts.set", () => {
    console.log("got contacs", Object.values(store.contacts));
  });
  sock.ev.on("creds.update", saveCreds);
  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log(
        "connection closed due to ",
        lastDisconnect.error,
        ", reconnecting ",
        shouldReconnect
      );
      if (shouldReconnect) {
        connectToWhatsapp();
      }
    } else if (connection === "open") {
      console.log("Open Connection");
    }
  });
  sock.ev.on("messages.upsert", async ({ messages }) => {
    console.log("got messages", messages);
  });

  //   const id = "087863362230@s.whatsapp.net"; // the WhatsApp ID
  //   // Mengirim pesan teks sederhana
  //   sock.sendMessage(id, { text: "oh hello there" });

  //   // Mengirim pesan balasan
  //   sock.sendMessage(id, { text: "oh hello there" }, { quoted: "hai" });

  //   // Mengirim pesan mention
  //   sock.sendMessage(id, {
  //     text: "@082271305463",
  //     mentions: ["082271305463@s.whatsapp.net"],
  //   });

  //   // Mengirim lokasi
  //   sock.sendMessage(id, {
  //     location: { degreesLatitude: 24.121231, degreesLongitude: 55.1121221 },
  //   });

  //   // Mengirim kontak
  //   const vcard =
  //     "BEGIN:VCARD\n" +
  //     "VERSION:3.0\n" +
  //     "FN:Jeff Singh\n" +
  //     "ORG:Ashoka Uni;\n" +
  //     "TEL;type=CELL;type=VOICE;waid=911234567890:+91 12345 67890\n" +
  //     "END:VCARD";
  //   sock.sendMessage(id, {
  //     contacts: {
  //       displayName: "Jeff",
  //       contacts: [{ vcard }],
  //     },
  //   });

  //   // Mengirim pesan tombol
  //   const buttons = [
  //     { buttonId: "id1", buttonText: { displayText: "Button 1" }, type: 1 },
  //     { buttonId: "id2", buttonText: { displayText: "Button 2" }, type: 1 },
  //     { buttonId: "id3", buttonText: { displayText: "Button 3" }, type: 1 },
  //   ];
  //   const buttonMessage = {
  //     text: "Hi it's button message",
  //     footer: "Hello World",
  //     buttons: buttons,
  //     headerType: 1,
  //   };
  //   sock.sendMessage(id, buttonMessage);

  //   // Mengirim pesan template
  //   const templateButtons = [
  //     {
  //       index: 1,
  //       urlButton: {
  //         displayText: "⭐ Star Baileys on GitHub!",
  //         url: "https://github.com/adiwajshing/Baileys",
  //       },
  //     },
  //     {
  //       index: 2,
  //       callButton: { displayText: "Call me!", phoneNumber: "+1 (234) 5678-901" },
  //     },
  //     {
  //       index: 3,
  //       quickReplyButton: {
  //         displayText: "This is a reply, just like normal buttons!",
  //         id: "id-like-buttons-message",
  //       },
  //     },
  //   ];
  //   const templateMessage = {
  //     text: "Hi it's a template message",
  //     footer: "Hello World",
  //     templateButtons: templateButtons,
  //   };
  //   sock.sendMessage(id, templateMessage);

  //   // Mengirim pesan daftar
  //   const sections = [
  //     {
  //       title: "Section 1",
  //       rows: [
  //         { title: "Option 1", rowId: "option1" },
  //         {
  //           title: "Option 2",
  //           rowId: "option2",
  //           description: "This is a description",
  //         },
  //       ],
  //     },
  //     {
  //       title: "Section 2",
  //       rows: [
  //         { title: "Option 3", rowId: "option3" },
  //         {
  //           title: "Option 4",
  //           rowId: "option4",
  //           description: "This is a description V2",
  //         },
  //       ],
  //     },
  //   ];

  //   const listMessage = {
  //     text: "This is a list",
  //     footer: "nice footer, link: https://google.com",
  //     title: "Amazing boldfaced list title",
  //     buttonText: "Required, text on the button to view the list",
  //     sections,
  //   };
  //   sock.sendMessage(id, listMessage);

  //   // Mengirim pesan reaksi
  //   const reactionMessage = {
  //     react: {
  //       text: "💖", // gunakan string kosong untuk menghapus reaksi
  //       key: message.key,
  //     },
  //   };
  //   sock.sendMessage(id, reactionMessage);
}
connectToWhatsapp();
