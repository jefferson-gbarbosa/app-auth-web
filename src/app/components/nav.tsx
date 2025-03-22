import { Computer, Linkedin } from "lucide-react";
import Link from "next/link";

export function Nav() {
	return (
		<nav className="flex items-center justify-center md:justify-end gap-4">
			<Link
				href="https://www.linkedin.com/in/jefferson-gbarbosa/"
				className="text-white transition-colors duration-300 hover:text-[#11181C]"
			>
				<Linkedin />
			</Link>
			<Link href="https://github.com/jefferson-gbarbosa" className="text-white transition-colors duration-300 hover:text-[#11181C]">
				<Computer />
			</Link>
		</nav>
	);
}
