import styles from "~/styles/pages/index.module.css";
import { type NextPage } from "next";
import Link from "next/link";

import { DocumentRenderer } from '@keystone-6/document-renderer';

// import { createContext } from 'server/context';
import { getLatestReport } from "~/server/prisma";
import { prisma } from "~/server/db";

import client from "~/gql/client";
import GetFAQ from '~/gql/queries/GetFAQ.gql'
import { Faq } from "~/gql/types";


import { api, } from "~/utils/api";
import { CustomPageProps } from "./_app";
import { useEffect, useState } from "react";
import type { WaitTimeReport, WaitTime } from "@prisma/client";
import Layout from "~/components/Layout";


interface WaitTimeReportWithWaitTimes extends WaitTimeReport {
  waitTimes: WaitTime[];
}

interface FaqPageProps extends CustomPageProps {
  FAQ: Faq
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export async function getStaticProps() {
  console.log('Genererating ServerSide Static Props for FAQ')

  const { data: { fAQ: FAQ } } = await client.query({
    query: GetFAQ,
  });


  return {
    props: {
      FAQ: FAQ
    }
  }
}

const Home: NextPage<FaqPageProps> = ({ FAQ }) => {


  return (
    <Layout pageTitle="FAQ">
      <h1 className="text-2xl mb-10">{FAQ.title}</h1>
      <article className="prose">
        {FAQ.faq ? <DocumentRenderer document={FAQ.faq.document} /> : false}
      </article>

    </Layout>
  );
};

export default Home;
