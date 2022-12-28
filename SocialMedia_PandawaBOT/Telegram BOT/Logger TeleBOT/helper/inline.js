const inlineMenu = {
    inline_keyboard: [
        [{
            text: 'Gojek',
            callback_data: 'gojek'
        }, {
            text: 'Cek Resi',
            callback_data: 'resi'
        }]
    ]
}

const inlinecekResi = {
    inline_keyboard: [
        [{
            text: 'Jne',
            callback_data: 'jne'
        }, {
            text: 'Jnt',
            callback_data: 'jnt'
        }, {
            text: 'Pos',
            callback_data: 'pos'
        }, {
            text: 'Sicepat',
            callback_data: 'sicepat'
        }, {
            text: 'Ninja',
            callback_data: 'ninja'
        }, {
            text: 'Rex',
            callback_data: 'rex'
        }],
        [{
            text: 'Back',
            callback_data: 'back'
        }]
    ]
}

const inlineGojek = {
    inline_keyboard: [
        [{
            text: 'Cek Akun',
            callback_data: 'CekAkun'
        }, {
            text: 'Transfer Saldo',
            callback_data: 'SendSaldo'
        }],
        [{
            text: 'Back',
            callback_data: 'back'
        }]
    ]
}

module.exports = {
    inlineMenu,
    inlinecekResi,
    inlineGojek
}
