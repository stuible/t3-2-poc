import { type NextPage } from "next";

import Layout from "~/components/Layout";

import { Button, ActionButton } from "~/components/ui";



const Home: NextPage = ({ }) => {


  return (
    <Layout pageTitle="UI">
      <h1 className="text-2xl mb-10">UI Components</h1>

      <h2>Buttons</h2>
      <Button>Button</Button>
      <br />
      <ActionButton title="Action" />

    </Layout>
  );
};

export default Home;
