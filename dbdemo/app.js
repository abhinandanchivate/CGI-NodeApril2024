import dotenv from "dotenv";
import http from "http";
dotenv.config();

let data = [
  { id: 1, name: "John Doe", age: 30 },
  { id: 2, name: "Jane Doe", age: 25 },
  { id: 3, name: "Bob Smith", age: 35 },
];

const port = process.env.PORT;
const host = process.env.DB_HOST;
const userName = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
console.log("Port number" + port);
console.log("host name" + host);
console.log("user name" + userName);
console.log("password" + password);

const server = http.createServer((req, res) => {
  console.log(req.method + " " + req.url);
  console.log(req.headers);
  //   const method = req.method
  //   const url = req.url
  //   const headers = req.headers
  // destructure the object
  const { method, url, headers } = req;

  if (url == "/data" && method == "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  }
  // /data/:id :id==> actual data id for user details
  if (url.startsWith("/data/") && method == "GET") {
    // /data/:id
    const id = parseInt(url.split("/")[2]);
    const item = data.find((e) => e.id === id);
    if (item == null) {
      res.end(id + " is not available");
    } else {
      res.end(JSON.stringify(item));
    }
  }
  if (url == "/data" && method == "POST") {
    // we need to read the data from the req ==> form the json object
    // we need to push that object into the data array.
    let body = "";
    req.on("data", (chunk) => {
      console.log(chunk);
      body += chunk.toString();
      console.log(body + "body");
    });

    res.writeHead(201, { "Content-Type": "text/plain" });
    res.end("object added successfully!!!", () => {
      let newData = JSON.parse(body);
      data.push(newData);
      data.push(newData);

      data.forEach((e) => console.log(e));
    });
  }
});
// listen on port ==> we are going to start listening the req for our server via specific port

server.listen(port, () => {
  console.log(`Server runnning at http://localhost:${port}`);
});
