const Unsplash = require("unsplash-js").default;
const {
  asyncRead,
  asyncWrite,
  asyncReadDir,
  selectFromResults
} = require("./utils");

const unsplash = new Unsplash({
  accessKey: process.env.UNSPLASH_API_KEY,
  timeout: 5000
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

const getUserProfile = ({ username }) => {
  return unsplash.users.profile(username).then((res) => res.json());
};

const getPhoto = ({ id }) => {
  return unsplash.photos.getPhoto(id).then((res) => res.json());
};

const classifyPhoto = ({ photo, classification }) => {
  const filePath = `classified/${photo.id}.json`;
  return asyncWrite(filePath, {
    ...photo,
    classification: {
      ...classification,
      classification_date: new Date().toUTCString()
    }
  });
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

const updatePhoto = async (photo) => {
  try {
    const stale = await asyncRead(`classified/${photo.id}`);
    const fresh = await getPhoto(photo);
    const updated = { ...stale, ...selectFromResults(fresh) };
    return asyncWrite(`classified/${photo.id}`, updated);
  } catch (e) {
    return {};
  }
};

module.exports = {
  searchPhotos,
  classifyPhoto,
  getClassified,
  updatePhoto,
  getUserProfile
};
