/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./docs/assets/js/src/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./csv.js":
/*!****************!*\
  !*** ./csv.js ***!
  \****************/
/*! exports provided: stringify, parse */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"stringify\", function() { return stringify; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"parse\", function() { return parse; });\nconst { stringify, parse } = (() => {\r\n\tconst csv = {\r\n\t\tstringify: function (data, options) {\r\n\t\t\toptions = options || {};\r\n\t\t\toptions.transpose = options.transpose || false;\r\n\t\t\toptions.sanitise = options.sanitise || false;\r\n\r\n\t\t\t// Enforce square data and apply CSV escaping, then convert to string\r\n\t\t\tlet rows = data;\r\n\r\n\t\t\trows = csv._shape(data, options);\r\n\t\t\trows = csv._escape(rows, options);\r\n\r\n\t\t\trows = csv._join(rows);\r\n\r\n\t\t\treturn rows;\r\n\t\t},\r\n\r\n\t\t_shape: function (data, options) {\r\n\t\t\t// Pad missing cells with empty strings and,\r\n\t\t\t// if necessary, transpose the data\r\n\r\n\t\t\tconst transpose = options.transpose;\r\n\r\n\t\t\tconst maxLength = data.reduce((maxLength, row) => Math.max(maxLength, row.length), 0);\r\n\r\n\t\t\t// Flip rows and columns if transposing data\r\n\t\t\tconst iMax = transpose ? maxLength : data.length;\r\n\t\t\tconst jMax = transpose ? data.length : maxLength;\r\n\r\n\t\t\tlet rows = [];\r\n\t\t\tfor (let i = 0; i < iMax; i++) {\r\n\t\t\t\tlet row = [];\r\n\t\t\t\tfor (let j = 0; j < jMax; j++) {\r\n\t\t\t\t\tlet iRow = transpose ? j : i;\r\n\t\t\t\t\tlet iCol = transpose ? i : j;\r\n\r\n\t\t\t\t\tlet cellValue = data[iRow][iCol];\r\n\r\n\t\t\t\t\tif (iCol >= data[iRow].length) {\r\n\t\t\t\t\t\tcellValue = '';\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t\trow.push(cellValue);\r\n\t\t\t\t}\r\n\t\t\t\trows.push(row);\r\n\t\t\t}\r\n\r\n\t\t\treturn rows;\r\n\t\t},\r\n\r\n\t\t_escape: function (rows, options) {\r\n\t\t\t// Make sure any cells containing \" or , or a newline are escaped appropriately\r\n\r\n\t\t\tconst sanitise = options.sanitise;\r\n\r\n\t\t\tfor (let i = 0; i < rows.length; i++) {\r\n\t\t\t\tlet row = rows[i];\r\n\r\n\t\t\t\tfor (let j = 0; j < row.length; j++) {\r\n\t\t\t\t\tif (typeof row[j] === 'undefined') {\r\n\t\t\t\t\t\t// Replace undefined with ''\r\n\t\t\t\t\t\trow[j] = '';\r\n\t\t\t\t\t} else if (typeof row[j] !== 'string') {\r\n\t\t\t\t\t\t// Convert to string\r\n\t\t\t\t\t\trow[j] = '' + row[j];\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t\tif (sanitise) {\r\n\t\t\t\t\t\t// Prevent spreadsheet software like\r\n\t\t\t\t\t\t// Excel from trying to execute code\r\n\t\t\t\t\t\tif (row[j].match(/^[=\\-+@]/)) {\r\n\t\t\t\t\t\t\trow[j] = '\\t' + row[j];\r\n\t\t\t\t\t\t}\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t\tif (row[j].match(/,|\"|\\n/)) {\r\n\r\n\t\t\t\t\t\t// Turn any double quotes into escaped double quotes\r\n\t\t\t\t\t\trow[j] = row[j].replace(/\"/g, '\"\"');\r\n\r\n\t\t\t\t\t\t// Wrap cell in double quotes\r\n\t\t\t\t\t\trow[j] = '\"' + row[j] + '\"';\r\n\t\t\t\t\t}\r\n\t\t\t\t}\r\n\t\t\t}\r\n\r\n\t\t\treturn rows;\r\n\t\t},\r\n\r\n\t\t_join: function (rows) {\r\n\t\t\tfor (let i = 0; i < rows.length; i++) {\r\n\t\t\t\trows[i] = rows[i].join(',');\r\n\t\t\t}\r\n\t\t\trows = rows.join('\\n');\r\n\r\n\t\t\treturn rows;\r\n\t\t},\r\n\r\n\r\n\t\tparse: function (csvString) {\r\n\t\t\tlet rows = csv._tokenise(csvString);\r\n\r\n\t\t\tcsv._validate(rows);\r\n\r\n\t\t\treturn rows;\r\n\t\t},\r\n\r\n\t\t_tokenise: function (csvString) {\r\n\t\t\t// Walk through each character and produce an array of tokens\r\n\r\n\t\t\tlet tokens = [];\r\n\r\n\t\t\t// Remove carriage returns\r\n\t\t\tcsvString = csvString.replace(/\\r/g, '');\r\n\r\n\t\t\tlet inQuote = false;\r\n\t\t\tlet wasQuote = false;\r\n\r\n\t\t\tlet tokenStart = 0;\r\n\t\t\tlet row = [];\r\n\t\t\tfor (let i = 0; i < csvString.length; i++) {\r\n\t\t\t\tlet char = csvString[i];\r\n\r\n\t\t\t\tlet comma = char === ',';\r\n\t\t\t\tlet quote = char === '\"';\r\n\t\t\t\tlet newline = char === '\\n';\r\n\t\t\t\tlet eof = i === csvString.length -1; // eof - End Of File\r\n\r\n\t\t\t\tif (inQuote) {\r\n\t\t\t\t\t// Characters may be delimited\r\n\t\t\t\t\tif (quote) {\r\n\t\t\t\t\t\t// Check if the next character is another double quote, i.e. if it is escaped\r\n\t\t\t\t\t\tlet nextChar = csvString[i+1];\r\n\r\n\t\t\t\t\t\tif (nextChar === '\"') {\r\n\t\t\t\t\t\t\t// This and the next character combined make an escaped double quote,\r\n\t\t\t\t\t\t\t// so the quote has not ended and we should skip over the next character\r\n\t\t\t\t\t\t\ti++;\r\n\t\t\t\t\t\t\tcontinue;\r\n\t\t\t\t\t\t} else {\r\n\t\t\t\t\t\t\t// The quote has ended\r\n\t\t\t\t\t\t\tinQuote = false;\r\n\t\t\t\t\t\t\twasQuote = true;\r\n\r\n\t\t\t\t\t\t\tcontinue;\r\n\t\t\t\t\t\t}\r\n\t\t\t\t\t} else if (eof) {\r\n\t\t\t\t\t\tthrow new Error(`CSV parse: Reached end of file before ending quote. At index ${i}`);\r\n\t\t\t\t\t}\r\n\t\t\t\t} else if (comma || newline || eof) {\r\n\t\t\t\t\t\t// These are the characters that denote the end of a token\r\n\t\t\t\t\t\tlet token = csvString.substring(tokenStart, i+1);\r\n\r\n\t\t\t\t\t\tif (comma || newline) {\r\n\t\t\t\t\t\t\t// Don't keep the separator\r\n\t\t\t\t\t\t\ttoken = token.substring(0, token.length - 1);\r\n\t\t\t\t\t\t}\r\n\r\n\t\t\t\t\t\tif (wasQuote) {\r\n\t\t\t\t\t\t\twasQuote = false;\r\n\r\n\t\t\t\t\t\t\t// Remove start and end quotes\r\n\t\t\t\t\t\t\ttoken = token.substring(1, token.length - 1);\r\n\r\n\t\t\t\t\t\t\t// Replace escaped quotes\r\n\t\t\t\t\t\t\ttoken = token.replace(/\"\"/g, '\"');\r\n\t\t\t\t\t\t}\r\n\t\t\t\t\t\trow.push(token);\r\n\r\n\t\t\t\t\t\tif (comma && eof) {\r\n\t\t\t\t\t\t\t// It's the end of the last token, and the last cell is empty\r\n\t\t\t\t\t\t\trow.push('');\r\n\t\t\t\t\t\t}\r\n\r\n\t\t\t\t\t\tif (newline || eof) {\r\n\t\t\t\t\t\t\ttokens.push(row);\r\n\t\t\t\t\t\t\tif (newline) {\r\n\t\t\t\t\t\t\t\trow = [];\r\n\t\t\t\t\t\t\t}\r\n\t\t\t\t\t\t}\r\n\r\n\t\t\t\t\t\ttokenStart = i+1;\r\n\t\t\t\t} else if (wasQuote) {\r\n\t\t\t\t\tthrow new Error(`CSV parse: A value must be complete immediately after closing a quote. At index ${i}`);\r\n\t\t\t\t} else if (quote) {\r\n\t\t\t\t\tinQuote = true;\r\n\t\t\t\t}\r\n\t\t\t}\r\n\r\n\t\t\treturn tokens;\r\n\t\t},\r\n\r\n\t\t_validate: function (rows) {\r\n\t\t\t// Each row of a CSV should have the same length;\r\n\r\n\t\t\tif (rows && rows.length > 1) {\r\n\t\t\t\tlet rowLength = rows[0].length;\r\n\t\t\t\tfor (let i = 1; i < rows.length; i++) {\r\n\t\t\t\t\tlet row = rows[i];\r\n\r\n\t\t\t\t\tif (row.length !== rowLength) {\r\n\t\t\t\t\t\tthrow new Error(`CSV parse: Row ${i} does not have the same length as the first row (${rowLength})`);\r\n\t\t\t\t\t}\r\n\t\t\t\t}\r\n\t\t\t}\r\n\t\t}\r\n\t};\r\n\r\n\treturn {\r\n\t\tstringify: csv.stringify,\r\n\t\tparse: csv.parse,\r\n\t};\r\n})();\r\n\r\n\r\n\n\n//# sourceURL=webpack:///./csv.js?");

/***/ }),

/***/ "./docs/assets/js/src/main.js":
/*!************************************!*\
  !*** ./docs/assets/js/src/main.js ***!
  \************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _csv__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! /csv */ \"./csv.js\");\n/* harmony import */ var activate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! activate */ \"./node_modules/activate/activate.js\");\n\r\n\r\n\r\nconst stringifyInput = [\r\n\t[0, 1, 2],\r\n\t['test', {test: true}],\r\n\t[null, false],\r\n\t['=GET(malicious_code)', true],\r\n];\r\n\r\nObject(activate__WEBPACK_IMPORTED_MODULE_1__[\"activate\"])('.js-stringify__button', () => {\r\n\tlet $input = document.querySelector('.js-stringify__input');\r\n\tlet $output = document.querySelector('.js-stringify__output');\r\n\r\n\tlet $transpose = document.querySelector('.js-stringify__transpose');\r\n\tlet $sanitise = document.querySelector('.js-stringify__sanitise');\r\n\r\n\tlet options = {\r\n\t\ttranspose: $transpose.checked,\r\n\t\tsanitise: $sanitise.checked,\r\n\t};\r\n\r\n\tlet str = Object(_csv__WEBPACK_IMPORTED_MODULE_0__[\"stringify\"])(stringifyInput, options);\r\n\r\n\t$input.innerHTML = JSON.stringify(stringifyInput, null, '\\t');\r\n\t$output.innerHTML = str;\r\n});\r\n\r\nObject(activate__WEBPACK_IMPORTED_MODULE_1__[\"activate\"])('.js-parse__button', () => {\r\n\tlet $input = document.querySelector('.js-parse__input');\r\n\tlet $output = document.querySelector('.js-parse__output');\r\n\r\n\tlet str = Object(_csv__WEBPACK_IMPORTED_MODULE_0__[\"stringify\"])(stringifyInput);\r\n\tlet data = Object(_csv__WEBPACK_IMPORTED_MODULE_0__[\"parse\"])(str);\r\n\r\n\t$input.innerHTML = str;\r\n\t$output.innerHTML = JSON.stringify(data, null, '\\t');\r\n});\r\n\n\n//# sourceURL=webpack:///./docs/assets/js/src/main.js?");

/***/ }),

/***/ "./node_modules/activate/activate.js":
/*!*******************************************!*\
  !*** ./node_modules/activate/activate.js ***!
  \*******************************************/
/*! exports provided: activate, deactivate, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"activate\", function() { return activate; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"deactivate\", function() { return deactivate; });\n/* Activate 1.0.2 */\n\n// Binds event listeners to one or more elements that makes them behave\n// like buttons, detecting both \"click\" events and also keydown for\n// the \"Enter\" key and keyup for the \"Space\" key.\n\n// Example usage:\n// activate(nodeList, fn);\n// activate(singleNode, fn);\n// activate(selector, fn);\n\nconst boundEvents = [];\n/*\n[\n\t{\n\t\tnode: Node,\n\t\tbindings: [\n\t\t\t{\n\t\t\t\tfn: Function,\n\t\t\t\tspacebarFn: Function,\n\t\t\t\tenterFn: Function\n\t\t\t}\n\t\t]\n\t}\n]\n*/\n\nconst { activate, deactivate } = (function () {\n\tconst module = {\n\t\tactivate: function (nodes, fn) {\n\t\t\tmodule._activator(nodes, fn, module._activateSingle);\n\t\t},\n\n\t\tdeactivate: function (nodes, fn) {\n\t\t\tmodule._activator(nodes, fn, module._deactivateSingle);\n\t\t},\n\n\t\t_activator: function (nodes, fn, activator) {\n\t\t\t// Share the same initial logic between activate and deactivate,\n\t\t\t// but run a different function over each node\n\n\t\t\tif (typeof nodes === 'string') {\n\t\t\t\ttry {\n\t\t\t\t\tnodes = document.querySelectorAll(nodes);\n\t\t\t\t} catch (e) {\n\t\t\t\t\tlet method = activator === module._deactivateSingle ? 'deactivate' : 'activate';\n\t\t\t\t\tthrow new DOMException(`${method} failed because it was passed an invalid selector string: '${nodes}'`);\n\t\t\t\t}\n\t\t\t}\n\n\t\t\tif (nodes instanceof Node) {\n\t\t\t\tactivator(nodes, fn);\n\t\t\t} else if (nodes.length && nodes.forEach) {\n\t\t\t\tnodes.forEach((node) => activator(node, fn));\n\t\t\t}\n\t\t},\n\n\n\n\t\t_activateSingle: function (node, fn) {\n\t\t\tif ((node instanceof Node === false)) {\n\t\t\t\tthrow new TypeError(`activate failed because a valid Node was not passed`);\n\t\t\t}\n\n\t\t\tif (module._getNodeBindings(node, fn)) {\n\t\t\t\t// Like addEventListener, don't try to rebind new copies of the same events\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\t// All nodes should bind the click event\n\t\t\tnode.addEventListener('click', fn);\n\n\t\t\t// Buttons will already treat keyboard events like clicks,\n\t\t\t// so only bind them to other node types\n\t\t\tlet isButton = module._isNodeType(node, 'button');\n\t\t\tif (isButton === false) {\n\t\t\t\tif (module._getNodeHasBindings(node) === false) {\n\t\t\t\t\t// addEventListener would prevent this event being\n\t\t\t\t\t// bound multiple times, but be explicit that it is\n\t\t\t\t\t// only bound if the node has no other events bound\n\t\t\t\t\tnode.addEventListener('keydown', module._preventSpacebarScroll);\n\t\t\t\t}\n\n\t\t\t\tlet spacebarFn = module._makeSpacebarFn(fn);\n\t\t\t\tnode.addEventListener('keyup', spacebarFn);\n\t\t\t\tlet bindings = {\n\t\t\t\t\tspacebarFn\n\t\t\t\t};\n\n\t\t\t\t// Links already treat \"enter\" keydown like a click\n\t\t\t\tlet isLink = module._isNodeType(node, 'a');\n\t\t\t\tif (isLink === false) {\n\t\t\t\t\t// Note that holding down \"enter\" will behave differently\n\t\t\t\t\t// for links in that it will only fire once, whereas for\n\t\t\t\t\t// non-links, including buttons, it will fire multiple times\n\t\t\t\t\tlet enterFn = module._makeEnterFn(fn);\n\t\t\t\t\tnode.addEventListener('keydown', enterFn);\n\t\t\t\t\tbindings.enterFn = enterFn;\n\t\t\t\t}\n\n\t\t\t\tmodule._rememberNodeBindings(node, fn, bindings);\n\t\t\t}\n\t\t},\n\n\t\t_deactivateSingle: function (node, fn) {\n\t\t\tif ((node instanceof Node === false)) {\n\t\t\t\tthrow new TypeError(`deactivate failed because a valid Node was not passed`);\n\t\t\t}\n\n\t\t\tlet bindings = module._getNodeBindings(node, fn);\n\n\t\t\t// All nodes have had a click event bound\n\t\t\tnode.removeEventListener('click', fn);\n\n\t\t\tif (!bindings) {\n\t\t\t\t// No other events to unbind\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\t// Buttons will already treat keyboard events like clicks,\n\t\t\t// so they didn't have keyboard events bound to them\n\t\t\tlet isButton = module._isNodeType(node, 'button');\n\t\t\tif (isButton === false) {\n\t\t\t\tnode.removeEventListener('keyup', bindings.spacebarFn);\n\n\t\t\t\t// Links already treat \"enter\" keydown like a click,\n\t\t\t\t// so that event wasn't bound to them\n\t\t\t\tlet isLink = module._isNodeType(node, 'a');\n\t\t\t\tif (isLink === false) {\n\t\t\t\t\tnode.removeEventListener('keydown', bindings.enterFn);\n\t\t\t\t}\n\n\t\t\t\tmodule._forgetNodeBindings(node, fn);\n\n\t\t\t\tif (module._getNodeHasBindings(node) === false) {\n\t\t\t\t\t// Only unbind this event if the node has no other bindings\n\t\t\t\t\tnode.removeEventListener('keydown', module._preventSpacebarScroll);\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\n\n\n\t\t_rememberNodeBindings: function (node, fn, bindings) {\n\t\t\tlet nodeB = boundEvents.find(el => el.node === node);\n\t\t\tif (!nodeB) {\n\t\t\t\tnodeB = {\n\t\t\t\t\tnode: node,\n\t\t\t\t\tbindings: [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\tfn\n\t\t\t\t\t\t}\n\t\t\t\t\t]\n\t\t\t\t};\n\t\t\t\tboundEvents.push(nodeB);\n\t\t\t}\n\n\t\t\tlet fnB = nodeB.bindings.find(el => el.fn === fn);\n\t\t\tif (!fnB) {\n\t\t\t\tfnB = {\n\t\t\t\t\tfn\n\t\t\t\t};\n\t\t\t\tnodeB.bindings.push(fnB);\n\t\t\t}\n\n\t\t\tObject.assign(fnB, bindings);\n\t\t},\n\n\t\t_forgetNodeBindings: function (node, fn) {\n\t\t\tlet nodeB = boundEvents.find(el => el.node === node);\n\t\t\tif (!nodeB) {\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tlet fnB = nodeB.bindings.find(el => el.fn === fn);\n\t\t\tif (!fnB) {\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tlet fnBIndex = nodeB.bindings.indexOf(fnB);\n\n\t\t\tnodeB.bindings.splice(fnBIndex, 1);\n\t\t},\n\n\t\t_getNodeBindings: function (node, fn) {\n\t\t\tlet nodeB = boundEvents.find(el => el.node === node);\n\t\t\tif (!nodeB) {\n\t\t\t\treturn undefined;\n\t\t\t}\n\n\t\t\tlet fnB = nodeB.bindings.find(el => el.fn === fn);\n\t\t\tif (!fnB) {\n\t\t\t\treturn undefined;\n\t\t\t}\n\n\t\t\treturn fnB;\n\t\t},\n\n\t\t_getNodeHasBindings: function (node) {\n\t\t\tlet nodeB = boundEvents.find(el => el.node === node);\n\t\t\treturn !!nodeB;\n\t\t},\n\n\n\n\t\t_makeEnterFn: function (fn) {\n\t\t\treturn function (e) {\n\t\t\t\tlet isEnter = module._isEnter(e);\n\n\t\t\t\tif (isEnter) {\n\t\t\t\t\tfn.apply(this, arguments);\n\t\t\t\t}\n\t\t\t};\n\t\t},\n\n\t\t_isEnter: function (e) {\n\t\t\tlet isEnter = e.key && (e.key.toLowerCase() === 'enter');\n\n\t\t\treturn isEnter;\n\t\t},\n\n\n\n\t\t_preventSpacebarScroll: function (e) {\n\t\t\t// Prevent spacebar from scrolling the page down on keydown\n\t\t\tlet node = e.target;\n\n\t\t\tlet isButton = module._isNodeType(node, 'button');\n\t\t\tlet isInput = module._isNodeType(node, 'input', 'textarea');\n\n\t\t\tlet isSpacebar = module._isSpacebar(e);\n\n\t\t\tif (!isButton && !isInput && isSpacebar) {\n\t\t\t\te.preventDefault();\n\t\t\t}\n\t\t},\n\n\t\t_makeSpacebarFn: function (fn) {\n\t\t\treturn function (e) {\n\t\t\t\tlet isSpacebar = module._isSpacebar(e);\n\n\t\t\t\tif (isSpacebar) {\n\t\t\t\t\tfn.apply(this, arguments);\n\t\t\t\t}\n\t\t\t};\n\t\t},\n\n\t\t_isSpacebar: function (e) {\n\t\t\t// IE11 uses 'spacebar' instead of ' '\n\t\t\tlet isSpacebar = e.key && (e.key === ' ' || e.key.toLowerCase() === 'spacebar');\n\n\t\t\treturn isSpacebar;\n\t\t},\n\n\n\n\t\t_isNodeType: function (node, ...nodeTypes) {\n\t\t\tnodeTypes = nodeTypes.map(el => el.toLowerCase());\n\n\t\t\tlet nodeType = node.nodeName.toLowerCase();\n\t\t\tlet isOfType = nodeTypes.includes(nodeType);\n\n\t\t\treturn isOfType;\n\t\t}\n\t};\n\n\treturn {\n\t\tactivate: module.activate,\n\t\tdeactivate: module.deactivate\n\t};\n})();\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (activate);\n\n\n//# sourceURL=webpack:///./node_modules/activate/activate.js?");

/***/ })

/******/ });