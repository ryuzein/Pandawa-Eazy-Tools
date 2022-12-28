const TelegramBot = require('node-telegram-bot-api')
const token = process.env.TOKEN
const bot = new TelegramBot(token, { polling: true })
const gojec = require('./helper/gojec.js')
const { cekResi } = require('./helper/rajaonkir')
const { inlineMenu, inlinecekResi, inlineGojek } = require('./helper/inline')

// YOUR CODE STARTS HERE

bot.onText(/(\/start)|(\/io)/, (msg) => {
    const menukey = { reply_markup: inlineMenu }
    bot.sendMessage(msg.chat.id, 'On Your Command Master!', menukey).then((answr) => {
        const opts = {
            chat_id: answr.chat.id,
            message_id: answr.message_id
        }
        bot.once('callback_query', (data) => {
            switch (data.data) {
                case 'gojek':
                    bot.editMessageReplyMarkup(inlineGojek, opts).then(async () => await functGojek(data.message))
                    break
                case 'resi':
                    bot.editMessageReplyMarkup(inlinecekResi, opts).then(async () => await functCekResi(data.message))
                    break
                case 'back':
                    bot.editMessageReplyMarkup(inlineMenu, opts)
                    break
            }
        })
    })
})

// Section - General

bot.on('message', async (msg) => {
    const Id = msg.id
    const chatId = msg.chat.id
    const text = msg.text.toString()
    if (text == '/info') {
        const info = 'Chat info: ' + msg
        console.log(msg)
        bot.sendMessage(chatId, JSON.parse(info))
    }
})

const functCekResi = (msg) => new Promise(() => {
    bot.once('callback_query', (answr) => {
        if (['jne', 'jnt', 'pos', 'sicepat', 'ninja', 'rex'].includes(answr.data)) {
            const answrKurir = answr.data
            bot.sendMessage(msg.chat.id, 'Resinya? (reply)').then((ask) => {
                bot.onReplyToMessage(ask.chat.id, ask.message_id, async (reply) => {
                    const resi = reply.text.toString()
                    console.log('Cek resi:', answrKurir, resi)
                    const getData = await cekResi(answrKurir, resi)
                    if (getData.status.kode != 200 && getData.status.description != 'OK') bot.sendMessage(reply.chat.id, getData.status.description)
                    const manifest = getData.result.manifest.map(x => `⏰ ${x.manifest_date} ${x.manifest_time}\n └ ${x.manifest_description}`)
                    const messageText = `
📦 Data Ekspedisi
├ ${getData.result.summary.courier_name}
├ Nomor: ${getData.result.summary.waybill_number}
├ Service: ${getData.result.summary.service_code}
└ Dikirim Pada: ${getData.result.details.waybill_date}  ${getData.result.details.waybill_time}

💁🏼‍♂️ Data Pengirim
├ Nama: ${getData.result.details.shippper_name}
└ Alamat: ${getData.result.details.shipper_address1} ${getData.result.details.shipper_city}

🎯 Data Penerima
├ Nama: ${getData.result.details.receiver_name}
└ Alamat: ${getData.result.details.receiver_address1} ${getData.result.details.receiver_city}

📮 Status Pengiriman
└ ${getData.result.delivery_status.status}
           
🚧 POD Detail\n
${manifest.join('\n')}
`
                    bot.sendMessage(reply.chat.id, messageText.toString().trim())
                })
            })
        }
    })
})

// Section - Gojek

const functGojek = (msg) => new Promise(() => {
    bot.once('callback_query', async (data) => {
        const akun = await gojec.cekAkun()
        const chatId = msg.chat.id
        switch (data.data) {
            case 'CekAkun':
                if (akun.errors && akun.errors.length >= 1) {
                    bot.sendMessage(chatId, `Error: ${akun.errors[0].message}`)
                } else {
                    bot.sendMessage(chatId, `
Info Akun
Nama: ${akun.data.name}
Nomor: ${akun.data.mobile}
Tipe Akun: ${akun.data.wallet_type}
Sisa Saldo: ${akun.data.currency} ${akun.data.balance}

Status Akun
Pin: ${akun.data.pin_setup ? 'Aktif' : 'Tidak Aktif'}
Kyc: ${akun.data.kyc_detail_status}
PayLater: ${akun.data.preferences.p2p.enabled ? 'Aktif' : 'Tidak Aktif'}
Withdraw: ${akun.data.preferences.withdrawal.enabled ? 'Aktif' : 'Tidak Aktif'}
Locked: ${akun.data.locked ? 'Ya' : 'Tidak'}`)
                }
                break
            case 'SendSaldo':
                // if (akun.errors && akun.errors.length >= 1) {
                //     bot.sendMessage(msg.chat.id, `Error: ${akun.errors[0].message}`)
                // } else {
                bot.sendMessage(chatId, 'balas dengan "<nomor> <nominal>"').then(async (ask) => {
                    bot.onReplyToMessage(ask.chat.id, ask.message_id, async (msg) => {
                        const res = msg.text.split(' ')
                        const nomer = res[0]
                        const nominal = res[1]
                        console.log('Send to: ' + res[0])
                        bot.sendMessage(msg.chat.id, 'Thanks, your request has been received')
                        if (res.length == 2) {
                            const kirim = await gojec.tfCustom(nomer, nominal)
                            if (!kirim) {
                                bot.sendMessage(msg.chat.id, `Kirim Saldo ke ${nomer}\nJumlah: ${nominal}\nStatus: Failed`)
                            } else {
                                const suc = `Kirim Saldo ke ${nomer}\nJumlah: ${nominal}\nStatus: ${kirim.success}\nTrxId: ${kirim.data.transaction_ref}`
                                bot.sendMessage(msg.chat.id, suc)
                            }
                            // lapor(msg.from, nomer, kirim.success, nominal)
                        } else {
                            const kirim = await gojec.dotrnsfr(nomer)
                            if (!kirim) {
                                bot.sendMessage(msg.chat.id, `Kirim Saldo ke ${nomer}\nStatus: ${kirim.errors[0].message}`)
                            } else {
                                const suc = `Kirim Saldo ke ${nomer}\nStatus: ${kirim.success}\nTrxId: ${kirim.data.transaction_ref}`
                                bot.sendMessage(msg.chat.id, suc)
                            }
                            // lapor(msg.from, nomer, kirim.success)
                        }
                    })
                })
                // }
                break
        }
    })
})

const lapor = (from, nomor, status, nominal) => {
    if (nominal == undefined) {
        bot.sendMessage(-1001334966211, `Request Saldo Oleh (${from.id}-${from.username})|${from.first_name} ${from.last_name}\nKe ${nomor}\nStatus: ${status}`)
    } else {
        bot.sendMessage(-1001334966211, `Request Saldo Oleh (${from.id}-${from.username})|${from.first_name} ${from.last_name}\nKe ${nomor}\nJumlah: ${nominal}\nStatus: ${status}`)
    }
}

// End Of Gojec Section

bot.on('polling_error', error => console.log(error))

process.on('uncaughtException', function (error) {
    console.log('\x1b[31m', 'Exception: ', error, '\x1b[0m')
})

process.on('unhandledRejection', function (error) {
    console.log('\x1b[31m', 'Rejection: ', error.message, '\x1b[0m')
})
