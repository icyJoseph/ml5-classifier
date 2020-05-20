import { h, Component } from "preact";
import ml5 from "ml5";
import widget from "./style.scss";

export default class App extends Component {
  state = {
    modelLoaded: false
  };

  classifier = null;

  componentDidMount() {
    this.classifier = ml5.imageClassifier("Mobilenet", () =>
      this.setState({ modelLoaded: true })
    );
    window.addEventListener("click", this.classify.bind(this));
  }

  classify(e) {
    return this.classifier.classify(e.target, (err, results) => {
      if (err) return console.log(err);
      console.log(results);
    });
  }

  render(props, state) {
    const { modelLoaded } = state;
    const { color } = props;
    return (
      <div className={widget.widget}>
        <h1 style={{ color }}>Hello, World!</h1>
        <p>Model {modelLoaded ? "loaded" : "not-loaded"}</p>
      </div>
    );
  }
}
