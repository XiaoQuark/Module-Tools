import process from "node:process";
import { promises as fs } from "node:fs";
import { Command } from "commander";

const program = new Command();
program
	.name("cat")
	.description("Concatenate files and print them to stdout")
	.option("-n, --number", "number all output lines")
	.option("-b, --number-nonblank", "number non-blank lines")
	.option(
		"-r, --replace-empty-lines",
		"Replaces multiple consecutive empty lines with one empty line",
	)
	.argument("<paths...>", "Paths to process");

program.parse();

const options = program.opts();
const paths = program.args;

console.log(options);

for (const path of paths) {
	let contents = await fs.readFile(path, "utf8");
	const lines = contents.split("\n");

	if (options.replaceEmptyLines) {
		contents = replaceEmptyLines(lines);
	}

	if (options.numberNonblank) {
		contents = numberLines(lines, false);
	} else if (options.number) {
		contents = numberLines(lines, true);
	}

	process.stdout.write(contents);
}

function numberLines(lines, includeBlankLines) {
	let lineNumber = 1;
	for (let i = 0; i < lines.length; i++) {
		if (includeBlankLines || lines[i].length > 0) {
			lines[i] = `${lineNumber} ${lines[i]}`;
			lineNumber++;
		}
	}

	return lines.join("\n");
}

function replaceEmptyLines(lines) {
	const result = [];
	let previousLineWasBlank = false;

	for (let i; i < lines.length; i++) {
		const currentLineIsBlank = lines[i].length === 0;
		if (!currentLineIsBlank || !previousLineWasBlank) {
			result.push(lines[i]);
		}
		previousLineWasBlank = currentLineIsBlank;
	}

	return result.join("\n");
}
