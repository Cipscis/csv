import { parse } from '../dist/csv.js';

describe('parse', () => {
	it('ensures a CSV string contains rows of equal length', () => {
		let csvString = `1,2,3\n1,2`;

		expect(() => parse(csvString)).toThrow();
	});

	it('throws an error if a CSV string ends with a quote still open', () => {
		let csvString = `"This quote doesn't end`;

		expect(() => parse(csvString)).toThrow();
	});

	it('throws an error if a CSV string contains a value that is partly a quote and partly not a quote', () => {
		let csvString = `"This value is partly a quote" and partly not a quote`;

		expect(() => parse(csvString)).toThrow();
	});

	it('can parse a simple CSV', () => {
		let csvString = `1,2,3\na,b,c`;
		let csvData = [
			['1', '2', '3'],
			['a', 'b', 'c'],
		];

		expect(parse(csvString)).toEqual(csvData);
	});

	it('can parse a CSV string containing quotes', () => {
		let csvString = `"test","quotes"\n"second","row"`;
		let csvData = [
			['test', 'quotes'],
			['second', 'row'],
		];

		expect(parse(csvString)).toEqual(csvData);
	});

	it('can parse quotes containing escaped double quote characters', () => {
		let csvString = `"quote with ""escaped quotes"""\n"second row with ""more"" escaped characters"`;
		let csvData = [
			['quote with "escaped quotes"'],
			['second row with "more" escaped characters'],
		];

		expect(parse(csvString)).toEqual(csvData);
	});

	it('can parse quotes containing commas', () => {
		let csvString = `"value with, comma",second value\nthird value,"another one, with a comma"`;
		let csvData = [
			['value with, comma', 'second value'],
			['third value', 'another one, with a comma'],
		];

		expect(parse(csvString)).toEqual(csvData);
	});

	it('can parse CSV strings not ending with a newline', () => {
		let csvString = `1,2,3\n4,5,6`;
		let csvData = [
			['1', '2', '3'],
			['4', '5', '6'],
		];

		expect(parse(csvString)).toEqual(csvData);
	});

	it('can parse CSV strings ending with a newline', () => {
		let csvString = `1,2,3\n4,5,6\n`;
		let csvData = [
			['1', '2', '3'],
			['4', '5', '6'],
		];

		expect(parse(csvString)).toEqual(csvData);
	});

	it('can transform values based on its mapper option', () => {
		let csvString = `1,2,3\ntrue,false,null`;
		let csvData = [
			[1, 2, 3],
			[true, false, null],
		];

		let mapper = (value) => {
			switch (value) {
				case 'true':
					return true;
					break;
				case 'false':
					return false;
					break;
				case 'null':
					return null;
					break;
				default:
					if (+value === parseFloat(value)) {
						return +value;
					}
					break;
			}

			return value;
		};

		expect(parse(csvString, { mapper })).toEqual(csvData);
	});
});