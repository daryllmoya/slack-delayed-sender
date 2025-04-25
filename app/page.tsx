'use client';

import React from 'react';
import FormSlackDelayedSender from './components/FormSlackDelayedSender';

const Home = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6">
      <h1 className="text-2xl font-bold">Delayed Slack Message Sender</h1>
      <div className="space-y-4 w-full max-w-md">
        <FormSlackDelayedSender />
      </div>
    </main>
  );
};

export default Home;
