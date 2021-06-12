import {strict as assert } from 'assert';
import chalk from 'chalk';

import {parse, stringify} from '../csv.js';

const pass = (message) => console.log(`${chalk.green('PASSED')}\t${message}`);
const fail = (message) => console.log(`${chalk.red('FAILED')}\t${message}`);

const test = (message, testFn) => {
	try {
		testFn();
		pass(message);
	} catch (e) {
		fail(message);
		console.error(e);
	}
};

// Parse tests
console.log('Testing csv.parse');

test('Ensure equal rows', () => {
	let unequalCsvString = `1,2,3
1,2`;

	assert.throws(() => parse(unequalCsvString));
});

test('Throw error on open quote', () => {
	let openQuoteCsvString = `"This quote doesn't end`;

	assert.throws(() => parse(openQuoteCsvString));
});

test('Throw error on partial quote', () => {
	let partialQuoteCsvString = `"This value is partly a quote" and partly not a quote`;

	assert.throws(() => parse(partialQuoteCsvString));
});

test('Testing simple parse', () => {
	let numberCsvString = `1,2,3
a,b,c`;

	assert.deepEqual(parse(numberCsvString), [['1','2','3'],['a','b','c']]);
});

test('Testing parse with quotes', () => {
	let quoteCsvString = `"test","quotes"
"second","row"`;

	assert.deepEqual(parse(quoteCsvString), [['test','quotes'],['second','row']]);
});

test('Testing parse with quote containing escaped double quotes', () => {
	let escapedQuoteCsvString = `"quote with ""escaped quotes"""
"second row with ""more"" escaped characters"`;

	assert.deepEqual(parse(escapedQuoteCsvString), [['quote with "escaped quotes"'],['second row with "more" escaped characters']]);
});

test('Testing parse with quote containing commas', () => {
	let commaCsvString = `"value with, comma",second value
third value,"another one, with a comma"`;

	assert.deepEqual(parse(commaCsvString), [['value with, comma','second value'],['third value','another one, with a comma']]);
});

test('Handling of file not ending with newline', () => {
	let noNewlineEndCsvString = `1,2,3
4,5,6`;

	assert.deepEqual(parse(noNewlineEndCsvString), [['1','2','3'],['4','5','6']]);
});

test('Handling of file ending with newline', () => {
	let newlineEndCsvString = `1,2,3
4,5,6
`;

	assert.deepEqual(parse(newlineEndCsvString), [['1','2','3'],['4','5','6']]);
});

// Stringify tests
console.log('Testing csv.stringify');

test('Simple stringify', () => {
	let simpleCsvData = [
		[1, 2, 3],
		['a', 'b', 'c'],
	];

	assert.equal(stringify(simpleCsvData), `1,2,3\na,b,c`);
});

test('Pad short rows', () => {
	let shortCsvData = [
		[1, 2, 3, 4, 5],
		[1, 2, 3],
	];

	assert.equal(stringify(shortCsvData), `1,2,3,4,5\n1,2,3,,`);
});

test('Transpose', () => {
	let transposeCsvData = [
		['Title A', 1, 2, 3],
		['Title B', 4, 5, 6],
	];

	assert.equal(stringify(transposeCsvData, {transpose: true}), `Title A,Title B\n1,4\n2,5\n3,6`);
});

test('Sanitise', () => {
	let uncleanCsvData = [
		['=Danger', '-Danger'],
		['+Danger', '@Danger'],
	];

	assert.equal(stringify(uncleanCsvData, {sanitise: true}), `\t=Danger,\t-Danger\n\t+Danger,\t@Danger`);
});

test('Transpose, pad, and sanitise', () => {
	let complexCsvData = [
		['Title A', '=Malicious_Code()', 3],
		['Title B', true],
	];

	assert.equal(stringify(complexCsvData, {transpose: true, sanitise: true}), `Title A,Title B\n\t=Malicious_Code(),true\n3,`);
});
