import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import childInfoFormSchema from "../../../../schema/childInfoFormSchema.json";
import colorSchemeJson from "../../../../theme/colorScheme.json";

const colorScheme = colorSchemeJson as {
	background: string;
	cardTop: string;
	cardBody: string;
	primary: string;
	primaryHover: string;
	textMain: string;
	link: string;
};

const challengeOptions = childInfoFormSchema.properties.challenges.items.enum;
const ageBandOptions = childInfoFormSchema.properties.ageBand.enum;
const questionTypes = ["radio", "rating", "boolean", "text"];

export const Route = createFileRoute("/template/questions/new/")({
	component: RouteComponent,
});

function RouteComponent() {
	const [step, setStep] = useState(1);
	const [form, setForm] = useState({
		challenge: "",
		ageBand: "",
		type: "",
	});
	const [questionText, setQuestionText] = useState("");
	const [radioOptions, setRadioOptions] = useState(["", ""]);
	const navigate = useNavigate();

	const renderPillOptions = (
		options: string[],
		key: string,
		selected: string,
	) => (
		<div
			style={{
				display: "flex",
				flexDirection: "row",
				gap: 16,
				flexWrap: "wrap",
				justifyContent: "center",
				marginBottom: 12,
			}}
		>
			{options.map((opt) => (
				<button
					key={opt}
					type="button"
					className={`pill-btn${selected === opt ? " selected" : ""}`}
					aria-pressed={selected === opt}
					onClick={() => setForm((f) => ({ ...f, [key]: opt }))}
					style={{ minWidth: 120 }}
				>
					{opt}
				</button>
			))}
		</div>
	);

	const handleNext = () => {
		if (step === 1 && form.challenge) setStep(2);
		else if (step === 2 && form.ageBand) setStep(3);
		else if (step === 3 && form.type) setStep(4);
	};

	const handleCreate = async () => {
		// map challenge → categoryId (number as string)
		const categoryMap: Record<string, string> = {
			"Social Interaction": "11111111-1111-1111-1111-111111111111",
			"Cognitive Skills": "22222222-2222-2222-2222-222222222222",
			Communication: "33333333-3333-3333-3333-333333333333",
			"Motor Skills": "44444444-4444-4444-4444-444444444444",
			"Behavioral Issues": "55555555-5555-5555-5555-555555555555",
			"Learning Difficulties": "66666666-6666-6666-6666-666666666666",
		};

		const newQuestionPayload = {
			questionSeq: 0, // backend can update sequence
			questionType: form.type, // radio | rating | boolean | text
			questionLabel: questionText, // you might keep label same as text
			questionText: questionText,
			questionCategoryId:
				categoryMap[form.challenge] ?? "00000000-0000-0000-0000-000000000000",
			questionVisibleRuleId: "string",
			questionVisibleRuleExist: true,
			questionComplexityLevel: 0,
			deleted: true,
		};

		try {
			const response = await fetch("https://eo5hwkr1qlzrgls.m.pipedream.net", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newQuestionPayload),
			});

			if (!response.ok) {
				throw new Error("Failed to create question");
			}

			const saved = await response.json();
			console.log("Question saved:", saved);

			navigate({ to: "/template/questions" });
		} catch (err) {
			console.error(err);
			alert("Error creating question. Please try again.");
		}
	};

	const addRadioOption = () => setRadioOptions((opts) => [...opts, ""]);
	const handleRadioOptionChange = (idx: number, value: string) => {
		setRadioOptions((opts) => opts.map((o, i) => (i === idx ? value : o)));
	};

	return (
		<div
			className="min-h-screen flex flex-col items-center justify-start"
			style={{
				background:
					"linear-gradient(120deg, #e1e9f2, #d7e3ee, #d7dfea, #f0f9ff, #ecfdf5)",
				minHeight: "100vh",
				paddingBottom: 40,
			}}
		>
			<style>{`
        .pill-btn {
          font-weight: 500;
          background: #f5f5f5;
          color: ${colorScheme.textMain};
          border-radius: 999px;
          padding: 10px 22px;
          cursor: pointer;
          border: 1.5px solid #e0e0e0;
          box-shadow: none;
          outline: none;
          font-size: 1rem;
          margin-bottom: 0px;
          margin-top: 0px;
          margin-right: 0px;
          margin-left: 0px;
          width: 100%;
          max-width: 340px;
          display: block;
          transition: background 0.18s, color 0.18s, box-shadow 0.18s, transform 0.18s;
        }
        .pill-btn:hover, .pill-btn:focus {
          background: #e0e0e0;
          color: ${colorScheme.textMain};
          transform: scale(1.04) perspective(400px) translateZ(8px);
          box-shadow: 0 4px 18px 0 #bbb2;
          z-index: 1;
        }
        .pill-btn.selected {
          background: ${colorScheme.primary};
          color: #fff;
          border: 1.5px solid ${colorScheme.primary};
          box-shadow: 0 2px 8px 0 ${colorScheme.primary}22;
          transform: scale(1.06) perspective(400px) translateZ(12px);
        }
        .question-card {
          transition: box-shadow 0.2s, transform 0.2s;
          will-change: transform;
        }
        .question-card:hover {
          box-shadow: 0 8px 32px 0 ${colorScheme.primary}33;
          transform: scale(1.025) perspective(600px) translateZ(16px) rotateX(2deg);
          z-index: 2;
        }
        .nav-btn {
          padding: 12px 38px;
          font-size: 18px;
          background: #fff;
          color: ${colorScheme.primary};
          border: 2px solid ${colorScheme.primary};
          border-radius: 12px;
          font-weight: 700;
          box-shadow: 0 2px 8px 0 ${colorScheme.primary}11;
          transition: background 0.18s, color 0.18s, box-shadow 0.18s, transform 0.18s;
          cursor: pointer;
          letter-spacing: 0.2px;
          outline: none;
        }
        .nav-btn:hover, .nav-btn:focus {
          background: ${colorScheme.primary};
          color: #fff;
          box-shadow: 0 4px 18px 0 ${colorScheme.primary}33;
          transform: scale(1.04) perspective(400px) translateZ(8px);
          z-index: 1;
        }
      `}</style>
			{/* Header */}
			<header
				className="w-full flex flex-col items-center justify-center shadow-sm"
				style={{
					background: "#2a9d8f",
					minHeight: 72,
					borderBottom: `2px solid ${colorScheme.primary}22`,
				}}
			>
				<span
					className="text-2xl font-bold tracking-tight"
					style={{ color: colorScheme.textMain, letterSpacing: 0.5 }}
				>
					Create a question
				</span>
			</header>

			{/* Step 1: Challenge */}
			{step === 1 && (
				<section
					className="w-full flex flex-col items-center"
					style={{ marginTop: 32, marginBottom: 24 }}
				>
					<div
						className="rounded-xl shadow-md flex flex-col items-center px-8 py-8 question-card"
						style={{
							maxWidth: 540,
							minWidth: 340,
							margin: "0 auto",
							background: colorScheme.cardBody,
							border: `1.5px solid ${colorScheme.primary}22`,
						}}
					>
						<div
							style={{
								fontWeight: 700,
								fontSize: 18,
								marginBottom: 16,
								color: "#111",
								textAlign: "center",
								width: "100%",
							}}
						>
							1. Challenge:
						</div>
						{renderPillOptions(challengeOptions, "challenge", form.challenge)}
						<button
							type="button"
							className="nav-btn"
							style={{ marginTop: 32, width: 180 }}
							disabled={!form.challenge}
							onClick={handleNext}
						>
							Next
						</button>
					</div>
				</section>
			)}

			{/* Step 2: Age Band */}
			{step === 2 && (
				<section
					className="w-full flex flex-col items-center"
					style={{ marginTop: 32, marginBottom: 24 }}
				>
					<div
						className="rounded-xl shadow-md flex flex-col items-center px-8 py-8 question-card"
						style={{
							maxWidth: 540,
							minWidth: 340,
							margin: "0 auto",
							background: colorScheme.cardBody,
							border: `1.5px solid ${colorScheme.primary}22`,
						}}
					>
						<div
							style={{
								fontWeight: 700,
								fontSize: 18,
								marginBottom: 16,
								color: "#111",
								textAlign: "center",
								width: "100%",
							}}
						>
							2. Age Band:
						</div>
						{renderPillOptions(ageBandOptions, "ageBand", form.ageBand)}
						<button
							type="button"
							className="nav-btn"
							style={{ marginTop: 32, width: 180 }}
							disabled={!form.ageBand}
							onClick={handleNext}
						>
							Next
						</button>
					</div>
				</section>
			)}

			{/* Step 3: Type of Question */}
			{step === 3 && (
				<section
					className="w-full flex flex-col items-center"
					style={{ marginTop: 32, marginBottom: 24 }}
				>
					<div
						className="rounded-xl shadow-md flex flex-col items-center px-8 py-8 question-card"
						style={{
							maxWidth: 540,
							minWidth: 340,
							margin: "0 auto",
							background: colorScheme.cardBody,
							border: `1.5px solid ${colorScheme.primary}22`,
						}}
					>
						<div
							style={{
								fontWeight: 700,
								fontSize: 18,
								marginBottom: 16,
								color: "#111",
								textAlign: "center",
								width: "100%",
							}}
						>
							3. Type of Question:
						</div>
						{renderPillOptions(questionTypes, "type", form.type)}
						<button
							type="button"
							className="nav-btn"
							style={{ marginTop: 32, width: 180 }}
							disabled={!form.type}
							onClick={handleNext}
						>
							Next
						</button>
					</div>
				</section>
			)}

			{/* Step 4: Enter Question and Options */}
			{step === 4 && (
				<section
					className="w-full flex flex-col items-center"
					style={{ marginTop: 32, marginBottom: 24 }}
				>
					<div
						className="rounded-xl shadow-md flex flex-col items-center px-8 py-8 question-card"
						style={{
							maxWidth: 540,
							minWidth: 340,
							margin: "0 auto",
							background: colorScheme.cardBody,
							border: `1.5px solid ${colorScheme.primary}22`,
						}}
					>
						<div
							style={{
								fontWeight: 700,
								fontSize: 18,
								marginBottom: 16,
								color: "#111",
								textAlign: "center",
								width: "100%",
							}}
						>
							Enter the question:
						</div>
						<input
							type="text"
							value={questionText}
							onChange={(e) => setQuestionText(e.target.value)}
							placeholder="Type your question here..."
							style={{
								width: "100%",
								maxWidth: 400,
								padding: "10px 16px",
								borderRadius: 8,
								border: `1.5px solid ${colorScheme.primary}33`,
								fontSize: 16,
								marginBottom: 18,
								outline: "none",
							}}
						/>
						{form.type === "radio" && (
							<div style={{ width: "100%", maxWidth: 400, marginBottom: 18 }}>
								<div style={{ fontWeight: 600, marginBottom: 8 }}>Options:</div>
								{radioOptions.map((opt, idx) => (
									<input
										key={idx}
										type="text"
										value={opt}
										onChange={(e) =>
											handleRadioOptionChange(idx, e.target.value)
										}
										placeholder={`Option ${idx + 1}`}
										style={{
											width: "100%",
											padding: "8px 12px",
											borderRadius: 6,
											border: `1.5px solid ${colorScheme.primary}33`,
											fontSize: 15,
											marginBottom: 8,
											outline: "none",
										}}
									/>
								))}
								<button
									type="button"
									className="nav-btn"
									style={{
										width: 120,
										marginTop: 4,
										fontSize: 15,
										padding: "7px 0",
									}}
									onClick={addRadioOption}
								>
									Add Option
								</button>
							</div>
						)}
						<button
							type="button"
							className="nav-btn"
							style={{ marginTop: 12, width: 180 }}
							disabled={
								!questionText ||
								(form.type === "radio" &&
									radioOptions.filter((o) => o.trim()).length < 2)
							}
							onClick={handleCreate}
						>
							Create Question
						</button>
					</div>
				</section>
			)}
		</div>
	);
}
