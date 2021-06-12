import { stringify, parse } from '/csv';
import { activate } from 'activate';

const stringifyInput = [
	[0, 1, 2],
	['test', {test: true}],
	[null, false],
	['=GET(malicious_code)', true],
];

activate('.js-stringify__button', () => {
	let $input = document.querySelector('.js-stringify__input');
	let $output = document.querySelector('.js-stringify__output');

	let $transpose = document.querySelector('.js-stringify__transpose');
	let $sanitise = document.querySelector('.js-stringify__sanitise');

	let options = {
		transpose: $transpose.checked,
		sanitise: $sanitise.checked,
	};

	let str = stringify(stringifyInput, options);

	$input.innerHTML = JSON.stringify(stringifyInput, null, '\t');
	$output.innerHTML = str;
});

activate('.js-parse__button', () => {
	let $input = document.querySelector('.js-parse__input');
	let $output = document.querySelector('.js-parse__output');

	let str = stringify(stringifyInput);
	let data = parse(str);

	$input.innerHTML = str;
	$output.innerHTML = JSON.stringify(data, null, '\t');
});
