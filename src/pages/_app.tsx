import { type AppType, type AppProps } from "next/app";
import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { useState } from "react";

export interface Meta {
  title: string
}

type SetMeta = (meta: Meta) => void;

export interface CustomPageProps {
  setMeta: SetMeta
}


const MyApp: AppType = ({ Component, pageProps }) => {

  const [meta, setMeta] = useState<Meta | null>(null);


  const handleOnMeta = (meta: Meta) => {
    console.log("Received custom info from page component:", meta);
    setMeta(meta);
  };

  return (
    <>
      <Head>
        <title>EDWT POC</title>
        <meta name="description" content="EDWT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <h1>
          EDWT POC 002
        </h1>
      </header>
      <main className="container">
        <Component {...pageProps} setMeta={handleOnMeta} />
      </main>
    </>
  );
};


export default api.withTRPC(MyApp);
