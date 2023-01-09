/**
 * Derived from isomorphic-style-loader, property of Kriasoft and licensed under
 * the MIT license as defined in the following repository:
 *
 * https://github.com/kriasoft/isomorphic-style-loader
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

const inserted = {};

// Base64 encoding and decoding - The "Unicode Problem"
// https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem
function b64EncodeUnicode(str) {
	return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode(`0x${p1}`)));
}

/**
 * Remove style/link elements for specified node IDs
 * if they are no longer referenced by UI components.
 */
function removeCss(ids) {
	for (const id of ids) {
		if (--inserted[id] <= 0) {
			const elem = document.getElementById(id);
			if (elem) {
				elem.parentNode.removeChild(elem);
			}
		}
	}
}

/**
 * Example:
 *   // Insert CSS styles object generated by `css-loader` into DOM
 *   var removeCss = insertCss([[1, 'body { color: red; }']]);
 *
 *   // Remove it from the DOM
 *   removeCss();
 */
function insertCss(styles, { replace = false, prepend = false, prefix = 's' } = {}) {
	const ids = new Set();

	for (const cssModule of styles) {
		const [moduleId, css, media, sourceMap] = cssModule;
		const id = `${prefix}${moduleId}`;

		ids.add(id);

		if (inserted[id]) {
			if (!replace) {
				inserted[id]++;
				continue;
			}
		}

		inserted[id] = 1;

		let elem = document.getElementById(id);
		let create = false;

		if (!elem) {
			create = true;

			elem = document.createElement('style');
			elem.setAttribute('type', 'text/css');
			elem.id = id;

			if (media) {
				elem.setAttribute('media', media);
			}
		}

		let cssText = css;
		if (sourceMap && typeof btoa === 'function') {
			// skip IE9 and below, see http://caniuse.com/atob-btoa
			cssText += `\n/*# sourceMappingURL=data:application/json;base64,${b64EncodeUnicode(
				JSON.stringify(sourceMap)
			)}*/`;
			cssText += `\n/*# sourceURL=${sourceMap.file}?${id}*/`;
		}

		if ('textContent' in elem) {
			elem.textContent = cssText;
		} else {
			elem.styleSheet.cssText = cssText;
		}

		if (create) {
			if (prepend) {
				document.head.insertBefore(elem, document.head.childNodes[0]);
			} else {
				document.head.appendChild(elem);
			}
		}
	}

	return removeCss.bind(null, ids);
}

module.exports = insertCss;
