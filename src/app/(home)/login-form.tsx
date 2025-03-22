"use client";
import { api } from "@/api/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../components/button";
import { InputField, InputIcon, InputRoot } from "../components/input";

const loginSchema = z.object({
	email: z.string().min(1, "This is required").email("Must be a valid email"),
	password: z.string().min(1, "This is required").min(6, "Too short"),
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function LoginPage() {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginSchema>({
		resolver: zodResolver(loginSchema),
	});

	const togglePasswordVisibility = () => {
		setShowPassword((prev) => !prev);
	};

	async function onLogin(data: LoginSchema) {
		setLoading(true);
		setError(null);
		try {
			const res = await api.post("/login", data);
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
		} finally {
			setLoading(false);
		}
	}
	return (
		<form
			onSubmit={handleSubmit(onLogin)}
			className="w-full bg-white rounded-2xl p-8 space-y-6 md:max-w-[440px]"
		>
			<h2 className="font-bold text-[#216340] text-2xl text-center mb-0.5">
				Já tem cadastro?
			</h2>
			<p className="text-sm sm:text-base text-center text-[#11181C]">
				Faça seu login
			</p>

			<div className="space-y-3">
				<div className="space-y-2">
					<InputRoot error={!!errors?.email}>
						<InputIcon>
							<Mail className="size-6" />
						</InputIcon>
						<InputField
							type="text"
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
					<InputRoot error={!!errors?.password}>
						<InputIcon>
							<LockKeyhole className="size-6" />
						</InputIcon>
						<InputField
							type={showPassword ? "text" : "password"}
							placeholder="Senha"
							{...register("password")}
						/>
						<button
							type="button"
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
				<div className="space-y-2">
					<Link
						href="/forgot-password"
						className="pl-1 text-sm text-[#1D1D1D] cursor-pointer hover:underline hover:text-[#687076]"
					>
						Forgot your password?
					</Link>
				</div>
			</div>

			<Button type="submit" disabled={loading}>
				{loading ? "Logging in..." : "Login Now"}
				<ArrowRight className="size-6" />
			</Button>
			{error && (
				<p className="text-danger text-center font-semibold text-base">
					{error}
				</p>
			)}
		</form>
	);
}
