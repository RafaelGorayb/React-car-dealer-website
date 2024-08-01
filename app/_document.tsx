// pages/_document.tsx

import Document, { Html, Head, Main, NextScript, DocumentContext } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="pt">
        <Head>
          {/* Meta tags para customizar a cor das barras de navegação */}
          <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
          <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000000" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <body className="overflow-x-hidden bg-red">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
