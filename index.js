'use strict';

const crypto = require('crypto');
const randomstring = require('randomstring');

const MAX_ITERATIONS = 100;
const LENGTH = 100;
const SPEED = 300; // ms
const DELTA = 10; // delta
const mock = new Array(100).fill('').map(() => {
	return {
		key: randomstring.generate(),
		salt: randomstring.generate(),
	};
});

let actualSpeed = 0;
let C = 10000; // параметр, который мы определяем
let coeff = 1;
let iterations = 0;

while (Math.abs(SPEED - actualSpeed) > DELTA && iterations < MAX_ITERATIONS) {
	C = Math.max((C * coeff) | 0, 1);
	iterations++;
	let arr = [];
	const now = Date.now();

	mock.forEach(({ key, salt }) => {
		arr.push(
			crypto.pbkdf2Sync(key, salt, C, 512, 'sha512')
		);
	});

	actualSpeed = (Date.now() - now) / LENGTH;

	coeff = SPEED / actualSpeed;
	if (coeff > 5) {
		coeff = 5;
	}
	if (coeff < 0.2) {
		coeff = 0.2;
	}

	console.log(`Итерация #${iterations}. Значение коэффициента C = ${C}, среднее время хеширования ${actualSpeed}ms. Увеличиваем коэффициент C в ${coeff} раз`);
}

console.log('\n\nFINISH!');
console.log(`Значение коэффициента C = ${C}, среднее время хеширования ${actualSpeed}ms`);
