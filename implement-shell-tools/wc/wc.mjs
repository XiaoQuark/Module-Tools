import process from "node:process";
import fs from "node:fs";
import { parseArgs } from "node:util";

const options = {
	lines: {
		type: "boolean",
		short: "l",
	},
	words: {
		type: "boolean",
		short: "w",
	},
	bytes: {
		type: "boolean",
		short: "c",
	},
};

const { values, positionals } = parseArgs({
	options,
	allowPositionals: true,
});

if (positionals.length === 0) {
	process.stderr.write("Please provide a file.\n");
	process.exit(1);
}

const results = [];

// read file and calculate counts
for (const path of positionals) {
	const content = fs.readFileSync(path, "utf-8");

	const lineCount = [...content].filter((char) => char === "\n").length;

	const trimmedContent = content.trim();

	const wordCount =
		trimmedContent === "" ? 0 : trimmedContent.split(/\s+/).length;

	const byteCount = Buffer.byteLength(content);

	results.push({
		path,
		lineCount,
		wordCount,
		byteCount,
	});
}

let totalLines = 0;
let totalWords = 0;
let totalBytes = 0;

// calculate total counts
for (const result of results) {
	totalLines += result.lineCount;
	totalWords += result.wordCount;
	totalBytes += result.byteCount;
}

const allCounts = [];

for (const result of results) {
	const counts = getSelectedCounts(
		result.lineCount,
		result.wordCount,
		result.byteCount,
	);

	allCounts.push(...counts);
}

if (results.length > 1) {
	const totalCounts = getSelectedCounts(totalLines, totalWords, totalBytes);

	allCounts.push(...totalCounts);
}

// flags handling function
function getSelectedCounts(lineCount, wordCount, byteCount) {
	const counts = [];

	if (values.lines) {
		counts.push(lineCount);
	}

	if (values.words) {
		counts.push(wordCount);
	}

	if (values.bytes) {
		counts.push(byteCount);
	}

	if (counts.length === 0) {
		counts.push(lineCount, wordCount, byteCount);
	}

	return counts;
}

// output formatting
let largestByteCount = 0;

for (const result of results) {
	if (result.byteCount > largestByteCount) {
		largestByteCount = result.byteCount;
	}
}

if (results.length > 1 && totalBytes > largestByteCount) {
	largestByteCount = totalBytes;
}

const width = String(largestByteCount).length;

for (const result of results) {
	const counts = getSelectedCounts(
		result.lineCount,
		result.wordCount,
		result.byteCount,
	);

	const formattedCounts = counts
		.map((count) => String(count).padStart(width))
		.join(" ");

	process.stdout.write(`${formattedCounts} ${result.path}\n`);
}

if (results.length > 1) {
	const totalCounts = getSelectedCounts(totalLines, totalWords, totalBytes);

	const formattedTotals = totalCounts
		.map((count) => String(count).padStart(width))
		.join(" ");

	process.stdout.write(`${formattedTotals} total\n`);
}
