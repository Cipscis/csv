import { parse } from '../dist/parse.js';

describe('parse', () => {
	it('ensures a CSV string contains rows of equal length', () => {
		const csvString = `1,2,3\n1,2`;

		expect(() => parse(csvString)).toThrow();
	});

	it('throws an error if a CSV string ends with a quote still open', () => {
		const csvString = `"This quote doesn't end`;

		expect(() => parse(csvString)).toThrow();
	});

	it('throws an error if a CSV string contains a value that is partly a quote and partly not a quote', () => {
		const csvString = `"This value is partly a quote" and partly not a quote`;

		expect(() => parse(csvString)).toThrow();
	});

	it('can parse a simple CSV', () => {
		const csvString = `1,2,3\na,b,c`;
		const csvData = [
			['1', '2', '3'],
			['a', 'b', 'c'],
		];

		expect(parse(csvString)).toEqual(csvData);
	});

	it('can parse a CSV string containing quotes', () => {
		const csvString = `"test","quotes"\n"second","row"`;
		const csvData = [
			['test', 'quotes'],
			['second', 'row'],
		];

		expect(parse(csvString)).toEqual(csvData);
	});

	it('can parse quotes containing escaped double quote characters', () => {
		const csvString = `"quote with ""escaped quotes"""\n"second row with ""more"" escaped characters"`;
		const csvData = [
			['quote with "escaped quotes"'],
			['second row with "more" escaped characters'],
		];

		expect(parse(csvString)).toEqual(csvData);
	});

	it('can parse quotes containing commas', () => {
		const csvString = `"value with, comma",second value\nthird value,"another one, with a comma"`;
		const csvData = [
			['value with, comma', 'second value'],
			['third value', 'another one, with a comma'],
		];

		expect(parse(csvString)).toEqual(csvData);
	});

	it('can parse CSV strings not ending with a newline', () => {
		const csvString = `1,2,3\n4,5,6`;
		const csvData = [
			['1', '2', '3'],
			['4', '5', '6'],
		];

		expect(parse(csvString)).toEqual(csvData);
	});

	it('can parse CSV strings ending with a newline', () => {
		const csvString = `1,2,3\n4,5,6\n`;
		const csvData = [
			['1', '2', '3'],
			['4', '5', '6'],
		];

		expect(parse(csvString)).toEqual(csvData);
	});

	it('can transform values based on its mapper option', () => {
		const csvString = `1,2,3\ntrue,false,null`;
		const csvData = [
			[1, 2, 3],
			[true, false, null],
		];

		const mapper = (value) => {
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

		expect(parse(csvString, mapper)).toEqual(csvData);
	});
});