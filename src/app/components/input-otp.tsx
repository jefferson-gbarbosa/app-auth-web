"use client";
import React, { forwardRef, type ComponentProps } from "react";

interface InputOtpProps extends ComponentProps<"input"> {
	error?: boolean;
}

export const InputOtp = forwardRef<HTMLInputElement, InputOtpProps>(
	({ error, ...props }, ref) => {
		return (
			<input
				ref={ref}
				{...props}
				className={`w-12 h-12 text-center text-2xl font-bold border-2 rounded-lg focus:border-green-500 focus:outline-none ${
					error ? "border-red-500" : "border-gray-300"
				}`}
			/>
		);
	},
);

InputOtp.displayName = "InputOtp";
