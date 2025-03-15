/*
(Licensed under BSD 1-clause license)

WORM Object Properties Module - Copyright 2025 SuperFLEB.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice,
this list of conditions and the following disclaimer.

THIS SOFTWARE IS PROVIDED “AS IS” AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE CREATOR(S)
OR PROVIDER(S) BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE
OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * Declare one or more keys on an object to be "WORM" (Write once, ready many), meaning that after the first write to
 * the property, subsequent writes will fail in the manner that a non-writable property would (see defineProperty docs--
 * in short, it throws in Strict mode and silently fails outside Strict Mode.)
 * @param keys Array of keys to make WORM
 * @param obj Object to apply properties to, or undefined to create a new object
 * @param defaults (optional) Object with default/initial/fallback values. If omitted, obj is used.
 */
const worm = <T extends Record<string, any>>(keys: (keyof T)[] | null = null, obj: T = {} as T): T => {
	if (!(Object.keys(obj).length || keys?.length)) {
		console.warn("Neither keys nor starting object were given. WORM functionality does not apply to properties added later. An empty object will be returned.");
		return {} as T;
	}

	for (const k of (keys ?? Object.keys(obj))) {
		const v = k in obj ? obj[k] : undefined;
		Object.defineProperty(obj, k, {
			configurable: true,
			get() {
				return v;
			},
			set(value) {
				Object.defineProperty(obj, k, {
					value,
					configurable: false,
					writable: false,
				});
			},
		});
	}
	return obj;
};

export default worm;