import { stringify } from '../dist/stringify.js';

describe('stringify', () => {
	it('can stringify simple CSV data', () => {
		const csvData = [
			[1, 2, 3],
			['a', 'b', 'c'],
		];
		const csvString = `1,2,3\na,b,c`;

		expect(stringify(csvData)).toBe(csvString);
	});

	it('can pad short rows with empty cells', () => {
		const csvData = [
			[1, 2, 3, 4, 5],
			[1, 2, 3],
		];
		const csvString = `1,2,3,4,5\n1,2,3,,`;

		expect(stringify(csvData)).toBe(csvString);
	});

	it('can transpose data', () => {
		const csvData = [
			['Title A', 1, 2, 3],
			['Title B', 4, 5, 6],
		];
		const csvString = `Title A,Title B\n1,4\n2,5\n3,6`;

		const options = { transpose: true };

		expect(stringify(csvData, options)).toBe(csvString);
	});

	it('can sanitise data', () => {
		const csvData = [
			['=Danger', '-Danger'],
			['+Danger', '@Danger'],
		];
		const csvString = `\t=Danger,\t-Danger\n\t+Danger,\t@Danger`;

		const options = { sanitise: true };

		expect(stringify(csvData, options)).toBe(csvString);
	});

	it('can transpose, pad, and sanitise data in the same call', () => {
		const csvData = [
			['Title A', '=Malicious_Code()', 3],
			['Title B', true],
		];
		const csvString = `Title A,Title B\n\t=Malicious_Code(),true\n3,`;

		const options = {
			transpose: true,
			sanitise: true,
		};

		expect(stringify(csvData, options)).toBe(csvString);
	});

	it('stringifies falsey values appropriately', () => {
		const csvData = [
			[null, undefined],
			['', false],
			[[], true],
		];
		const csvString = `null,\n,false\n,true`;

		expect(stringify(csvData)).toBe(csvString);
	});

	it('escapes commas', () => {
		const csvData = [
			[','],
		];
		const csvString = `","`;

		expect(stringify(csvData)).toBe(csvString);
	});

	it('escapes double quotes', () => {
		const csvData = [
			['Test with "quote"', 'single quote"'],
			['No quotes', '"lots""of""quotes"""']
		];
		const csvString = `"Test with ""quote""","single quote"""\nNo quotes,"""lots""""of""""quotes"""""""`;

		expect(stringify(csvData)).toBe(csvString);
	});
});