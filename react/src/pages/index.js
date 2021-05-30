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
//   return { props: { socketServerUrl: ('localhost:4000', {path: '/'})}};
 
 return { props: { socketServerUrl: ('http://cna-express.62623904ee0e4493aab1.eastus.aksapp.io:4000' , {path: 'express/socket.io'})} };
}
