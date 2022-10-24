const Dashboard = () => {
  return (<></>)
}
export default Dashboard

export async function getServerSideProps(context) {
  return {
    redirect: {
      destination: '/entry-book',
      statusCode: 302
    }
  }
}