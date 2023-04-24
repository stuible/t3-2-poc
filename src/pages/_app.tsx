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

  return (
    <>
      <Component {...pageProps} />
    </>
  );
};


export default api.withTRPC(MyApp);
