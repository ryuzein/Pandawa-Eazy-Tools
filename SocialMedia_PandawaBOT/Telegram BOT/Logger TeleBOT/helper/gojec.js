/* eslint-disable no-tabs */
const fetch = require('node-fetch')
const uuidv4 = require('uuid/v4')
var uuid = uuidv4()

const accessToken = process.env.accessTokenGojec

const genUniqueId = length =>
	new Promise((resolve, reject) => {
		var text = ''
		var possible =
			'abcdefghijklmnopqrstuvwxyz1234567890'
		for (var i = 0; i < length; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length))
		}
		resolve(text)
	})

function randInt () {
	return Math.floor((Math.random() * 50) + 10)
}

const getqr = (accessToken, uuid, uniqid, phoneNumber) =>
	new Promise((resolve, reject) => {
		const url = `https://api.gojekapi.com/wallet/qr-code?phone_number=%2B${phoneNumber}`

		fetch(url, {
				method: 'GET',
				headers: {
					'X-Session-ID': uuid,
					Accept: 'application/json',
					'X-Platform': 'Android',
					'X-UniqueId': uniqid,
					'X-AppVersion': '3.34.1',
					'X-AppId': 'com.gojek.app',
					'X-PhoneModel': 'Android,Custom Phone - 6.0.0 - API 23 - 768x1280',
					'X-PushTokenType': 'FCM',
					'X-DeviceOS': 'Android,6.0',
					Authorization: `Bearer ${accessToken}`,
					'Accept-Language': 'en-ID',
					'X-User-Locale': 'en_ID',
					'Content-Type': 'application/json; charset=UTF-8',
					'User-Agent': 'okhttp/3.12.1'
				}
			})
			.then(res => res.json())
			.then(result => {
				resolve(result)
			})
			.catch(err => {
				reject(err)
			})
	})

const trnsfr = (accessToken, uuid, uniqid, qrid, nominal) =>
	new Promise((resolve, reject) => {
		const url = 'https://api.gojekapi.com/v2/fund/transfer'

		// JANGAN LUPA JUMLAH SALDO YANG AKAN DI TF
		const boday = {
			amount: `${nominal}`,
			description: '💰',
			qr_id: `${qrid}`
		}

		fetch(url, {
				method: 'POST',
				headers: {
					'X-Session-ID': uuid,
					Accept: 'application/json',
					'X-Platform': 'Android',
					'X-UniqueId': uniqid,
					'X-AppVersion': '3.34.1',
					'X-AppId': 'com.gojek.app',
					'X-PhoneModel': 'Android,Custom Phone - 6.0.0 - API 23 - 768x1280',
					'X-PushTokenType': 'FCM',
					'X-DeviceOS': 'Android,6.0',
					Authorization: `Bearer ${accessToken}`,
					'Accept-Language': 'en-ID',
					'X-User-Locale': 'en_ID',
					'Content-Type': 'application/json; charset=UTF-8',
					'User-Agent': 'okhttp/3.12.1',
					pin: `${process.env.pinGojec}` // PIN AKUN UTAMA
				},
				body: JSON.stringify(boday)
			})
			.then(res => res.json())
			.then(result => {
				resolve(result)
			})
			.catch(err => resolve(err))
	})

async function dotrnsfr (Nomer) {
	const uniqueid = await genUniqueId(16)
	const qrid = await getqr(accessToken, uuid, uniqueid, Nomer)
	if (qrid.success) {
		const kirimsaldo = await trnsfr(accessToken, uuid, uniqueid, qrid.data.qr_id, randInt())
		console.log(`Status: ${qrid.success}`)
		console.log(`Trx ref: ${kirimsaldo.data.transaction_ref}`)
		return kirimsaldo
	} else {
		console.log(`Status: ${JSON.stringify(qrid)}`)
		return false
	}
}
// =========================================================================================

async function tfCustom (Nomer, nominal) {
	const uniqueid = await genUniqueId(16)
	const qrid = await getqr(accessToken, uuid, uniqueid, Nomer)
	if (qrid.success) {
		const kirimsaldo = await trnsfr(accessToken, uuid, uniqueid, qrid.data.qr_id, nominal)
		console.log(`Status: ${qrid.success}`)
		console.log(`Trx ref: ${kirimsaldo.data.transaction_ref}`)
		return kirimsaldo
	} else {
		console.log(`Status: ${JSON.stringify(qrid)}`)
		return false
	}
}

// =========================================================================================

const cekAkun = () =>
	new Promise(async (resolve, reject) => {
		const url = 'https://api.gojekapi.com/wallet/profile/detailed'
		const uniqid = await genUniqueId(16)
		fetch(url, {
				method: 'GET',
				headers: {
					'User-Agent': 'okhttp/3.12.1',
					Connection: 'Keep-Alive',
					'X-Location-Accuracy': '23.544',
					'X-Location': '-6.8776426,107.5798444',
					'X-User-Locale': 'id_ID',
					'Accept-Language': 'id-ID',
					'X-PhoneModel': 'Google,Pixel 3 XL',
					'X-DeviceOS': 'Android,9.0',
					Authorization: `Bearer ${accessToken}`,
					'X-UniqueId': uniqid,
					'X-Platform': 'Android',
					'X-AppId': 'com.gojek.app',
					'X-AppVersion': '3.52.2',
					'X-Session-ID': uuid,
					'Content-Type': 'application/json'
				}
			})
			.then(res => res.json())
			.then(result => {
				resolve(result)
			})
			.catch(err => reject(err))
	})

module.exports = {
	dotrnsfr,
	tfCustom,
	cekAkun
}
