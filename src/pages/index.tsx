import styles from "~/styles/pages/index.module.css";
import { type NextPage } from "next";
import Link from "next/link";

import { env } from "~/env";

// import { createContext } from 'server/context';
import { getLatestWaitTimes } from "~/server/prisma";
import { prisma } from "~/server/db";


import client from "~/gql/client";
import GetEmergencyDepartments from '~/gql/queries/GetEmergencyDepartments.gql'

import { FaMap, FaPhone, FaInfoCircle, FaCompass } from "react-icons/fa";


//Maps
import Map, { Marker, GeolocateControl } from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';



import { api, } from "~/utils/api";
import { CustomPageProps } from "./_app";
import { useEffect, useState } from "react";
import type { WaitTimeReport, WaitTime } from "@prisma/client";
import Layout from "~/components/Layout";
import { EmergencyDepartment, Maybe } from "~/gql/types";

import { ActionButton } from "~/components/ui"

interface WaitTimeReportWithWaitTimes extends WaitTimeReport {
  waitTimes: WaitTime[];
}

interface HomePageProps extends CustomPageProps {
  initialLatestWaitTimes: WaitTime[];
  emergencyDepartments: EmergencyDepartment[]
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export async function getStaticProps() {
  console.log('Genererating ServerSide Static Props for Homepage')

  // Get all emergency departments from CMS
  const { data: { emergencyDepartments } }: { data: { emergencyDepartments: EmergencyDepartment[] } } = await client.query({
    query: GetEmergencyDepartments,
  });

  // console.log(emergencyDepartments)

  // Request the latest wait times for each Emergency Department in the CMS
  const latestWaitTimes = await getLatestWaitTimes({
    prisma,
    emergencyDepartmentSlugs: emergencyDepartments.map(x => x.slug).filter((x: Maybe<string> | undefined): x is string => {
      return !!x
    })
  })


  // console.log(latestWaitTimes)


  return {
    props: {
      initialLatestWaitTimes: JSON.parse(JSON.stringify(latestWaitTimes)),
      emergencyDepartments
    },
    // revalidate: 30, // In seconds
  }
}

const Home: NextPage<HomePageProps> = ({ initialLatestWaitTimes, emergencyDepartments }) => {

  const [latestWaitTimes, setLatestWaitTimes] = useState<WaitTime[] | undefined>(initialLatestWaitTimes);

  useEffect(() => {
    // Automatically pass info to parent when component mounts

  }, []); // Empty dependency array to run the effect only once, on mount



  api.waitTimes.onReport.useSubscription(undefined, {
    // When a new WaitTimeReport comes in from the server, update our wait times
    onData(data) {
      // Type it correctly
      const waitTimeReport = data as WaitTimeReportWithWaitTimes;

      // Setup variables for new wait times and old ones, to make things clear
      const newWaitTimes = waitTimeReport.waitTimes;
      const oldWaitTimes = latestWaitTimes;

      // For each emergency department, check to see if there is a new WaitTime for it
      // If there is use that new WaitTime, if not, return the previous WaitTime
      const mergedWaitTimes: WaitTime[] = emergencyDepartments.map(ed => {
        const EDNewWaitTime = newWaitTimes.find(x => x.emergencyDepartment == ed.slug)
        return EDNewWaitTime ?? oldWaitTimes?.find(x => x.emergencyDepartment == ed.slug)
      })
        // Filter out any emergency departments with no WaitTime
        .filter((x: WaitTime | undefined): x is WaitTime => {
          return !!x
        });

      // console.log(data);
      setLatestWaitTimes(mergedWaitTimes);
    },
    onError(error) {
      console.error("Error:", error);
    },
  });

  function getWaitTime(emergencyDepartmentSlug: string | undefined) {
    // console.log(emergencyDepartmentSlug)
    // console.log(latestWaitTimes)
    return latestWaitTimes?.find(x => x.emergencyDepartment === emergencyDepartmentSlug)
  }



  return (
    <Layout pageTitle="Home">
      <h2 className="text-2xl mb-10">Emergency Departments</h2>

      <div className="md:flex gap-10">
        {/* Emergency Departments */}
        <ol className="flex flex-col space-y-8 max-w-md">
          {emergencyDepartments.map(emergencyDepartment => (
            <li key={emergencyDepartment.id} >
              <h3 className="text-xl">{emergencyDepartment.name}</h3>
              <p className="text-sm text-gray mb-1">Last Updated {getWaitTime(emergencyDepartment.slug ?? undefined)?.createdAt?.toString()}</p>
              <p className="font-bold mb-2">Wait Time: {getWaitTime(emergencyDepartment.slug ?? undefined)?.waitTimeMinutes} minutes</p>
              <div className="grid grid-cols-4 gap-2">
                <ActionButton title="Directions" icon={<FaMap />} />
                <ActionButton title="Call" icon={<FaPhone />} />
                <ActionButton title="Website" icon={<FaCompass />} href={emergencyDepartment.website ?? undefined} target="_blank" />
                <ActionButton title="More Info" icon={<FaInfoCircle />} href="/faq" />
              </div>
            </li>
          ))}
        </ol>
        {/* Map */}
        <div className="flex-grow">
          <Map mapLib={maplibregl}
            initialViewState={{
              longitude: -123.11691284179689,
              latitude: 49.27947621362341,
              zoom: 12,
            }}
            style={{}}
            mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${env.NEXT_PUBLIC_MAP_API}`}
          >
            {emergencyDepartments.filter(ed => ed.coordinates && ed.coordinates.long && ed.coordinates.lat).map(ed => (
              <Marker key={ed.id} onClick={() => console.log(`clicked: ${ed.name}`)} longitude={ed.coordinates.long} latitude={ed.coordinates.lat} anchor="center" color="#00FF00" ></Marker>
            ))}

            <GeolocateControl />
          </Map>
        </div>
      </div>


    </Layout>
  );
};

export default Home;
