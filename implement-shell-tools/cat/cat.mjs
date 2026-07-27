import process from "node:process";
import { promises as fs } from "node:fs";
import { Command } from "commander";

const program = new Command();
program
	.name("cat")
	.description("Concatenate files and print them to stdout")
	.option("-n, --number", "number all output lines")
	.option("-b, --number-nonblank", "number non-blank lines")
	.argument("<paths...>", "Paths to process");

program.parse();

const options = program.opts();
const paths = program.args;
let lineNumber = 1;

for (const path of paths) {
	const contents = await fs.readFile(path, "utf8");
	const endsWithNewline = contents.endsWith("\n");

	let lines = contents.split("\n");

	if (endsWithNewline) {
		lines.pop();
	}

	if (options.numberNonblank) {
		lines = numberLines(lines, false);
	} else if (options.number) {
		lines = numberLines(lines, true);
	}

	let output = lines.join("\n");

	if (endsWithNewline) {
		output += "\n";
	}

	process.stdout.write(output);
}

function numberLines(lines, includeBlankLines) {
	for (let i = 0; i < lines.length; i++) {
		if (includeBlankLines || lines[i].length > 0) {
			lines[i] = `${String(lineNumber).padStart(6, " ")}\t${lines[i]}`;
			lineNumber++;
		}
	}

	return lines;
}
