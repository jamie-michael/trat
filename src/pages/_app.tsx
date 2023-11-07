import { type AppType } from "next/dist/shared/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import "~/styles/globals.css";
import React from 'react'

const MyApp: AppType = ({ Component, pageProps }) => {

  return (
    <ClerkProvider>
      <Component {...pageProps} />
    </ClerkProvider>
  )
  
  
  
};

export default MyApp;
