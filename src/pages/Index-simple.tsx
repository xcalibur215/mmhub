import React from 'react';

const Index = () => {
  console.log('Index page rendering...');
  
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-4xl font-bold text-foreground">Home Page</h1>
      <p className="text-muted-foreground mt-4">
        This is a simplified version of the home page to test if the routing works.
      </p>
      <div className="mt-8">
        <a href="/listings" className="text-blue-600 hover:underline">
          Go to Listings
        </a>
      </div>
    </div>
  );
};

export default Index;