import { ClerkProvider } from "@clerk/nextjs";
import "~/styles/globals.css";
import React from 'react'

const MyApp = ({ Component, pageProps }) => {

  return (
    <ClerkProvider>
      <Component {...pageProps} />
    </ClerkProvider>
  )
  
  
  
};

export default MyApp;
