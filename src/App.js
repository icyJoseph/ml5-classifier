import React from "react";

import Empty from "assets/empty.png";

import { Box } from "components/Box";
import { Card } from "components/Card";
import { Container } from "components/Container";
import { Flex } from "components/Flex";
import { Fieldset } from "components/Input";
import { Sidebar } from "components/Sidebar";
import { Preview } from "components/Preview";
import { useThemeMode } from "providers/ThemeProvider";
import { classifier } from "utils";

const baseUrl = process.env.REACT_APP_BACKEND_URL;

const UserInfo = ({ user, onUserDataClick }) => (
  <>
    <h6 onClick={onUserDataClick}>{user.username}</h6>
    <span>{user.bio}</span>
  </>
);

const Image = ({ url, alt, caption, clickHandler, children }) => {
  const [img, setImg] = React.useState(null);

  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetch(url, { signal })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response;
        }
        throw new Error("Invalid Image Response");
      })
      .then((response) => response.blob())
      .then((data) => {
        const objectURL = URL.createObjectURL(data);
        return objectURL;
      })
      .then((res) => setTimeout(() => setImg(res), 2000))
      .catch(() => {
        if (!signal.aborted) {
          console.warn("Aborted Image Request");
        }
      });

    return () => controller.abort();
  }, [url]);

  return (
    <Card>
      <Card.Figure>
        <Card.FigCaption top={0}>{caption}</Card.FigCaption>
        <Card.Overlay>
          <img src={Empty} alt="Loading..." />
        </Card.Overlay>
        {img && (
          <Card.Image
            src={img}
            className="image"
            alt={alt}
            onClick={(e) => classifier.classify(e.target).then(clickHandler)}
          />
        )}
        <Card.FigCaption bottom={0}>{children}</Card.FigCaption>
      </Card.Figure>
    </Card>
  );
};

function Root({ sidebarDocked, toggleSideBar }) {
  const [list, setList] = React.useState([]);
  const [err, setErr] = React.useState(null);

  const inputRef = React.useRef();

  React.useEffect(() => {
    fetch(`${baseUrl}/search?search=dogs`)
      .then(async (res) => {
        if (res.status !== 200) {
          const err = await res.json();
          throw err;
        }
        return res;
      })
      .then((res) => res.json())
      .then(({ results }) => setList(results))
      .catch((err) => {
        return setErr(err);
      });
  }, []);

  if (err) return <span>{err.message}</span>;
  if (!list.length) return null;

  const [{ url, alt, caption, ...rest }] = list;

  const saveClassification = (results) => {
    const photo = { url, alt, caption, ...rest };

    return fetch(`${baseUrl}/classify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        photo,
        classification: {
          results,
          validation: "good"
        }
      })
    }).then(() => fetch(`${baseUrl}/classified`).then((res) => res.json()));
  };

  const fetchUserData = (username) =>
    fetch(`${baseUrl}/user?username=${username}`)
      .then((res) => res.json())
      .then(console.log);

  const handleSubmit = (e) => {
    e.preventDefault();
    const search = inputRef.current.value;
    fetch(`${baseUrl}/search?search=${search}`)
      .then((res) => res.json())
      .then(({ results }) => setList(results));
  };

  return (
    <Container>
      <h1 style={{ margin: 0 }}>ML5 + Unsplash</h1>
      <form onSubmit={handleSubmit}>
        <Fieldset>
          <Fieldset.Input ref={inputRef} type="text" placeholder="search" />
          <Fieldset.Button type="submit">
            <span role="img" aria-label="search-button">
              🔎
            </span>
          </Fieldset.Button>
          <Fieldset.Legend>search</Fieldset.Legend>
        </Fieldset>
      </form>

      <Image
        url={url}
        alt={alt}
        caption={caption}
        clickHandler={saveClassification}
      >
        <UserInfo
          user={rest.user}
          onUserDataClick={() => fetchUserData(rest.user.username)}
        />
      </Image>

      {!sidebarDocked && <button onClick={toggleSideBar}>Open/Close</button>}
    </Container>
  );
}

const SideBarContent = () => {
  const [classified, setClassified] = React.useState([]);
  const [checked, toggle] = useThemeMode();

  React.useEffect(() => {
    fetch(`${baseUrl}/classified`)
      .then((res) => res.json())
      .then(setClassified);
  }, []);

  return (
    <Flex flexDirection="column" alignItems="center" width="256px">
      <div>
        <input type="checkbox" onClick={toggle} value={checked}></input>
      </div>
      {classified.map((item) => (
        <Box key={item.id} width="128px" my={2}>
          <Preview>
            <Preview.Image src={item.url} alt={item.alt} />
          </Preview>
        </Box>
      ))}
    </Flex>
  );
};

const mql = window.matchMedia(`(min-width: 812px)`);

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarDocked: mql.matches,
      sidebarOpen: false
    };

    this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
  }

  componentWillMount() {
    mql.addListener(this.mediaQueryChanged);
  }

  componentWillUnmount() {
    mql.removeListener(this.mediaQueryChanged);
  }

  onSetSidebarOpen(open) {
    this.setState((prev) => ({ sidebarOpen: !prev.sidebarDocked && open }));
  }

  mediaQueryChanged() {
    this.setState({ sidebarDocked: mql.matches, sidebarOpen: false });
  }

  render() {
    return (
      <Sidebar
        sidebar={<SideBarContent />}
        open={this.state.sidebarOpen}
        docked={this.state.sidebarDocked}
        onSetOpen={this.onSetSidebarOpen}
      >
        <Root
          sidebarDocked={this.state.sidebarDocked}
          toggleSideBar={() => this.onSetSidebarOpen(!this.state.sidebarOpen)}
        />
      </Sidebar>
    );
  }
}
