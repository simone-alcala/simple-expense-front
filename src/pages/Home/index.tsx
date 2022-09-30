import React from 'react';

import Layout from '../../components/Layout';
import Header from '../../components/Header';
import Main from '../../components/Main';
import Footer from '../../components/Footer';

function Home() {
  return (
    <Layout>
      <Header/>
      <Main />
      <Footer/>
    </Layout>    
  );
}

export default Home;