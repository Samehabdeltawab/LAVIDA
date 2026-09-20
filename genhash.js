const crypto = require('crypto');
const p = 'Lavida@v@$$1989';
console.log(crypto.createHash('sha256').update(p).digest('hex'));
