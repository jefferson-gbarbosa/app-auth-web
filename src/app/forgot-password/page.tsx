"use client";
import { api } from "@/api/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Mail } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { DotLoader } from "react-spinners";
import { toast } from "react-toastify";
import { z } from "zod";
import logo from "../../assets/logo.svg";
import { Button } from "../components/button";
import { InputField, InputIcon, InputRoot } from "../components/input";

const emailSchema = z.object({
	email: z.string().min(1, "This is required").email("Must be a valid email"),
});

type EmailSchema = z.infer<typeof emailSchema>;

export default function ForgotPasswoardPage() {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [email, setEmail] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<EmailSchema>({
		resolver: zodResolver(emailSchema),
	});

	async function onForgotPassword(data: EmailSchema) {
		setError(null);
		setEmail(data.email);

		try {
			const res = await api.post("/forgot-password", data);
			if (res.status === 200) {
				toast.success("Link de recuperação!", {
					position: "top-center",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "light",
				});
				router.push("/");
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
			<Image src={logo} alt="auth signup" />
			<form
				onSubmit={handleSubmit(onForgotPassword)}
				className="w-full bg-white rounded-2xl p-8 space-y-6 md:max-w-[440px]"
			>
				<p className="text-base mb-4 text-[#687076] text-center">
					Enter your email address and we'll send you a link to reset your
					password.
				</p>

				<div className="space-y-3">
					<div className="space-y-2">
						<InputRoot>
							<InputIcon>
								<Mail className="size-6" />
							</InputIcon>
							<InputField
								type="email"
								placeholder="E-mail"
								{...register("email")}
							/>
						</InputRoot>

						{errors?.email && (
							<p className="text-danger font-semibold text-xs">
								{errors.email.message}
							</p>
						)}
					</div>
				</div>

				<Button type="submit" className="justify-center font-bold">
					Send Reset E-mail
				</Button>
			</form>
			{error && (
				<p className="text-danger text-center font-semibold text-xl">{error}</p>
			)}
		</div>
	);
}
