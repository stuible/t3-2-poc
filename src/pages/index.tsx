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

interface HomePageProps extends CustomPageProps {
  initialLatestReport: WaitTimeReportWithWaitTimes;
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export async function getStaticProps() {
  const latestReport = await getLatestReport({ prisma })

  console.log('Genererating ServerSide Static Props')

  return {
    props: {
      initialLatestReport: JSON.parse(JSON.stringify(latestReport)),
    },
    // revalidate: 30, // In seconds
  }
}

const Home: NextPage<HomePageProps> = ({ initialLatestReport }) => {

  const [latestWaitTimesReport, setLatestWaitTimesReport] = useState<WaitTimeReportWithWaitTimes | undefined>(initialLatestReport);

  useEffect(() => {
    // Automatically pass info to parent when component mounts

  }, []); // Empty dependency array to run the effect only once, on mount



  api.waitTimes.onReport.useSubscription(undefined, {
    onData(data) {
      // console.log(data);
      setLatestWaitTimesReport(data as WaitTimeReportWithWaitTimes);
    },
    onError(error) {
      console.error("Error:", error);
    },
  });



  return (
    <Layout pageTitle="Home">
      <h2 className="text-2xl">Emergency Departments</h2>
      <p className="mb-10 text-sm text-gray-400">Last Updated {latestWaitTimesReport?.createdAt?.toString()}</p>
      <ol className="flex flex-col space-y-4">
        {latestWaitTimesReport?.waitTimes.map(waitTime => (
          <li key={waitTime.id} >
            <h3 className="text-xl">{waitTime.emergencyDepartment}</h3>
            <p>Wait Time: {waitTime.waitTimeMinutes} minutes</p>
          </li>
        ))}
      </ol>
    </Layout>
  );
};

export default Home;
