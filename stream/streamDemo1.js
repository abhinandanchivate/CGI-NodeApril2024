import fs from "fs";

// fs ==>
const readableStream = fs.createReadStream("input.txt");

const outputStream = fs.createWriteStream("output.txt");

// pipe the readable stream to the writable stream

readableStream.pipe(outputStream);
