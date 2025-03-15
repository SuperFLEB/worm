/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
	preset: 'ts-jest',
	testEnvironment: "node",
	transform: {
		'^.+\\.m?tsx?$': ['ts-jest', {
			useESM: true,
			tsconfig: './tsconfig.jest-ts.json'
		}],
	},
	testMatch: ['**/*.test.ts'],

	// Indicates whether the coverage information should be collected while executing the test
	collectCoverage: true,

	// Indicates which provider should be used to instrument code for coverage
	coverageProvider: "v8",

	// An array of file extensions your modules use
	moduleFileExtensions: ["js", "ts"],
	extensionsToTreatAsEsm: ['.ts'],
};
