import process from "node:process";
import { promises as fs } from "node:fs";

const optionDefinitions = [
	{
		short: "-n",
		description: "Numbers all output lines",
	},
	{
		short: "-b",
		description: "Numbers non-blank output lines",
	},
];

const argv = process.argv.slice(2);
// if (argv.length != 1) {
// 	console.error(
// 		`Expected exactly 1 argument (a path) to be passed but got ${argv.length}.`,
// 	);
// 	process.exit(1);
// }

console.log(argv);

const matchedOptions = optionDefinitions.find((option) => arg === option.short);
const paths = [];
for (const arg of argv) {
	if (arg.match(flagRegex)) {
		flags.push(arg);
	} else {
		paths.push(arg);
	}
}
console.log(flags, paths);

for (const path of paths) {
	const contents = await fs.readFile(path, "utf8");
	process.stdout.write(contents);
}
