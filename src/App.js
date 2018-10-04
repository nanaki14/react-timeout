import "@babel/polyfill";
import React from "react";
import { createResource, createCache } from "simple-cache-provider";

// cast any for typescript
const Timeout = React.Timeout;
const AsyncMode = React.unstable_AsyncMode;

const cache = createCache();
const hn = createResource(async (id) => {
  const url = `https://hacker-news.firebaseio.com/v0/item/${id}.json`;
  const res = await fetch(url);
  console.log(url)
  await new Promise(resolve => setTimeout(resolve, 2000));
  return res.json();
});

const HNStory = (props) => {
  const data = hn.read(cache, props.id);
  return (
    <p>
      {data.title}: {data.url}
    </p>
  );
};

class App extends React.PureComponent {
  render() {
    return (
      <AsyncMode>
        <div>
          <h1>Try suspense</h1>
          <button
            onClick={() => {
              this.forceUpdate();
            }}
          >
            reload
          </button>
          <hr />
          <Timeout ms={200}>
            {(didTimeout) => {
              if (didTimeout) {
                return <span>The content is still loading :(</span>;
              }
              return <HNStory id={8863} />;
            }}
          </Timeout>
        </div>
      </AsyncMode>
    );
  }
}

export default App
