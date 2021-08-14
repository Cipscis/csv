export interface StringifyOptions {
	/**
	 * If set to true, swap rows and columns before saving.
	 *
	 * @default false;
	 */
	transpose?: boolean;

	/**
	 * If set to true, prepend each cell starting with `'=' | '-' | '+' | '@'` with a tab character. This prevents spreadsheet software like Excel from trying to execute code.
	 *
	 * This option should be used when saving any data to a CSV that may include data from an untrusted source, such as user-generated data.
	 *
	 * @default false;
	 */
	sanitise?: boolean;
}

export interface ParseOptions<T = string> {
	/**
	 * A function that takes a string containing the value of a single CSV cell, and returns the value it should be mapped to.
	 */
	mapper?: (cell: string) => T;
}

const csv = {
	/**
	 * Converts a 2D Array into a CSV string.
	 *
	 * `stringify` converts most falsey values into empty cells. `undefined`, `''`, and `[]` are all treated this way. `null` and `false`, however, are converted into string representations when stringifying CSV data.
	 *
	 * If you need to maintain a value of `undefined`, `''`, or `[]` when stringifying your CSV data, convert it to a string first (e.g. `'undefined'`)
	 *
	 * @param {any[][]} data - A 2D Array to convert into a CSV string.
	 * @param {StringifyOptions} [options] - An object containing stringify options.
	 *
	 * @return {string} CSV string
	 */
	stringify(data: any[][], options?: StringifyOptions): string {
		options = options || {};
		options.transpose = options.transpose || false;
		options.sanitise = options.sanitise || false;

		// Enforce square data and apply CSV escaping, then convert to string
		const rows = data;
		const shapedRows = csv._shape(data, options);
		const escapedRows = csv._escape(shapedRows, options);
		const joinedRows = csv._join(escapedRows);

		return joinedRows;
	},

	/**
	 * Pad missing cells with empty strings and, if necessary, transpose the data
	 *
	 * @param {any[][]} data - A 2D Array to pad and potentially transpose.
	 * @param {StringifyOptions} [options] - An object containing stringify options.
	 *
	 * @return {any[][]} Shaped CSV data
	 */
	_shape(data: any[][], options?: StringifyOptions): any[][] {
		const transpose = options?.transpose ?? false;

		const maxLength = data.reduce((maxLength, row) => Math.max(maxLength, row.length), 0);

		// Flip rows and columns if transposing data
		const iMax = transpose ? maxLength : data.length;
		const jMax = transpose ? data.length : maxLength;

		const rows = [];
		for (let i = 0; i < iMax; i++) {
			const row = [];
			for (let j = 0; j < jMax; j++) {
				const iRow = transpose ? j : i;
				const iCol = transpose ? i : j;

				let cellValue = data[iRow][iCol];

				if (iCol >= data[iRow].length) {
					cellValue = '';
				}

				row.push(cellValue);
			}
			rows.push(row);
		}

		return rows;
	},

	/**
	 * Make sure any cells containing " or , or a newline are escaped appropriately
	 *
	 * @param {any[][]} rows - A 2D Array with values to escape
	 * @param {StringifyOptions} [options] - An object containing stringify options.
	 *
	 * @return {string[][]} Escaped CSV data
	 */
	_escape(rows: any[][], options?: StringifyOptions): string[][] {
		for (const row of rows) {
			for (let j = 0; j < row.length; j++) {
				row[j] = csv._escapeCell(row[j], options);
			}
		}

		return rows;
	},

	/**
	 * Make sure any cells containing " or , or a newline are escaped appropriately
	 *
	 * @param {any} cell - A single value to escape
	 * @param {StringifyOptions} [options] - An object containing stringify options.
	 *
	 * @return {string} Escaped value
	 */
	_escapeCell(cell: any, options?: StringifyOptions): string {
		const sanitise = options?.sanitise ?? false;

		// Convert to string
		let cellString: string;
		if (typeof cell === 'undefined') {
			// Replace undefined with ''
			cellString = '';
		} else if (typeof cell !== 'string') {
			// Convert to string
			cellString = '' + cell;
		} else {
			cellString = cell;
		}

		// Sanitise
		if (sanitise) {
			// Prevent spreadsheet software like
			// Excel from trying to execute code
			if (cellString.match(/^[=\-+@]/)) {
				cellString = '\t' + cell;
			}
		}

		// Escape
		if (cellString.match(/,|"|\n/)) {
			// Turn any double quotes into escaped double quotes
			cellString = cellString.replace(/"/g, '""');

			// Wrap cell in double quotes
			cellString = '"' + cellString + '"';
		}

		return cellString;
	},

	/**
	 * Join escaped CSV data into a single string.
	 *
	 * @param  {string[][]} rows - A 2D Array containing escaped CSV data
	 *
	 * @return {string} A CSV string
	 */
	_join(rows: string[][]): string {
		const rowStrings = [];

		for (let i = 0; i < rows.length; i++) {
			rowStrings.push(rows[i].join(','));
		}

		const rowsString = rowStrings.join('\n');
		return rowsString;
	},


	/**
	 * Converts a CSV string into a 2D Array.
	 *
	 * `parse` will throw an error if the string it is passed is malformed in one of these ways:
	 *
	 * - Unclosed quote
	 * - closed quote not followed immediately by separator
	 * - Rows of unequal lengths
	 *
	 * All values are converted to strings. If you need to convert them further, for example changing the strings `'true'` and `'false'` to boolean values, you can do this in separate code after the fact.
	 *
	 * @template T=string
	 *
	 * @param {string} csvString - A CSV string to convert to a 2D Array.
	 * @param {ParseOptions} [options] - An object containing parse options.
	 *
	 * @return {T[][]} 2D Array
	 */
	parse<T=string>(csvString: string, options?: ParseOptions<T>): T[][] {
		const stringRows = csv._tokenise(csvString);
		let dataRows;

		csv._validate(stringRows);

		const mapper = options?.mapper;
		if (typeof mapper !== 'undefined') {
			dataRows = stringRows.map((row) => row.map(mapper));
		} else {
			dataRows = stringRows;
		}

		// @ts-ignore: dataRows is T[][] if options.mapper exists to specify T, otherwise it is string[][]. Either case matches expected types
		return dataRows;
	},

	/**
	 * Walk through each character and produce an array of cell values. Throws an error if the string is not formatted as expected for a CSV.
	 *
	 * @param {string} csvString - A string representation of a CSV.
	 */
	_tokenise(csvString: string): string[][] {
		// Walk through each character and produce an array of tokens

		const tokens = [];

		// Remove carriage returns
		csvString = csvString.replace(/\r/g, '');

		let inQuote = false;
		let wasQuote = false;

		let tokenStart = 0;
		let row = [];
		for (let i = 0; i < csvString.length; i++) {
			const char = csvString[i];

			const comma = char === ',';
			const quote = char === '"';
			const newline = char === '\n';
			const eof = i === csvString.length -1; // eof - End Of File

			if (inQuote) {
				// Characters may be delimited
				if (quote) {
					// Check if the next character is another double quote, i.e. if it is escaped
					const nextChar = csvString[i+1];

					if (nextChar === '"') {
						// This and the next character combined make an escaped double quote,
						// so the quote has not ended and we should skip over the next character
						i++;
						continue;
					} else {
						// The quote has ended
						inQuote = false;
						wasQuote = true;

						if (!eof) {
							continue;
						}
					}
				} else if (eof) {
					throw new Error(`CSV parse: Reached end of file before ending quote. At index ${i}`);
				}
			}

			if (!inQuote && (comma || newline || eof)) {
				// These are the characters that denote the end of a token
				let token = csvString.substring(tokenStart, i+1);

				if (comma || newline) {
					// Don't keep the separator
					token = token.substring(0, token.length - 1);
				}

				if (wasQuote) {
					wasQuote = false;

					// Remove start and end quotes
					token = token.substring(1, token.length - 1);

					// Replace escaped quotes
					token = token.replace(/""/g, '"');
				}
				row.push(token);

				if (comma && eof) {
					// It's the end of the last token, and the last cell is empty
					row.push('');
				}

				if (newline || eof) {
					tokens.push(row);
					if (newline) {
						row = [];
					}
				}

				tokenStart = i+1;
			} else if (wasQuote) {
				throw new Error(`CSV parse: A value must be complete immediately after closing a quote. At index ${i}`);
			} else if (quote) {
				inQuote = true;
			}
		}

		return tokens;
	},

	/**
	 * Checks that an array of CSV values is rectangular, i.e. that each row has the same length.
	 *
	 * Throws an error if validation fails.
	 *
	 * @param {string[][]} rows - A 2D array of CSV values
	 */
	_validate(rows: string[][]): void {
		// Each row of a CSV should have the same length;

		if (rows && rows.length > 1) {
			let rowLength = rows[0].length;
			for (let i = 1; i < rows.length; i++) {
				let row = rows[i];

				if (row.length !== rowLength) {
					throw new Error(`CSV parse: Row ${i} does not have the same length as the first row (${rowLength})`);
				}
			}
		}
	}
};

const stringify = csv.stringify;
const parse = csv.parse;

export {
	stringify,
	parse,
};
