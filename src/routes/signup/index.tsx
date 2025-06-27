import { materialRenderers } from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import GoogleButton from "react-google-button";

import signupSchema from "../../schema/signupFormSchema.json";
import signupUiSchema from "../../schema/signupUiSchema.json";
import staticText from "../../text/staticText.json";
import colorSchemeJson from "../../theme/colorScheme.json";

interface ColorScheme {
	background: string;
	cardTop: string;
	cardBody: string;
	primary: string;
	primaryHover: string;
	textMain: string;
	link: string;
}

const colorScheme = colorSchemeJson as ColorScheme;

type SignupFormData = {
	username: string;
	email: string;
	password: string;
};

export const Route = createFileRoute("/signup/")({
	component: SignupPage,
});

function SignupPage() {
	const [formData, setFormData] = useState<SignupFormData>({
		username: "",
		email: "",
		password: "",
	});
	const [touched, setTouched] = useState<{
		username: boolean;
		email: boolean;
		password: boolean;
	}>({
		username: false,
		email: false,
		password: false,
	});
	const [message, setMessage] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [isValid, setIsValid] = useState(false); // <-- add this

	const handleInputChange = (data: SignupFormData) => {
		setFormData(data);
	};

	const handleInputBlur = (field: keyof SignupFormData) => {
		setTouched((prev) => ({ ...prev, [field]: true }));
	};

	const handleSubmit = async (e?: React.FormEvent) => {
		if (e) e.preventDefault();
		setMessage(null);
		setError(null);
		setLoading(true);
		try {
			const res = await fetch("/api/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			if (res.ok) {
				setMessage(data.message || "Signup successful!");
			} else {
				setError(data.message || "Signup failed");
			}
		} catch (err) {
			setError("Network error");
		}
		setLoading(false);
	};

	const handleGoogleSignup = () => {
		const clientId = "YOUR_GOOGLE_CLIENT_ID";
		const redirectUri = `${window.location.origin}/signup`;
		const scope = "email profile";
		const oauthUrl =
			`https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}` +
			`&redirect_uri=${encodeURIComponent(redirectUri)}` +
			`&response_type=token&scope=${encodeURIComponent(scope)}`;
		window.location.href = oauthUrl;
	};

	const showPasswordError =
		touched.password &&
		formData.password.length > 0 &&
		formData.password.length < 6;
	const showUsernameError =
		touched.username &&
		formData.username.length > 0 &&
		formData.username.length < 3;

	const handleButtonHover = (
		e:
			| React.MouseEvent<HTMLButtonElement>
			| React.FocusEvent<HTMLButtonElement>,
	) => {
		e.currentTarget.style.background = colorScheme.primaryHover;
	};
	const handleButtonOut = (
		e:
			| React.MouseEvent<HTMLButtonElement>
			| React.FocusEvent<HTMLButtonElement>,
	) => {
		e.currentTarget.style.background = colorScheme.primary;
	};

	return (
		<div
			className="min-h-screen flex flex-col items-center justify-center"
			style={{ background: colorScheme.background }}
		>
			{/* Top Bar for logo/links */}
			<div
				className="w-full flex items-center px-8 py-3"
				style={{ background: "#5A4E4E", minHeight: 60 }}
			>
				{/* Place your logo or navigation here */}
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
							{staticText.signupTitle}
						</h2>
						<p className="text-base" style={{ color: colorScheme.textMain }}>
							{staticText.signupDescription}
						</p>
					</div>
					{/* Card Body */}
					<form
						className="w-full px-8 py-8 rounded-b flex-1 flex flex-col justify-center"
						style={{ background: colorScheme.cardBody, gap: 0 }}
						onSubmit={handleSubmit}
						autoComplete="off"
					>
						<div
							data-testid="jsonforms-container"
							onBlur={(event: React.FocusEvent<HTMLDivElement>) => {
								const id = (event.target as HTMLInputElement).id || "";
								if (id.includes("username")) handleInputBlur("username");
								if (id.includes("email")) handleInputBlur("email");
								if (id.includes("password")) handleInputBlur("password");
							}}
							tabIndex={-1}
						>
							<JsonForms
								schema={signupSchema}
								uischema={signupUiSchema}
								data={formData}
								renderers={materialRenderers}
								onChange={({ data, errors }) => {
									handleInputChange(data);
									setIsValid(!errors || errors.length === 0);
								}}
							/>
						</div>
						{showUsernameError && (
							<p
								data-testid="username-error"
								style={{
									color: "red",
									fontSize: 12,
									marginTop: 0,
									marginBottom: 8,
								}}
							>
								Username must be at least 3 characters
							</p>
						)}
						{showPasswordError && (
							<p
								data-testid="password-error"
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
						{loading && (
							<p
								style={{
									color: "#888",
									fontSize: 14,
									marginTop: 8,
									marginBottom: 0,
								}}
							>
								Loading...
							</p>
						)}
						{message && (
							<p
								data-testid="success-message"
								style={{
									color: "green",
									fontSize: 14,
									marginTop: 8,
									marginBottom: 0,
								}}
							>
								{message}
							</p>
						)}
						{error && (
							<p
								data-testid="error-message"
								style={{
									color: "red",
									fontSize: 14,
									marginTop: 8,
									marginBottom: 0,
								}}
							>
								{error}
							</p>
						)}
						<button
							type="submit"
							data-testid="signup-submit-button"
							className="w-full mt-4 py-3 rounded text-white text-lg font-semibold"
							style={{ background: colorScheme.primary }}
							disabled={loading || !isValid}
							onMouseOver={handleButtonHover}
							onFocus={handleButtonHover}
							onMouseOut={handleButtonOut}
							onBlur={handleButtonOut}
						>
							{loading ? "Signing up..." : staticText.signupTitle}
						</button>

						{/* Google Signup Button*/}
						<div className="w-full flex justify-center my-4">
							<div
								data-testid="google-signup-button"
								style={{ width: "100%", maxWidth: 320 }}
							>
								<GoogleButton
									label="Sign up with Google"
									onClick={handleGoogleSignup}
									style={{ width: "100%", maxWidth: 320 }}
								/>
							</div>
						</div>

						<p
							className="text-center mt-4 text-base"
							style={{ color: colorScheme.textMain, marginBottom: 0 }}
						>
							Already signed up?{" "}
							<a
								href="/login"
								className="font-medium"
								style={{ color: colorScheme.link }}
							>
								Login
							</a>
							{" | "}
							<a
								href="/why_us"
								className="font-medium"
								style={{ color: colorScheme.link }}
							>
								Why us?
							</a>
						</p>
					</form>
				</div>
			</div>
		</div>
	);
}

export default SignupPage;
