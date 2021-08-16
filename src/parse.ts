/**
 * Converts a CSV string into a 2D Array.
 *
 * `parse` will throw a SyntaxError if the string it is passed is malformed in
 *   one of these ways:
 *
 * - Unclosed quote - closed quote not followed immediately by separator - Rows
 *   of unequal lengths
 *
 * All values are converted to strings. If you need to convert them further, for
 *   example changing the strings `'true'` and `'false'` to boolean values, you
 *   can do this in separate code after the fact.
 *
 * @template T=string
 *
 * @param {string} csvString - A CSV string to convert to a 2D Array.
 * @param {ParseOptions} [options] - An object containing parse options.
 *
 * @throws {SyntaxError} - The csvString must not be malformed.
 *
 * @return {T[][]} 2D Array
 */
function parse(csvString: string): string[][];
function parse<T>(csvString: string, mapper: (cell: string) => T): T[][]
function parse<T>(csvString: string, mapper?: (cell: string) => T): T[][] | string[][] {
	const stringRows = _tokenise(csvString);

	_validate(stringRows);

	if (typeof mapper !== 'undefined') {
		const dataRows = stringRows.map((row) => row.map(mapper));
		return dataRows;
	} else {
		return stringRows;
	}
}

/**
 * Walk through each character and produce an array of cell values. Throws an error if the string is not formatted as expected for a CSV.
 *
 * @param {string} csvString - A string representation of a CSV.
 *
 * @throws {SyntaxError} - The csvString must not be malformed.
 */
function _tokenise(csvString: string): string[][] {
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
				throw new SyntaxError(`CSV parse: Reached end of file before ending quote. At index ${i}`);
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
			throw new SyntaxError(`CSV parse: A value must be complete immediately after closing a quote. At index ${i}`);
		} else if (quote) {
			inQuote = true;
		}
	}

	return tokens;
}

/**
 * Checks that an array of CSV values is rectangular, i.e. that each row has the same length.
 *
 * Throws a SyntaxError if validation fails.
 *
 * @param {string[][]} rows - A 2D array of CSV values.
 *
 * @throws {SyntaxError} - The rows 2D Array must not be malformed.
 */
function _validate(rows: string[][]): void {
	// Each row of a CSV should have the same length;

	if (rows && rows.length > 1) {
		let rowLength = rows[0].length;
		for (let i = 1; i < rows.length; i++) {
			let row = rows[i];

			if (row.length !== rowLength) {
				throw new SyntaxError(`CSV parse: Row ${i} does not have the same length as the first row (${rowLength})`);
			}
		}
	}
}

export { parse };
