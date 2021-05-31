import Head from "next/head";

import { useEventStream } from "../hooks";

export default function Home({ socketServerUrl }) {
  const { messages } = useEventStream(socketServerUrl);
  return (
    <div>
      <Head>
        <title>Cloud Native App</title>
        <meta name="description" content="Cloud Native app - Client" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {messages.map((message, i) => (
        <li key={i}>{message.message}</li>
      ))}
    </div>
  );
}
export async function getServerSideProps() {
  return { props: { socketServerUrl: process.env.SOCKET_SERVER_URL } };
}
