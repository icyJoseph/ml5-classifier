import { h, Component } from "preact";
import widget from "./widget.scss";

import { Trigger } from "./Trigger";
import { Window } from "./Window";

import { appendScript } from "../utils/appendScript";

export class Widget extends Component {
  state = {
    modelLoaded: false,
    results: [],
    openWindow: false,
    nextWindow: false
  };

  classifier = null;
  cancelScriptLoader = null;

  componentDidMount() {
    this.cancelScriptLoader = appendScript({
      src: "https://unpkg.com/ml5@0.4.3/dist/ml5.min.js",
      onError: () => console.error("Error loading ml5"),
      onLoad: () => {
        this.classifier = ml5.imageClassifier("Mobilenet", () =>
          this.setState({ modelLoaded: true })
        );
      }
    });

    window.addEventListener("click", this.classify.bind(this));
  }

  componentWillUnmount() {
    if (this.cancelScriptLoader) {
      this.cancelScriptLoader();
    }
    window.removeEventListener("click", this.classify.bind(this));
  }

  classify(e) {
    e.preventDefault();
    const targetSrc = e.target.src;
    const imgEl = document.createElement("img");

    imgEl.crossOrigin = "anonymous";
    imgEl.src = targetSrc;

    imgEl.onload = () => {
      return this.classifier.classify(imgEl, (err, results) => {
        if (err) return console.log(err);
        console.log(results);
        return this.setState({ results });
      });
    };
  }

  toggleWindow = () => {
    return this.setState((prevState) => ({
      openWindow: !prevState.openWindow
    }));
  };

  bufferWindowToggle = () => {
    return this.setState(
      (prevState) => ({
        nextWindow: !prevState.openWindow
      }),
      () => setTimeout(this.toggleWindow, 300)
    );
  };

  render(props, state) {
    const { modelLoaded, results, openWindow, nextWindow } = state;
    const { color, background } = props;

    return (
      <div
        className={widget.widget}
        style={{ "--background": background, "--color": color }}
      >
        {openWindow && (
          <Window openWindow={openWindow} nextWindowState={nextWindow}>
            <h1>Hello, ML5!</h1>
            <p>Model {modelLoaded ? "loaded" : "not-loaded"}</p>
            <ul>
              {results.map(({ label, confidence }) => (
                <li key={label}>
                  {Math.floor(confidence * 100)}% - {label}
                </li>
              ))}
            </ul>
          </Window>
        )}
        <Trigger
          loading={!modelLoaded}
          toggleWindow={this.bufferWindowToggle}
        />
      </div>
    );
  }
}
