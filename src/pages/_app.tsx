import { type AppType, type AppProps } from "next/app";
import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { useState } from "react";

export interface CustomPageProps {
  setMeta: Function
}

const MyApp: AppType = ({ Component, pageProps }) => {

  const [meta, setMeta] = useState<object>({});


  const handleOnMeta = (meta: { title: string }) => {
    console.log("Received custom info from page component:", meta);
    setMeta(meta);
  };

  return (
    <>
      <Head>
        <title>EDWT POC - {meta?.title}</title>
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
