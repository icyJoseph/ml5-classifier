import React from "react";

import Empty from "assets/empty.png";

import { Box } from "components/Box";
import { Card } from "components/Card";
import { Container } from "components/Container";
import { Flex } from "components/Flex";
import { Fieldset, Form } from "components/Input";
import { Toggle } from "components/Toggle";
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
import { Fab, FabBase } from "components/Fab";
import { Divider } from "components/Divider";

const sortNewest = (a, b) =>
  new Date(b.classification.classification_date) -
  new Date(a.classification.classification_date);

const UserInfo = ({ user, onUserDataClick }) => (
  <>
    <h6 onClick={onUserDataClick}>{user?.username}</h6>
    <span>{user?.bio}</span>
  </>
);

const HamburgerIcon = () => (
  <span role="img" aria-label="sidebar-open" title="Open Sidebar">
    🍔
  </span>
);

const SearchIcon = () => (
  <span role="img" aria-label="search-button">
    🔎
  </span>
);

const ClassifyIcon = () => (
  <span role="img" aria-label="classify-photo" title="Classify Photo">
    🔖
  </span>
);

const LightMode = () => (
  <span role="img" aria-label="light-mode">
    🌅
  </span>
);

const DarkMode = () => (
  <span role="img" aria-label="dark-mode">
    🌙
  </span>
);

const Back = () => (
  <span role="img" aria-label="back">
    🔙
  </span>
);

const Image = (
  {
    url,
    alt,
    caption = "Search Images from Splash",
    imgRef,
    children,
    classification
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
        .then((res) => setImg(res))
        .catch(() => {
          if (!signal.aborted) {
            console.warn("Aborted Image Request");
          }
        });

      return () => controller.abort();
    } else {
      setImg(null);
    }
  }, [url]);

  return (
    <Card>
      <Card.Figure>
        <Card.FigCaption top={0}>
          {caption ?? "No caption available"}
          {classification.length > 0 && (
            <>
              <br />
              <span>
                Classification:
                {classification.reduceRight((prev, curr) => {
                  const val = ` ${curr.label} ${(curr.confidence * 100).toFixed(
                    2
                  )}%`;
                  if (prev) {
                    return `${val} /${prev}`;
                  }
                  return `${val}`;
                }, "")}
              </span>
            </>
          )}
        </Card.FigCaption>
        <Card.Overlay>
          <img src={Empty} alt="Loading..." />
        </Card.Overlay>
        {img && (
          <>
            <Card.Image src={img} className="image" alt={alt} ref={imgRef} />
            <Card.FigCaption bottom={0}>{children}</Card.FigCaption>
          </>
        )}
      </Card.Figure>
    </Card>
  );
};

const FwdImageRef = React.forwardRef((props, ref) => (
  <Image {...props} imgRef={ref} />
));

function Root({
  err,
  list,
  current,
  setCurrent,
  handleSubmit,
  sidebarDocked,
  toggleSideBar,
  updateClassified
}) {
  const inputRef = React.useRef();
  const imageRef = React.useRef();
  const [classification, setClassification] = React.useState(
    () => current?.classification?.results ?? []
  );

  React.useEffect(() => {
    if (current) {
      setClassification(current?.classification?.results ?? []);
    } else {
      setClassification([]);
    }
  }, [current]);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  if (err) return <span>{err.message}</span>;

  const saveClassification = (results) => {
    if (current) {
      return classifyPhoto({ photo: current, results }).then(() => {
        setClassification(results);
        updateClassified();
      });
    }
  };

  const fetchUserData = (username) => fetchUser({ username }).then(console.log);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    const search = inputRef.current.value;
    handleSubmit(search);
  };

  return (
    <Container>
      <Title as="h1" ml={sidebarDocked ? 4 : "auto"} mr={"auto"} mt={2} mb={0}>
        {`ML5 + Unsplash = <3`}
      </Title>
      <Form
        onSubmit={onSubmitHandler}
        ml={sidebarDocked ? 4 : "auto"}
        mr={"auto"}
      >
        <Fieldset mt={2} mb={3} p={0}>
          <Fieldset.Input ref={inputRef} type="text" placeholder="search" />
          <Fieldset.Button type="submit">
            <SearchIcon />
          </Fieldset.Button>
          <Fieldset.Legend>search</Fieldset.Legend>
        </Fieldset>
      </Form>

      {current === null ? (
        <Flex
          flexWrap="wrap"
          justifyContent="center"
          alignItems="center"
          width="80%"
          height="fit-content"
          mx="auto"
        >
          {list.map((item) => (
            <Box key={item.id} width="128px" my={1} mx={1}>
              <Preview onClick={() => setCurrent(item)}>
                <Preview.Image src={item.url} alt={item.alt} />
              </Preview>
            </Box>
          ))}
        </Flex>
      ) : (
        <FwdImageRef
          {...current}
          classification={classification}
          ref={imageRef}
        >
          <UserInfo
            user={current?.user}
            onUserDataClick={() => fetchUserData(current?.user?.username)}
          />
        </FwdImageRef>
      )}

      <FabBase>
        {!sidebarDocked && (
          <Fab onClick={toggleSideBar}>
            <HamburgerIcon />
          </Fab>
        )}
        {current !== null && (
          <Fab
            onClick={() =>
              classifier.classify(imageRef.current).then(saveClassification)
            }
          >
            <ClassifyIcon />
          </Fab>
        )}
        {current !== null && (
          <Fab onClick={() => setCurrent(null)}>
            <Back />
          </Fab>
        )}
      </FabBase>
    </Container>
  );
}

const windowViewStep = 5;
const clamp = (min, preferred, max) => Math.min(Math.max(min, preferred), max);

const SideBarContent = ({ classified, setCurrent }) => {
  const [checked, toggle] = useThemeMode();

  const [windowView, setWindowView] = React.useState(windowViewStep);
  const nextWindowViewStep = clamp(
    1,
    classified.length - windowView,
    windowViewStep
  );

  return (
    <Flex flexDirection="column" alignItems="center" width="256px" mb={3}>
      <Box mt={2} mx="auto">
        <Toggle
          checked={checked}
          onChange={toggle}
          darkLabel={<DarkMode />}
          lightLabel={<LightMode />}
        />
      </Box>
      <Divider />
      {classified.slice(0, windowView).map((item) => (
        <Box key={item.id} width="128px" my={2}>
          <Preview onClick={() => setCurrent(item)}>
            <Preview.Image src={item.url} alt={item.alt} />
          </Preview>
        </Box>
      ))}
      <Box mt={2}>
        {windowView < classified.length && (
          <button onClick={() => setWindowView((x) => x + nextWindowViewStep)}>
            Show {nextWindowViewStep} more
          </button>
        )}
      </Box>
    </Flex>
  );
};

const mql = window.matchMedia(`(min-width: 812px)`);

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarDocked: mql.matches,
      sidebarOpen: false,
      classified: [],
      list: [],
      current: null,
      err: null
    };

    this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
  }

  componentDidMount() {
    mql.addListener(this.mediaQueryChanged);
    return this.fetchPreviouslyClassified();
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

  handleSubmit = (search) => {
    return this.setState({ list: [] }, () =>
      searchPhotos({ search })
        .then(({ results }) =>
          this.setState({ list: results, err: null, current: null })
        )
        .catch(() =>
          this.setState({ error: { message: `Failed to search: ${search}` } })
        )
    );
  };

  setCurrent = (next) => {
    this.setState({ current: next });
  };

  fetchPreviouslyClassified = () => {
    fetchClassifiedPhotos()
      .then((res) => res.sort(sortNewest))
      .then((classified) => this.setState({ classified }));
  };

  render() {
    return (
      <Sidebar
        sidebar={
          <SideBarContent
            classified={this.state.classified}
            setCurrent={this.setCurrent}
          />
        }
        open={this.state.sidebarOpen}
        docked={this.state.sidebarDocked}
        onSetOpen={this.onSetSidebarOpen}
      >
        <Root
          sidebarDocked={this.state.sidebarDocked}
          list={this.state.list}
          err={this.state.err}
          toggleSideBar={() => this.onSetSidebarOpen(!this.state.sidebarOpen)}
          updateClassified={this.fetchPreviouslyClassified}
          handleSubmit={this.handleSubmit}
          setCurrent={this.setCurrent}
          current={this.state.current}
        />
      </Sidebar>
    );
  }
}
