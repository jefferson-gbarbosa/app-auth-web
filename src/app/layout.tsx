import "./globals.css";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

import Favicon from "../assets/favicon.svg";
import "react-toastify/dist/ReactToastify.css";
import { Computer, Github, Linkedin } from "lucide-react";
import { ToastContainer } from "react-toastify";
import { Nav } from "./components/nav";

export const metadata: Metadata = {
	title: "Auth App",
	icons: [{ rel: "icon", url: Favicon.src }],
};

const montserrat = Montserrat({
	weight: ["400", "600"],
	subsets: ["latin"],
	variable: "--font-montserrat",
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt" className={`${montserrat.variable}`}>
			<body className="bg-[url(/background.png)] bg-cover md:bg-right-top bg-top">
			  <header className="mx-auto px-10 py-4 md:py-3.5 ">
          <Nav />
        </header>
				<main className="max-w-[1240px] mx-auto px-5 py-8 md:py-0">
					{children}
				</main>
				<ToastContainer />
			</body>
		</html>
	);
}
