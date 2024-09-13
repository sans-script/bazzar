import "./globals.css";

export const metadata = {
  title: "Bazzar - Just for you",
  description:
    "Welcome to Bazzar, where shopping meets sophistication. Our online store is designed to bring you a curated selection of products that cater to your unique taste and style. From trendy fashion pieces to cutting-edge gadgets, we offer a diverse range of high-quality items to enhance your lifestyle.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
