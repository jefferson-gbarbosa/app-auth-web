"use client";
import { api } from "@/api/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../components/button";
import { InputField, InputIcon, InputRoot } from "../../components/input";

const resetPasswordSchema = z
	.object({
		password: z
			.string()
			.min(6, "Password must be at least 6 characters long")
			.max(32, "Password must be at most 32 characters long")
			.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
			.regex(/[a-z]/, "Password must contain at least one lowercase letter")
			.regex(/[0-9]/, "Password must contain at least one number")
			.regex(/[\W_]/, "Password must contain at least one special character")
			.nonempty("Password is required"), // Garantir que a senha não pode estar vazia
		confirmPassword: z.string().nonempty("Confirm Password is required"), // Garantir que a confirmação de senha não pode estar vazia
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
	const router = useRouter();
	const { token } = useParams();
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ResetPasswordSchema>({
		resolver: zodResolver(resetPasswordSchema),
	});
	const togglePasswordVisibility = () => {
		setShowPassword((prev) => !prev);
	};
	const toggleConfirmePasswordVisibility = () => {
		setShowConfirmPassword((prev) => !prev);
	};

	async function onReset(data: ResetPasswordSchema) {
		setError(null);

		try {
			const res = await api.post(`/reset-password/${token}`, data);
			console.log(res);
			if (res.status === 200) {
				localStorage.setItem("token", res.data.token);
				router.push("/");
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
		<div className="min-h-dvh flex justify-center flex-col items-center gap-10">
			<form
				onSubmit={handleSubmit(onReset)}
				className="w-full bg-white rounded-2xl p-8 space-y-6 md:max-w-[440px]"
			>
				<h2 className="font-bold text-[#216340] text-2xl text-center mb-0.5">
					Reset Password
				</h2>
				<p className="text-sm sm:text-base text-center text-[#11181C]]">
					Enter a new password for noreply@shopify.com
				</p>

				<div className="space-y-3">
					<div className="space-y-2">
						<InputRoot>
							<InputIcon>
								<LockKeyhole className="size-6" />
							</InputIcon>
							<InputField
								type={showPassword ? "text" : "password"}
								placeholder="Enter your new password"
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
						<InputRoot>
							<InputIcon>
								<LockKeyhole className="size-6" />
							</InputIcon>
							<InputField
								type={showConfirmPassword ? "text" : "password"}
								placeholder="Confirm your new password"
								{...register("confirmPassword")}
							/>
							<button
								type="submit"
								onClick={toggleConfirmePasswordVisibility}
								className="outline-0 cursor-pointer"
							>
								{showConfirmPassword ? (
									<Eye
										size={20}
										className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500"
									/>
								) : (
									<EyeOff size={20} className="text-gray-500" />
								)}
							</button>
						</InputRoot>

						{errors?.confirmPassword && (
							<p className="text-danger font-semibold text-xs">
								{errors.confirmPassword.message}
							</p>
						)}
					</div>
				</div>

				<Button
					type="submit"
					className="justify-center font-bold"
					disabled={loading}
				>
					{loading ? "Resetting..." : "Set New Password"}
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
