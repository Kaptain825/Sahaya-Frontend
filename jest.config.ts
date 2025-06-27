import type { Config } from "jest";

const config: Config = {
	verbose: true,
	testEnvironment: "jsdom",
	setupFilesAfterEnv: ["<rootDir>/src/jest.setup.js"], // Make sure this file exists
	moduleNameMapper: {
		"\\.(css|less|scss|sass)$": "identity-obj-proxy",
		"^@/(.*)$": "<rootDir>/src/$1",
	},
	transform: {
		"^.+\\.(ts|tsx)$": "ts-jest",
	},
	globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json'
    	}
  	},
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};

module.exports = config;