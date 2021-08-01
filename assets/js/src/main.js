import { stringify, parse } from 'csv';

const stringifyInput = [
	['Numbers', 0, 1, 2, 3],
	['Test values', 'test', {test: true}],
	['Falsey values', false, '', [], null],
	['Values to sanitise', '=GET(malicious_code)', '-FETCH(url)', '+DO(nefarious_thing)', '@POST(data)'],
];

const parseInput = `Numbers,0,1,2,3
Test values,test,{test: true},,
Falsey values,false,'',[],null
Values to sanitise,=GET(malicious_code),-FETCH(url),+DO(nefarious_thing),@POST(data)`;

document.querySelectorAll('.js-stringify__button').forEach(($el) => $el.addEventListener('click', () => {
	const $input = document.querySelector('.js-stringify__input');
	const $output = document.querySelector('.js-stringify__output');

	const $transpose = document.querySelector('.js-stringify__transpose');
	const $sanitise = document.querySelector('.js-stringify__sanitise');

	const transpose = $transpose instanceof HTMLInputElement ? $transpose.checked : false;
	const sanitise = $sanitise instanceof HTMLInputElement ? $sanitise.checked : false;

	const options = {
		transpose,
		sanitise,
	};

	const str = stringify(stringifyInput, options);

	$input.innerHTML = JSON.stringify(stringifyInput, null, '\t');
	$output.innerHTML = str;
}));

document.querySelectorAll('.js-parse__button').forEach(($el) => $el.addEventListener('click', () => {
	const $input = document.querySelector('.js-parse__input');
	const $output = document.querySelector('.js-parse__output');

	const $mapIntegers = document.querySelector('.js-parse__map-integers');
	const mapIntegersChecked = $mapIntegers instanceof HTMLInputElement ? $mapIntegers.checked : false;

	const options = {};
	if (mapIntegersChecked) {
		options.mapper = (value) => {
			if (+value === parseInt(value, 10)) {
				return +value;
			} else {
				return value;
			}
		};
	};

	const data = parse(parseInput, options);

	$input.innerHTML = parseInput;
	$output.innerHTML = JSON.stringify(data, null, '\t');
}));