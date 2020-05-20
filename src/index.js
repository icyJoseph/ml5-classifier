let poly = require("preact-cli/lib/lib/webpack/polyfills");

import { h } from "preact";
import habitat from "preact-habitat";

import Widget from "./components/Widget";

let _habitat = habitat(Widget);

_habitat.render({
  inline: true
});
