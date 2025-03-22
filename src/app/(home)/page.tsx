import Image from "next/image";
import Link from "next/link";
import logo from "../../assets/logo.svg";
import LoginPage from "./login-form";

export default function Home() {
	return (
		<div className="min-h-dvh flex flex-col justify-center gap-10">
			<div className="flex gap-5 items-stretch flex-col md:flex-row">
				<div className="flex-1 p-8 space-y-6">
					<div className="max-w-2xl md:w-full">
						<Image src={logo} alt="auth" className="m-auto md:m-0 md:mb-8" />
						<h1 className="text-white text-4xl text-center leading-none font-bold flex flex-col md:text-5xl md:text-left mb-4">
							Tenha acesso a diversas oportunidades para desenvolvedores.
						</h1>
						<p className="text-white leading-relaxed text-sm md:text-base mb-4 md:mb-6">
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam,
							voluptatum voluptatibus ut sunt beatae ducimus quibusdam odio
							dicta incidunt nostrum cupiditate vero ad distinctio atque quia
							illo saepe, consequatur labore?
						</p>
					</div>
				</div>

				<LoginPage />
			</div>

			<div className="md:pl-8">
				<Link
					href="/signup"
					className="inline-block font-bold
						text-base md:text-lg px-6 py-3 text-white bg-[#2B805A] 
						hover:bg-[#216340] transition duration-300 rounded-lg border border-white
						hover:border-[#6EE7B7] focus:outline-none focus:ring-2 focus:ring-[#6EE7B7] w-full md:w-auto"
				>
					FAÇA SEU CADASTRO
				</Link>
			</div>
		</div>
	);
}
