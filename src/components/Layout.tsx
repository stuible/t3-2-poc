import React, { ReactNode } from 'react';
import Head from 'next/head';

const Layout = ({ children, pageTitle }: { children: ReactNode, pageTitle?: string }) => {

    const title = pageTitle ? `EDWT - ${pageTitle}` : 'EDWT'

    return (
        <div>
            <Head>
                <title>{title}</title>
                <meta name="description" content="EDWT" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <header className="main-container py-10">
                <h1 className="text-2xl">
                    EDWT POC 002
                </h1>
            </header>
            {/* other layout components */}
            <main className="main-container">
                {children}
            </main>
        </div>
    );
};

export default Layout;