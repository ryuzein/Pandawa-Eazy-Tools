const fetch = require('node-fetch')

const cekResi = (courier, waybill) => new Promise(async (resolve, reject) => {
  const opts = {
    method: 'POST',
    headers: {
      key: process.env.ApiRajaOngkir,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams([['waybill', waybill], ['courier', courier]])
  }

  fetch('https://pro.rajaongkir.com/api/waybill', opts)
    .then(res => res.json())
    .then(result => {
      result = result.rajaongkir
      if (result.status.kode != 200 && result.status.description != 'OK') resolve(result.status.description)
      const manifest = result.result.manifest.map(x => `⏰ ${x.manifest_date} ${x.manifest_time}\n └ ${x.manifest_description}`)
      const messageText = `
📦 Data Ekspedisi
├ ${result.result.summary.courier_name}
├ Nomor: ${result.result.summary.waybill_number}
├ Service: ${result.result.summary.service_code}
└ Dikirim Pada: ${result.result.details.waybill_date}  ${result.result.details.waybill_time}

💁🏼‍♂️ Data Pengirim
├ Nama: ${result.result.details.shippper_name}
└ Alamat: ${result.result.details.shipper_address1} ${result.result.details.shipper_city}

🎯 Data Penerima
├ Nama: ${result.result.details.receiver_name}
└ Alamat: ${result.result.details.receiver_address1} ${result.result.details.receiver_city}

📮 Status Pengiriman
└ ${result.result.delivery_status.status}
           
🚧 POD Detail\n
${manifest.join('\n')}
                
`
      resolve(messageText)
    })
    .catch(err => reject(err))
})
module.exports = { cekResi }
