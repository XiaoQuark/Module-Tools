import process from "node:process";
import fs, { truncate } from "node:fs";

const argv = process.argv.slice(2);

const options = {
	onePerLine: false,
	all: false,
	help: false,
};

const validFlags = {
	onePerLine: {
		short: "-1",
		long: "--one-per-line",
		description: "Lists one file per line",
	},
	all: {
		short: "-a",
		long: "--all",
		description: "Include entries whose names begin with a dot",
	},
	help: {
		short: "-h",
		long: "--help",
		description: "Display help information",
	},
};

const paths = [];
let parsingFlags = true;

for (const arg of argv) {
	if (arg === "--") {
		parsingFlags = false;
	} else if (parsingFlags && arg.startsWith("--")) {
		const matchedFlag = Object.entries(validFlags).find(
			([, definition]) => arg === definition.long,
		);

		if (matchedFlag) {
			const [optionName] = matchedFlag;
			options[optionName] = true;
		} else {
			process.stderr.write(`Invalid option -- '${arg}'\n`);
			process.exit(1);
		}
	} else if (parsingFlags && arg.startsWith("-")) {
		const shortFlags = arg.slice(1);

		for (const shortFlag of shortFlags) {
			const matchedFlag = Object.entries(validFlags).find(
				([, definition]) => definition.short === `-${shortFlag}`,
			);

			if (matchedFlag) {
				const [optionName] = matchedFlag;
				options[optionName] = true;
			} else {
				process.stderr.write(`Invalid option -- '${arg}\n'`);
				process.exit(1);
			}
		}
	} else {
		paths.push(arg);
	}
}

if (options.help) {
	process.stdout.write("Usage: ls [OPTION]... [FILE]...\n");
	process.stdout.write(
		"List information about the FILEs (the current directory by default).\n\n",
	);
	process.stdout.write("Options:\n");

	for (const definition of Object.values(validFlags)) {
		process.stdout.write(
			`  ${definition.short}, ${definition.long}\t${definition.description}\n`,
		);
	}

	process.exit(0);
}

if (paths.length === 0) {
	paths.push(".");
}

const multiplePaths = paths.length > 1;
const filePaths = [];
const directoryPaths = [];

for (const path of paths) {
	const stats = fs.statSync(path);

	if (stats.isDirectory()) {
		directoryPaths.push(path);
	} else {
		filePaths.push(path);
	}
}

if (filePaths.length > 0) {
	const separator = options.onePerLine ? "\n" : "  ";
	process.stdout.write(`${filePaths.join(separator)}\n`);
}

for (const path of directoryPaths) {
	if (multiplePaths) {
		process.stdout.write(`\n${path}: \n`);
	}
	let content = fs.readdirSync(path);

	if (options.all) {
		content.unshift(".", "..");
	} else {
		content = content.filter((entry) => !entry.startsWith("."));
	}

	content.sort();

	const separator = options.onePerLine ? "\n" : "  ";
	const output = content.join(separator);

	process.stdout.write(`${output}\n`);
}
