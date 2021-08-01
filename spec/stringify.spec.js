import { stringify } from '../csv.js';

describe('stringify', () => {
	it('can stringify simple CSV data', () => {
		let csvData = [
			[1, 2, 3],
			['a', 'b', 'c'],
		];
		let csvString = `1,2,3\na,b,c`;

		expect(stringify(csvData)).toBe(csvString);
	});

	it('can pad short rows with empty cells', () => {
		let csvData = [
			[1, 2, 3, 4, 5],
			[1, 2, 3],
		];
		let csvString = `1,2,3,4,5\n1,2,3,,`;

		expect(stringify(csvData)).toBe(csvString);
	});

	it('can transpose data', () => {
		let csvData = [
			['Title A', 1, 2, 3],
			['Title B', 4, 5, 6],
		];
		let csvString = `Title A,Title B\n1,4\n2,5\n3,6`;

		let options = { transpose: true };

		expect(stringify(csvData, options)).toBe(csvString);
	});

	it('can sanitise data', () => {
		let csvData = [
			['=Danger', '-Danger'],
			['+Danger', '@Danger'],
		];
		let csvString = `\t=Danger,\t-Danger\n\t+Danger,\t@Danger`;

		let options = { sanitise: true };

		expect(stringify(csvData, options)).toBe(csvString);
	});

	it('can transpose, pad, and sanitise data in the same call', () => {
		let csvData = [
			['Title A', '=Malicious_Code()', 3],
			['Title B', true],
		];
		let csvString = `Title A,Title B\n\t=Malicious_Code(),true\n3,`;

		let options = {
			transpose: true,
			sanitise: true,
		};

		expect(stringify(csvData, options)).toBe(csvString);
	});

	it('stringifies falsey values appropriately', () => {
		let csvData = [
			[null, undefined],
			['', false],
			[[], true]
		];
		let csvString = `null,\n,false\n,true`;

		expect(stringify(csvData)).toBe(csvString);
	});
});