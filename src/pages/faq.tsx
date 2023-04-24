import styles from "~/styles/pages/index.module.css";
import { type NextPage } from "next";
import Link from "next/link";

// import { createContext } from 'server/context';
import { getLatestReport } from "~/server/prisma";
import { prisma } from "~/server/db";


import { api, } from "~/utils/api";
import { CustomPageProps } from "./_app";
import { useEffect, useState } from "react";
import type { WaitTimeReport, WaitTime } from "@prisma/client";
import Layout from "~/components/Layout";


interface WaitTimeReportWithWaitTimes extends WaitTimeReport {
  waitTimes: WaitTime[];
}

interface FaqPageProps extends CustomPageProps {

}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
// export async function getStaticProps() {

// }

const Home: NextPage<FaqPageProps> = ({ }) => {


  return (
    <Layout pageTitle="FAQ">
      <h2 className="text-2xl mb-10">FAQ</h2>
      <ul>
        <li>Question</li>
        <li>Question</li>
        <li>Question</li>
        <li>Question</li>
      </ul>
    </Layout>
  );
};

export default Home;
