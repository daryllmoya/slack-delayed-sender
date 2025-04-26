'use client';

import React from 'react';
import FormDelayedSender from './components/FormDelayedSender';

const Home = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6">
      <h1 className="text-2xl font-bold">Delayed Message Sender</h1>
      <div className="space-y-4 w-full max-w-md">
        <FormDelayedSender />
      </div>
    </main>
  );
};

export default Home;
