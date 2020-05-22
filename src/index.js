let poly = require("preact-cli/lib/lib/webpack/polyfills");

import { h } from "preact";
import habitat from "preact-habitat";

import Widget from "./components/Widget";

let root = document.createElement("div");
root.setAttribute("id", "root");
document.body.appendChild(root);

let _habitat = habitat(Widget);

_habitat.render({
  selector: "#root"
});
