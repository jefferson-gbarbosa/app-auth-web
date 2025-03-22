"use client";
import { api } from "@/api/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../components/button";

const otpSchema = z.object({
	otp: z
		.string()
		.min(6, "OTP must be 6 digits")
		.length(6, "OTP must be 6 digits")
		.regex(/^\d{6}$/, "OTP must contain only numbers"),
});

type OtpSchema = z.infer<typeof otpSchema>;

export default function OtpVerificationPage() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<OtpSchema>({
		resolver: zodResolver(otpSchema),
	});

	async function onOtp(data: OtpSchema) {
		const otpvalue = { code: data.otp };
		setLoading(true);
		setError(null);
		try {
			const res = await api.post("/verify-email", otpvalue);
			if (res.status === 200) {
				localStorage.setItem("token", res.data.token);
				router.push("/dashboard");
			}
		} catch (err) {
			if (err instanceof AxiosError) {
				const message =
					err.response?.data?.message ||
					"Erro no servidor. Tente novamente mais tarde.";
				setError(message);
			}
		}
	}

	return (
		<div className="min-h-dvh flex justify-center flex-col items-center gap-10">
			<form
				onSubmit={handleSubmit(onOtp)}
				className="w-full bg-white rounded-2xl p-8 space-y-6 md:max-w-[440px]"
			>
				<h2 className="font-bold text-[#216340] text-2xl text-center mb-0.5">
					Verifique seu E-mail
				</h2>
				<p className="text-sm sm:text-base text-center text-[#11181C]]">
					Digite o código de 6 dígitos enviado para seu endereço de e-mail.
				</p>
				<div className="flex justify-between mb-3 sm:mb-4 md:mb-6">
					<input
						{...register("otp")}
						type="text"
						maxLength={6}
						className="w-full h-12 text-center text-[#687076] text-2xl font-bold  border-2 border-gray-600 rounded-lg focus:border-[#2B805A] focus:outline-none"
					/>
				</div>
				{errors.otp && (
					<span className="text-red-600 mb-2 block">{errors.otp.message}</span>
				)}
				<Button type="submit" className="justify-center font-bold">
					{loading ? " Verify..." : " Verify Now"}
				</Button>
				{error && (
					<p className="text-danger text-center font-semibold text-xl">
						{error}
					</p>
				)}
			</form>
		</div>
	);
}
