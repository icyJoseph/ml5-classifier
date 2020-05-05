import React from "react";

import Empty from "assets/empty.png";

import { Box } from "components/Box";
import { Card } from "components/Card";
import { Container } from "components/Container";
import { Flex } from "components/Flex";
import { Fieldset, Form } from "components/Input";
import { Sidebar } from "components/Sidebar";
import { Preview } from "components/Preview";
import { Title } from "components/Title";
import { useThemeMode } from "providers/ThemeProvider";
import { classifier } from "utils";
import {
  fetchUser,
  searchPhotos,
  classifyPhoto,
  fetchClassifiedPhotos
} from "api/backend";
import { Fab } from "components/Fab";

const UserInfo = ({ user, onUserDataClick }) => (
  <>
    <h6 onClick={onUserDataClick}>{user.username}</h6>
    <span>{user.bio}</span>
  </>
);

const HamburgerMenu = () => (
  <span role="img" aria-label="sidebar-open">
    🍔
  </span>
);

const Image = (
  {
    url,
    alt,
    caption = "Search Images from Splash",
    clickHandler,
    children
  } = {
    caption: null
  }
) => {
  const [img, setImg] = React.useState(null);

  React.useEffect(() => {
    if (url) {
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
    }
  }, [url]);

  return (
    <Card>
      <Card.Figure>
        <Card.FigCaption top={0}>
          {caption ?? "No caption available"}
        </Card.FigCaption>
        <Card.Overlay>
          <img src={Empty} alt="Loading..." />
        </Card.Overlay>
        {img && (
          <>
            <Card.Image
              src={img}
              className="image"
              alt={alt}
              onClick={(e) => classifier.classify(e.target).then(clickHandler)}
            />
            <Card.FigCaption bottom={0}>{children}</Card.FigCaption>
          </>
        )}
      </Card.Figure>
    </Card>
  );
};

function Root({ sidebarDocked, toggleSideBar }) {
  const [list, setList] = React.useState([]);
  const [err, setErr] = React.useState(null);

  const inputRef = React.useRef();

  if (err) return <span>{err.message}</span>;

  const saveClassification = (results) => {
    const [photo] = list;

    if (photo) {
      return classifyPhoto({ photo, results });
    }
  };

  const fetchUserData = (username) => fetchUser({ username }).then(console.log);

  const handleSubmit = (e) => {
    e.preventDefault();
    const search = inputRef.current.value;
    return searchPhotos({ search })
      .then(({ results }) => setList(results))
      .catch(() => setErr({ message: `Failed to search: ${search}` }));
  };

  return (
    <Container>
      <Title as="h1" ml={4} mt={2} mb={1}>
        {`ML5 + Unsplash = <3`}
      </Title>
      <Form onSubmit={handleSubmit}>
        <Fieldset mt={2} mb={3} p={0}>
          <Fieldset.Input ref={inputRef} type="text" placeholder="search" />
          <Fieldset.Button type="submit">
            <span role="img" aria-label="search-button">
              🔎
            </span>
          </Fieldset.Button>
          <Fieldset.Legend>search</Fieldset.Legend>
        </Fieldset>
      </Form>

      <Image {...list[0]} clickHandler={saveClassification}>
        <UserInfo
          user={list[0]?.user}
          onUserDataClick={() => fetchUserData(list[0]?.user?.username)}
        />
      </Image>

      {!sidebarDocked && (
        <Fab onClick={toggleSideBar}>
          <HamburgerMenu />
        </Fab>
      )}
    </Container>
  );
}

const SideBarContent = () => {
  const [classified, setClassified] = React.useState([]);
  const [checked, toggle] = useThemeMode();

  React.useEffect(() => {
    fetchClassifiedPhotos().then(setClassified);
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
