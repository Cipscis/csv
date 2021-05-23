const { stringify, parse } = (() => {
	const csv = {
		stringify: function (data, options) {
			options = options || {};
			options.transpose = options.transpose || false;
			options.sanitise = options.sanitise || false;

			// Enforce square data and apply CSV escaping, then convert to string
			let rows = data;

			rows = csv._shape(data, options);
			rows = csv._escape(rows, options);

			rows = csv._join(rows);

			return rows;
		},

		_shape: function (data, options) {
			// Pad missing cells with empty strings and,
			// if necessary, transpose the data

			const transpose = options.transpose;

			const maxLength = data.reduce((maxLength, row) => Math.max(maxLength, row.length), 0);

			// Flip rows and columns if transposing data
			const iMax = transpose ? maxLength : data.length;
			const jMax = transpose ? data.length : maxLength;

			let rows = [];
			for (let i = 0; i < iMax; i++) {
				let row = [];
				for (let j = 0; j < jMax; j++) {
					let iRow = transpose ? j : i;
					let iCol = transpose ? i : j;

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

		_escape: function (rows, options) {
			// Make sure any cells containing " or , or a newline are escaped appropriately

			const sanitise = options.sanitise;

			for (let i = 0; i < rows.length; i++) {
				let row = rows[i];

				for (let j = 0; j < row.length; j++) {
					if (typeof row[j] === 'undefined') {
						// Replace undefined with ''
						row[j] = '';
					} else if (typeof row[j] !== 'string') {
						// Convert to string
						row[j] = '' + row[j];
					}

					if (sanitise) {
						// Prevent spreadsheet software like
						// Excel from trying to execute code
						if (row[j].match(/^[=\-+@]/)) {
							row[j] = '\t' + row[j];
						}
					}

					if (row[j].match(/,|"|\n/)) {

						// Turn any double quotes into escaped double quotes
						row[j] = row[j].replace(/"/g, '""');

						// Wrap cell in double quotes
						row[j] = '"' + row[j] + '"';
					}
				}
			}

			return rows;
		},

		_join: function (rows) {
			for (let i = 0; i < rows.length; i++) {
				rows[i] = rows[i].join(',');
			}
			rows = rows.join('\n');

			return rows;
		},


		parse: function (csvString) {
			let rows = csv._tokenise(csvString);

			csv._validate(rows);

			return rows;
		},

		_tokenise: function (csvString) {
			// Walk through each character and produce an array of tokens

			let tokens = [];

			// Remove carriage returns
			csvString = csvString.replace(/\r/g, '');

			let inQuote = false;
			let wasQuote = false;

			let tokenStart = 0;
			let row = [];
			for (let i = 0; i < csvString.length; i++) {
				let char = csvString[i];

				let comma = char === ',';
				let quote = char === '"';
				let newline = char === '\n';
				let eof = i === csvString.length -1; // eof - End Of File

				if (inQuote) {
					// Characters may be delimited
					if (quote) {
						// Check if the next character is another double quote, i.e. if it is escaped
						let nextChar = csvString[i+1];

						if (nextChar === '"') {
							// This and the next character combined make an escaped double quote,
							// so the quote has not ended and we should skip over the next character
							i++;
							continue;
						} else {
							// The quote has ended
							inQuote = false;
							wasQuote = true;

							continue;
						}
					} else if (eof) {
						throw new Error(`CSV parse: Reached end of file before ending quote. At index ${i}`);
					}
				} else if (comma || newline || eof) {
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

		_validate: function (rows) {
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

	return {
		stringify: csv.stringify,
		parse: csv.parse,
	};
})();

export { stringify, parse };
