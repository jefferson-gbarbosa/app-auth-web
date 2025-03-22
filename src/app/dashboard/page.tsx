"use client";
import { api } from "@/api/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../components/button";
import { ScaleLoader } from "react-spinners";

interface ProfileData {
	name: string;
}

export default function DashboardPage() {
	const [profile, setProfile] = useState<ProfileData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	async function handleLogout() {
		setLoading(true);
		try {
			const res = await api.get("/logout");
			console.log(res.status);
			if (res.status === 200) {
				localStorage.removeItem("token");
				router.push("/");
			}
		} catch (err) {
			console.error("Logout error:", err);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const { data, status } = await api.get("/profile", {
					withCredentials: true,
				});
				if (status === 200) {
					const firstName = data.name.split(" ")[0];
					setProfile({ name: firstName });
				}
			} catch (err) {
				setError("Failed to load profile. Redirecting to login...");
				localStorage.removeItem("token");
				router.push("/");
			} finally {
				setLoading(false);
			}
		};

		fetchProfile();
	}, [router]);

	if (loading) {
		return (
			<div className="fixed top-0 left-0 right-0 bottom-0 bg-[#070707b6] flex justify-center items-center">
				<div className="flex justify-center items-center min-h-screen">
					<ScaleLoader color="#2B805A" width={20}/>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex justify-center items-center min-h-screen text-red-500">
				<p className="text-xl">{error}</p>
			</div>
		);
	}

	return (
		<div className="min-h-dvh flex justify-center items-center gap-10 ">
			<div className="flex flex-col items-center min-w-48 md:w-3/4 lg:w-5/12 bg-amber-50 rounded-lg p-8">
				<h3 className="text-2xl leading-none font-bold mb-6">
					{" "}
					Seja bem-vindo,{profile?.name}!
				</h3>
				<Button className="w-20 justify-center " type="submit" onClick={handleLogout}>
					Sair
				</Button>
			</div>
		</div>
	);
}
