import Head from "next/head";
import classNames from "classnames";

// local imports
import { Layout } from "../components";
import { useEventStream } from "../hooks";

export default function Home({ socketServerUrl }) {
  const { messages } = useEventStream(socketServerUrl);
  const messagesToDisplay =
    messages.length < 24 ? messages : messages.slice(0, 32);
  const lastUpdate =
    messagesToDisplay.length > 0
      ? new Date(messagesToDisplay[0].time)
      : new Date();
  return (
    <Layout>
      <Head>
        <title>Cloud Native App</title>
        <meta name="description" content="Cloud Native app - Client" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="m-5">
        <h1 className="mb-5">Fridge Controller</h1>
        <section>
          <h3 className="mt-5 mb-3">Activity</h3>
          <ul className="Messages flex-wrap unstyled">
            {messagesToDisplay.map((message, i) => (
              <li
                className={classNames("message", `level-${message.level}`)}
                key={i}
              >
                <span className="message--inner">{message.message}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <footer className="d-flex fixed-bottom m-5">
        <div className="Priority d-flex flex-grow-1">
          <h4 className="d-flex">Priority:</h4>
          <ul className="Priority--key d-flex flex-grow-1 unstyled">
            <li className="level-high">High</li>
            <li className="level-medium ">Medium</li>
            <li className="level-low">Low</li>
          </ul>
        </div>
        <div className="LastUpdateDate ">
          <h4>
            LastUpdate: {lastUpdate.toLocaleTimeString("en-US")}{" "}
            {lastUpdate.toLocaleDateString("en-US")}
          </h4>
        </div>
      </footer>
    </Layout>
  );
}
export async function getServerSideProps() {
  return { props: { socketServerUrl: process.env.SOCKET_SERVER_URL } };
}
