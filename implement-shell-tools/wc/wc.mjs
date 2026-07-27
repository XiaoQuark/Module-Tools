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

const fileCounts = [];

for (const path of positionals) {
	fileCounts.push(countFile(path));
}

const totalCounts = {
	lineCount: 0,
	wordCount: 0,
	byteCount: 0,
};

for (const file of fileCounts) {
	totalCounts.lineCount += file.lineCount;
	totalCounts.wordCount += file.wordCount;
	totalCounts.byteCount += file.byteCount;
}

// output formatting
const largestByteCount =
	fileCounts.length > 1 ? totalCounts.byteCount : fileCounts[0].byteCount;

const width = String(largestByteCount).length;

for (const file of fileCounts) {
	const formattedCounts = formatCounts(file, width);

	process.stdout.write(`${formattedCounts} ${file.path}\n`);
}

if (fileCounts.length > 1) {
	const formattedTotals = formatCounts(totalCounts, width);

	process.stdout.write(`${formattedTotals} total\n`);
}

function countFile(path) {
	const content = fs.readFileSync(path, "utf-8");

	const lineCount = [...content].filter((char) => char === "\n").length;

	const trimmedContent = content.trim();

	const wordCount =
		trimmedContent === "" ? 0 : trimmedContent.split(/\s+/).length;

	const byteCount = Buffer.byteLength(content);

	return {
		lineCount,
		wordCount,
		byteCount,
		path,
	};
}

function getSelectedCounts(lineCount, wordCount, byteCount) {
	const selectedCounts = [];

	if (values.lines) {
		selectedCounts.push(lineCount);
	}

	if (values.words) {
		selectedCounts.push(wordCount);
	}

	if (values.bytes) {
		selectedCounts.push(byteCount);
	}

	if (selectedCounts.length === 0) {
		selectedCounts.push(lineCount, wordCount, byteCount);
	}

	return selectedCounts;
}

function formatCounts(counts, width) {
	const selectedCounts = getSelectedCounts(
		counts.lineCount,
		counts.wordCount,
		counts.byteCount,
	);

	return selectedCounts
		.map((count) => String(count).padStart(width))
		.join(" ");
}
