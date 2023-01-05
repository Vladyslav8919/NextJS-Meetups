import { Fragment } from "react";
import Head from "next/head";
import { MongoClient } from "mongodb";

import MeetupList from "../components/meetups/MeetupList";

function HomePage(props) {
  return;
  <Fragment>
    <Head>
      <title>React Meetups</title>
      <meta
        name="description"
        content="Browse a huge list of highly active React meetups!"
      />
    </Head>
    <MeetupList meetups={props.meetups} />
  </Fragment>;
}

// // --------- getServerSideProps() ---------
// // will run always on the server after deployment, never on the client
// // operations that shouldn't be exposed to users could be run here
// // runs for any incoming request
// export async function getServerSideProps(context) {
//   const req = context.req;
//   const res = context.res;
//   // fetch data from an API
//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// }

// ----------- getStaticProps() -----------

// works only in components inside the pages folder
// if Next.js finds this fn, it will execute this fn during the pre-rendering process before it executes the component fn
// it's job, as its name says, is to prepare props for the page
// it's allowed to be async - NextJS will wait for this promise to resolve and then returns props for this component fn
// With that you are able to load data before the component fn is executed
export async function getStaticProps() {
  const client = await MongoClient.connect(
    "mongodb+srv://new_user1:86TtDlgsL9Wi2Gms@cluster0.nchw1k5.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },

    // when we add this property to the object returned by getStaticProps(), we unlock a feature called incremental static generation

    // it wants a number, and this number is a number of seconds NextJS will wait untill it regenerates this page for an incoming request
    revalidate: 3600,
    // so with revalidate the page will be regenerated on the server at least every 10s if there are requests coming in for this page. And this regenarates pages will replace old regenerated pages. With that you will ensure that your data is never older than 10s

    // this way you don't have to rebuild and redeploy everytime when some data changes
  };
}

export default HomePage;
