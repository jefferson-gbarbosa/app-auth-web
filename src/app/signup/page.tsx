"use client";
import { api } from "@/api/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Eye, EyeOff, LockKeyhole, Mail, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import logo from "../../assets/logo.svg";
import { Button } from "../components/button";
import { InputField, InputIcon, InputRoot } from "../components/input";

const signupSchema = z.object({
	name: z.string().min(1, "This is required"),
	email: z.string().min(1, "This is required ").email("Must be a valid email"),
	password: z
		.string()
		.min(6, "Password must be at least 6 characters long")
		.max(32, "Password must be at most 32 characters long")
		.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
		.regex(/[a-z]/, "Password must contain at least one lowercase letter")
		.regex(/[0-9]/, "Password must contain at least one number")
		.regex(/[\W_]/, "Password must contain at least one special character"),
});

type SignupSchema = z.infer<typeof signupSchema>;

export default function InscriptionForm() {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignupSchema>({
		resolver: zodResolver(signupSchema),
	});

	const togglePasswordVisibility = () => {
		setShowPassword((prev) => !prev);
	};

	async function onSignup(data: SignupSchema) {
		setLoading(true);
		setError(null);
		try {
			const res = await api.post("/signup", data);
			if (res.status === 200) {
				localStorage.setItem("token", res.data.token);
				router.push("/otp");
			}
		} catch (err) {
			if (err instanceof AxiosError) {
				const message =
					err.response?.data?.message ||
					"Erro no servidor. Tente novamente mais tarde.";
				setError(message);
			} else {
				setError("Erro no servidor. Tente novamente.");
			}
		} finally {
			setLoading(false);
		}
	}
	return (
		<div className="min-h-dvh flex justify-center flex-col items-center gap-10">
			<Image src={logo} alt="auth signup" />
			<form
				onSubmit={handleSubmit(onSignup)}
				className="w-full bg-white rounded-2xl p-8 space-y-6 md:max-w-[440px]"
			>
				<h2 className="font-bold text-[#216340] text-2xl text-center mb-0.5">
					Crie sua conta grátis
				</h2>
				<p className="text-sm sm:text-base text-center text-[#11181C]]">
					Preencha seus dados
				</p>

				<div className="space-y-3">
					<div className="space-y-2">
						<InputRoot>
							<InputIcon>
								<User className="size-6" />
							</InputIcon>
							<InputField
								type="text"
								placeholder="Nome completo"
								{...register("name")}
							/>
						</InputRoot>

						{errors?.name && (
							<p className="text-danger font-semibold text-xs">
								{errors.name.message}
							</p>
						)}
					</div>

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
					<div className="space-y-2">
						<InputRoot>
							<InputIcon>
								<LockKeyhole className="size-6" />
							</InputIcon>
							<InputField
								type={showPassword ? "text" : "password"}
								placeholder="Senha"
								{...register("password")}
							/>
							<button
								type="submit"
								onClick={togglePasswordVisibility}
								className="outline-0 cursor-pointer"
							>
								{showPassword ? (
									<Eye
										size={20}
										className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500"
									/>
								) : (
									<EyeOff size={20} className="text-gray-500" />
								)}
							</button>
						</InputRoot>

						{errors?.password && (
							<p className="text-danger font-semibold text-xs">
								{errors.password.message}
							</p>
						)}
					</div>
				</div>

				<Button
					type="submit"
					className="justify-center font-bold"
					disabled={loading}
				>
					{loading ? " Signup Now in..." : " Signup Now"}
				</Button>
				{error && (
					<p className="text-danger text-center font-semibold text-base">
						{error}
					</p>
				)}

				<div className="text-center text-sm">
					Already have an account?{" "}
					<Link
						href="/"
						className="text-[#11181C] cursor-pointer hover:underline hover:text-[#687076]"
					>
						Entrar
					</Link>
				</div>
			</form>
		</div>
	);
}
