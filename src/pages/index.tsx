import styles from "~/styles/pages/index.module.css";
import { GetServerSidePropsContext, GetStaticPropsContext, type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { createProxySSGHelpers } from '@trpc/react-query/ssg';
// import { createContext } from 'server/context';
import { getLatestReport } from "~/server/prisma";
import { prisma } from "~/server/db";


import { api, } from "~/utils/api";
import { CustomPageProps } from "./_app";
import { useEffect, useState } from "react";
import type { WaitTimeReport, WaitTime } from "@prisma/client";


interface WaitTimeReportWithWaitTimes extends WaitTimeReport {
  waitTimes: WaitTime[];
}

interface HomePageProps extends CustomPageProps {
  initialLatestReport: string;
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export async function getStaticProps() {
  const latestReport = await getLatestReport({ prisma })

  console.log('------------')
  console.log(latestReport)

  return {
    props: {
      initialLatestReport: JSON.stringify(latestReport),
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10, // In seconds
  }
}

const Home: NextPage<HomePageProps> = ({ setMeta, initialLatestReport }) => {

  const [latestWaitTimesReport, setLatestWaitTimesReport] = useState<WaitTimeReportWithWaitTimes | undefined>(undefined);

  useEffect(() => {
    // Automatically pass info to parent when component mounts
    setMeta({
      title: 'Home'
    })

    setLatestWaitTimesReport(JSON.parse(initialLatestReport));
  }, []); // Empty dependency array to run the effect only once, on mount








  // setLatestCatFact(`Loading`)

  api.waitTimes.onReport.useSubscription(undefined, {
    onData(data) {
      console.log(data);
      setLatestWaitTimesReport(data as WaitTimeReportWithWaitTimes);
    },
    onError(error) {
      console.error("Error:", error);
    },
  });

  // const factQuery = api.catFact.fact.useQuery();
  // const initialFact = factQuery.data?.fact;



  return (
    <>
      <h2>Emergency Departments</h2>
      <p>Last Updated {latestWaitTimesReport?.createdAt?.toString()}</p>
      <ol className={styles.emergencyDepartmentList}>
        {latestWaitTimesReport?.waitTimes.map(waitTime => (
          <li key={waitTime.id} >
            <h3>{waitTime.emergencyDepartment}</h3>
            <p>Wait Time: {waitTime.waitTimeMinutes} minutes</p>
          </li>
        ))}
      </ol>
    </>
  );
};

export default Home;
