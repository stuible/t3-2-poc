import React, { ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const Layout = ({ children, pageTitle }: { children: ReactNode, pageTitle?: string }) => {

    const title = pageTitle ? `${pageTitle} - EDWT` : 'EDWT'

    return (
        <div>
            <Head>
                <title>{title}</title>
                <meta name="description" content="EDWT" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <header className="main-container py-10">
                <h1 className="text-5xl">
                    EDWT POC 002
                </h1>
                <nav>
                    <Link href="/">Home</Link> |
                    <Link href="/faq"> FAQ</Link> |
                    <Link href="/ui"> UI</Link>
                </nav>
            </header>
            {/* other layout components */}
            <main className="main-container">
                {children}
            </main>
        </div>
    );
};

export default Layout;