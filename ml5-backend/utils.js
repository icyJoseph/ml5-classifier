const fs = require("fs");
const path = require("path");

function asyncWrite(name, data) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, "db", name);
    return fs.writeFile(filePath, JSON.stringify(data), "utf-8", (err) => {
      if (err) {
        console.log(`Failed to write: ${filePath}`);
        console.log(err);
        return reject(data);
      }
      console.log(`Done writing: ${filePath}`);
      return resolve(data);
    });
  });
}

function asyncRead(name) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, "./db", name);
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        console.log(`Failed to read: ${filePath}`);
        return reject(name);
      }
      console.log(`Done reading: ${filePath}`);
      return resolve(JSON.parse(data));
    });
  });
}

function asyncReadDir(dir) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, "db", dir);
    fs.readdir(filePath, async (err, files) => {
      if (err) {
        console.log(`Failed to read: ${filePath}`);
        return reject(dir);
      }
      console.log(`Done reading: ${filePath}`);
      return resolve(files);
    });
  });
}

const selectFromResults = ({
  tags: _omit,
  alt_description: alt,
  description: caption,
  urls,
  ...data
}) => ({
  ...data,
  alt,
  caption,
  url: `${urls.raw}fm=jpg&fit=crop&w=512&h=512&q=80&fit=crop`
});

module.exports = {
  selectFromResults,
  asyncWrite,
  asyncRead,
  asyncReadDir
};
