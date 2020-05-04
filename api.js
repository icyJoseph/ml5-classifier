const Unsplash = require("unsplash-js").default;
const { asyncRead, asyncWrite, asyncReadDir } = require("./utils");

const unsplash = new Unsplash({
  accessKey: process.env.UNSPLASH_API_KEY,
  timeout: 500
});

const searchPhotos = ({ search }) => {
  const filePath = `search/${search}.json`;
  return asyncRead(filePath).catch(() =>
    unsplash.search
      .photos(search, 1, 10, {
        orientation: "portrait"
      })
      .then((res) => res.json())
      .then((res) => asyncWrite(filePath, res))
  );
};

const classifyPhoto = ({ photo, classification }) => {
  const filePath = `classified/${photo.id}.json`;
  return asyncWrite(filePath, { ...photo, classification });
};

const getClassified = async () => {
  const fileNames = await asyncReadDir("classified").catch((e) => {
    return [];
  });

  const classified = await Promise.all(
    fileNames.map((filename) => asyncRead(`classified/${filename}`))
  );

  return classified;
};

module.exports = {
  searchPhotos,
  classifyPhoto,
  getClassified
};
