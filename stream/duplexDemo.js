import Duplex from "stream";

const duplexStream = new Duplex({
  read(size) {
    // Do nothing here, as we're not reading from an underlying source
  },
  write(chunk, encoding, callback) {
    console.log("Received:", chunk.toString());
    callback();
  },
});

duplexStream.on("data", (chunk) => {
  console.log("Data from duplex stream:", chunk.toString());
});

duplexStream.write("Hello, duplex stream");
duplexStream.end();
