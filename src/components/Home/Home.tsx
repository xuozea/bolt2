import React from 'react';
import Hero from './Hero';
import Stats from './Stats';
import HowItWorks from './HowItWorks';

const Home: React.FC = () => {
  return (
    <div>
      <Hero />
      <Stats />
      <HowItWorks />
    </div>
  );
};

export default Home;