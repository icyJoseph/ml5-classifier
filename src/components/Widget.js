import { h, Component } from "preact";
import ml5 from "ml5";
import widget from "./widget.scss";

import { Trigger } from "./Trigger";
import { Window } from "./Window";

export default class Widget extends Component {
  state = {
    modelLoaded: false,
    results: [],
    openWindow: false
  };

  classifier = null;

  componentDidMount() {
    this.classifier = ml5.imageClassifier("Mobilenet", () =>
      this.setState({ modelLoaded: true })
    );
    window.addEventListener("click", this.classify.bind(this));
  }

  componentWillUnmount() {
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

  render(props, state) {
    const { modelLoaded, results, openWindow } = state;
    const { color } = props;

    return (
      <div className={widget.widget}>
        {openWindow && (
          <Window>
            <h1 style={{ color }}>Hello, ML5!</h1>
            <p>Model {modelLoaded ? "loaded" : "not-loaded"}</p>
            <ul style={{ listStyle: "none" }}>
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
          toggleWindow={() =>
            this.setState((prevState) => ({
              openWindow: !prevState.openWindow
            }))
          }
        />
      </div>
    );
  }
}
