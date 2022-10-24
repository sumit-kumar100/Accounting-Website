import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <meta
                    name="theme-color"
                    content="#111827"
                />
                <meta
                    name="description"
                    content="
                        Author:
                        Sumit,
                        Illustrator:
                        This Website Is For Managing Your Day-To-Day Business And Accounts Books.
                        Entry Book, Sale Book, Purchase Book, Sale Ledger, Purchase Ledger, Cash Book.
                        Business Profits and Losses...
                    "
                />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}