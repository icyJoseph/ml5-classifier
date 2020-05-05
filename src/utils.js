import ml5 from "ml5";

const logger = (res) => {
  console.log(res);
  return res;
};

const initClassifier = () => {
  const base = ml5.YOLO("cocossd");
  const mobileNet = ml5.imageClassifier("mobilenet");

  return {
    detect: (image) => {
      console.log("Detecting Objects on Image");
      return base.detect(image).then(logger);
    },
    classify: (image) => {
      console.log("Classifying Image using mobile net");
      return mobileNet
        .then((classifier) => classifier.classify(image))
        .then(logger);
    }
  };
};

export const classifier = initClassifier();
