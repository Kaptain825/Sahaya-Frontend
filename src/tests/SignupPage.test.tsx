import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import SignupPage from "../routes/signup/index";

interface SignupRequestBody {
	email: string;
	username?: string;
	password?: string;
	[key: string]: unknown;
}

const server = setupServer(
	rest.post("/api/signup", (req, res, ctx) => {
		const { email } = req.body as SignupRequestBody;

		if (email === "exists@example.com") {
			return res(
				ctx.status(400),
				ctx.json({ message: "Email already exists" }),
			);
		}

		return res(ctx.status(201), ctx.json({ message: "Signup successful!" }));
	}),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Helper function to fill form
const fillSignupForm = async (
	username: string,
	email: string,
	password: string,
) => {
	await waitFor(() => {
		expect(screen.getByTestId("jsonforms-container")).toBeInTheDocument();
	});

	// Find all input fields
	const allInputs = Array.from(document.querySelectorAll("input"));
	const usernameInput = allInputs.find((input) =>
		input.id.includes("username"),
	) as HTMLInputElement;
	const emailInput = allInputs.find((input) =>
		input.id.includes("email"),
	) as HTMLInputElement;
	const passwordInput = allInputs.find(
		(input) => input.type === "password",
	) as HTMLInputElement;

	if (!usernameInput || !emailInput || !passwordInput) {
		throw new Error("Could not find one or more form inputs");
	}

	fireEvent.change(usernameInput, { target: { value: username } });
	fireEvent.change(emailInput, { target: { value: email } });
	fireEvent.change(passwordInput, { target: { value: password } });

	// Blur all fields to trigger touched state and validation
	fireEvent.blur(usernameInput);
	fireEvent.blur(emailInput);
	fireEvent.blur(passwordInput);

	await waitFor(() => {
		expect(usernameInput).toHaveValue(username);
		expect(emailInput).toHaveValue(email);
		expect(passwordInput).toHaveValue(password);
	});

	return { usernameInput, emailInput, passwordInput };
};

test("shows success message on successful signup", async () => {
	render(<SignupPage />);

	await fillSignupForm("newuser", "newuser@example.com", "newpassword");

	const submitButton = screen.getByTestId("signup-submit-button");
	await waitFor(() => expect(submitButton).not.toBeDisabled());

	// Extra wait to ensure form state is up to date
	await waitFor(() => {
		expect(submitButton).not.toBeDisabled();
	});

	fireEvent.click(submitButton);

	// Debug output after clicking submit
	screen.debug();

	await waitFor(() => {
		expect(screen.getByTestId("success-message")).toBeInTheDocument();
		expect(screen.getByText(/signup successful/i)).toBeInTheDocument();
	});
});

test("shows error message when email already exists", async () => {
	render(<SignupPage />);

	await fillSignupForm("testuser", "exists@example.com", "testpassword");

	const submitButton = screen.getByTestId("signup-submit-button");
	await waitFor(() => expect(submitButton).not.toBeDisabled());

	// Extra wait to ensure form state is up to date
	await waitFor(() => {
		expect(submitButton).not.toBeDisabled();
	});

	fireEvent.click(submitButton);

	// Debug output after clicking submit
	screen.debug();

	await waitFor(() => {
		expect(screen.getByTestId("error-message")).toBeInTheDocument();
		expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
	});
});

test("button is disabled when form is invalid", async () => {
	render(<SignupPage />);

	await waitFor(() => {
		expect(screen.getByTestId("jsonforms-container")).toBeInTheDocument();
	});

	const submitButton = screen.getByTestId("signup-submit-button");

	expect(submitButton).toBeDisabled();

	await fillSignupForm("ab", "test@example.com", "123");

	expect(submitButton).toBeDisabled();

	await fillSignupForm("validuser", "test@example.com", "validpassword");

	await waitFor(() => expect(submitButton).not.toBeDisabled());
});

test("shows validation errors for short username and password", async () => {
	render(<SignupPage />);

	await fillSignupForm("ab", "test@example.com", "123");

	await waitFor(() => {
		expect(screen.getByTestId("username-error")).toBeInTheDocument();
		expect(screen.getByTestId("password-error")).toBeInTheDocument();
	});
});

test("distinguishes between submit button and Google button", async () => {
	render(<SignupPage />);

	await waitFor(() => {
		expect(screen.getByTestId("jsonforms-container")).toBeInTheDocument();
	});

	const submitButton = screen.getByTestId("signup-submit-button");
	const googleButton = screen.getByTestId("google-signup-button");

	expect(submitButton).toBeInTheDocument();
	expect(googleButton).toBeInTheDocument();
	expect(submitButton).not.toBe(googleButton);

	expect(submitButton.textContent).toMatch(/sign up/i);
	expect(googleButton.textContent).toMatch(/sign up with google/i);
});
