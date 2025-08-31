import { materialRenderers } from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import GoogleButton from "react-google-button";

import loginSchema from "../../schema/loginFormSchema.json";
import loginUiSchema from "../../schema/loginUiSchema.json";
import staticText from "../../text/staticText.json";
import colorSchemeJson from "../../theme/whyUsColorScheme.json";

interface ColorScheme {
	backgroundGradientFrom: string;
	backgroundGradientTo: string;
	topBar: string;
	title: string;
	cardBg: string;
	cardTitle: string;
	cardText: string;
	cardShadow: string;
	contactBg: string;
	contactTitle: string;
	contactTitleDark: string;
	contactText: string;
	deleteButton: string;
	textline: string;
	primaryHover: string;
	primary: string;
	cardTop: string;
	textMain: string;
	cardBody: string;
	link: string;
}

const colorScheme = colorSchemeJson as ColorScheme;

type LoginFormData = {
	email: string;
	password: string;
};

export const Route = createFileRoute("/login/")({
	component: LoginPage,
});

export default function LoginPage() {
	const [formData, setFormData] = useState<LoginFormData>({
		email: "",
		password: "",
	});
	const [submitted, setSubmitted] = useState(false);
	const [touched, setTouched] = useState<{ email: boolean; password: boolean }>(
		{
			email: false,
			password: false,
		},
	);

	const handleInputChange = (data: LoginFormData) => {
		setFormData(data);
	};

	const handleInputBlur = (field: keyof LoginFormData) => {
		setTouched((prev) => ({ ...prev, [field]: true }));
	};

	const handleSubmit = () => {
		const { email, password } = formData;
		if (email === "admin@example.com" && password === "admin123") {
			alert("Login successful!");
		} else {
			alert("Invalid credentials");
		}
		setSubmitted(true);
	};

	const showPasswordError =
		touched.password &&
		formData.password.length > 0 &&
		formData.password.length < 6;

	const handleButtonHover = (
		e:
			| React.MouseEvent<HTMLButtonElement>
			| React.FocusEvent<HTMLButtonElement>,
	) => {
		e.currentTarget.style.background = colorScheme.contactTitleDark;
	};

	const handleButtonOut = (
		e:
			| React.MouseEvent<HTMLButtonElement>
			| React.FocusEvent<HTMLButtonElement>,
	) => {
		e.currentTarget.style.background = colorScheme.contactTitle;
	};

	const handleGoogleSignIn = () => {
		window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_GOOGLE_CLIENT_ID&redirect_uri=${encodeURIComponent(
			`${window.location.origin}/auth/google/callback`,
		)}&response_type=token&scope=profile email`;
	};

	return (
		<div
			className="min-h-screen flex flex-col items-center justify-center"
			style={{
				background: `linear-gradient(120deg, ${colorScheme.backgroundGradientFrom}, ${colorScheme.backgroundGradientTo})`, // Use gradient from whyUsColorScheme.json
			}}
		>
			{/* Top Bar */}
			<div
				className="w-full flex items-center px-8 py-3"
				style={{ background: "#5A4E4E", minHeight: 60 }}
			>
				<span className="text-white text-lg font-bold">Logo</span>
			</div>

			<div className="flex-1 flex items-center justify-center w-full">
				<div
					className="w-full bg-white rounded shadow-lg flex flex-col justify-center items-center"
					style={{ maxWidth: 420, minHeight: 520, aspectRatio: "3/4" }}
				>
					{/* Card Header */}
					<div
						className="w-full text-center py-6 px-8 rounded-t"
						style={{ background: colorScheme.cardTop }}
					>
						<h2
							className="text-3xl font-bold mb-2"
							style={{ color: colorScheme.textMain }}
						>
							{staticText.loginTitle}
						</h2>
						<p className="text-base" style={{ color: colorScheme.textMain }}>
							{staticText.loginDescription}
						</p>
					</div>

					{/* Card Body */}
					<div
						className="w-full px-8 py-8 rounded-b flex-1 flex flex-col justify-center mt-12"
						style={{
							background: colorScheme.cardBody,
							gap: 0,
							paddingTop: 0,
							marginTop: 48,
						}}
					>
						<JsonForms
							schema={loginSchema}
							uischema={loginUiSchema}
							data={formData}
							renderers={materialRenderers}
							onChange={({ data }) => handleInputChange(data)}
						/>
						<input
							type="password"
							value={formData.password}
							onBlur={() => handleInputBlur("password")}
							onChange={(e) =>
								handleInputChange({ ...formData, password: e.target.value })
							}
							placeholder="Password"
							className="hidden"
						/>
						{showPasswordError && (
							<p
								style={{
									color: "red",
									fontSize: 12,
									marginTop: 0,
									marginBottom: 8,
								}}
							>
								Password must be at least 6 characters
							</p>
						)}

						<button
							type="button"
							onClick={handleSubmit}
							className="w-full mt-4 py-3 rounded text-white text-lg font-semibold"
							style={{ background: colorScheme.contactTitle }}
							onMouseOver={handleButtonHover}
							onFocus={handleButtonHover}
							onMouseOut={handleButtonOut}
							onBlur={handleButtonOut}
						>
							{staticText.loginTitle}
						</button>

						<GoogleButton
							style={{ width: "100%", margin: "16px 0" }}
							onClick={handleGoogleSignIn}
						/>

						<p
							className="text-center mt-4 text-base"
							style={{ color: colorScheme.textMain, marginBottom: 0 }}
						>
							New here?{" "}
							<a
								href="/signup"
								className="font-medium"
								style={{ color: colorScheme.link }}
							>
									 up
							</a>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
