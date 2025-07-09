import colorSchemeJson from "../../../theme/colorScheme.json";

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

import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useState } from "react";

import behavior from "../../../schema/challenges/behavior.json";
import cognitive from "../../../schema/challenges/cognitive.json";
import communication from "../../../schema/challenges/communication.json";
import learning from "../../../schema/challenges/learning.json";
import motor from "../../../schema/challenges/motor.json";
// Import all challenge schemas
import social from "../../../schema/challenges/social.json";

const challengeMap = {
	"Social Interaction": social,
	"Motor Skills": motor,
	"Learning Difficulties": learning,
	Communication: communication,
	"Cognitive Skills": cognitive,
	"Behavioral Issues": behavior,
};

export const Route = createFileRoute("/assessment/challenge/")({
	component: function RouteComponent() {
		const search = useSearch({ from: "/assessment/challenge/" }) as {
			name?: string;
			gender?: string;
			ageBand?: string;
			challenges?: string[] | string;
		};
		const { name, gender, ageBand, challenges } = search;
		const challengeList = Array.isArray(challenges)
			? challenges
			: typeof challenges === "string" && challenges
				? [challenges]
				: [];

		const [currentChallengeIdx, setCurrentChallengeIdx] = useState(0);
		const [answers, setAnswers] = useState<Record<string, string>>({});
		const [showSummary, setShowSummary] = useState(false);

		if (!name || !gender || !ageBand || challengeList.length === 0) {
			return <div>Missing assessment data.</div>;
		}

		const currentChallengeName = challengeList[currentChallengeIdx];
		const challengeSchema = challengeMap[currentChallengeName];
		const questions = challengeSchema?.questionsByAgeBand?.[ageBand] || [];

		const handleInputChange = (qid: string, value: string) => {
			setAnswers((prev) => ({ ...prev, [qid]: value }));
		};

		const handleNext = () => {
			setCurrentChallengeIdx((idx) => idx + 1);
		};

		const handleSubmit = () => {
			setShowSummary(true);
		};

		if (showSummary) {
			// Show summary of all questions and answers
			let allQuestions: { challenge: string; q: any }[] = [];
			challengeList.forEach((challengeName) => {
				const schema = challengeMap[challengeName];
				const qs = schema?.questionsByAgeBand?.[ageBand] || [];
				qs.forEach((q: any) => {
					allQuestions.push({ challenge: challengeName, q });
				});
			});
			return (
				<div
					className="min-h-screen flex flex-col items-center justify-center"
					style={{ background: colorScheme.background }}
				>
					<div
						className="w-full flex items-center px-8 py-3"
						style={{ background: colorScheme.cardTop, minHeight: 60 }}
					>
						<span
							className="text-lg font-bold"
							style={{ color: colorScheme.textMain }}
						>
							Assessment Summary
						</span>
					</div>
					<div
						className="w-full bg-white rounded shadow-lg flex flex-col justify-center items-center"
						style={{
							maxWidth: 700,
							minHeight: 400,
							aspectRatio: "3/2",
							background: colorScheme.cardBody,
						}}
					>
						<div className="w-full text-center py-6 px-8 rounded-t">
							<div style={{ color: colorScheme.textMain }}>
								<strong>Name:</strong> {name}
							</div>
							<div style={{ color: colorScheme.textMain }}>
								<strong>Gender:</strong> {gender}
							</div>
							<div style={{ color: colorScheme.textMain }}>
								<strong>Age Band:</strong> {ageBand}
							</div>
							<div style={{ marginTop: 24 }}>
								<h3 style={{ color: colorScheme.primary }}>
									Questions & Answers:
								</h3>
								<ul>
									{allQuestions.map(({ challenge, q }) => (
										<li
											key={challenge + q.id}
											style={{ marginBottom: 16, color: colorScheme.textMain }}
										>
											<div>
												<strong>
													[{challenge}] {q.text}
												</strong>
											</div>
											<div>Answer: {answers[q.id] ?? <em>No answer</em>}</div>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				</div>
			);
		}

		// --- UI Cleanup and Modernization ---
		return (
			<div
				className="min-h-screen flex flex-col items-center justify-start"
				style={{
					background: colorScheme.background,
					minHeight: "100vh",
					paddingBottom: 40,
				}}
			>
				{/* Inline style for pill, card, and button effects */}
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
  .rating-circle {
    display: inline-block;
    width: 40px;
    height: 40px;
    line-height: 40px;
    border-radius: 50%;
    background: #f5f5f5;
    color: #888;
    font-weight: 700;
    font-size: 18px;
    text-align: center;
    cursor: pointer;
    border: 1.5px solid #ccc;
    margin: 0 7px;
    transition: background 0.2s, color 0.2s, border 0.2s, box-shadow 0.2s, transform 0.18s;
    box-shadow: none;
    outline: none;
  }
  .rating-circle.selected.rating-red {
    background: #ff4d4f;
    color: #fff;
    border: 2px solid #ff4d4f;
    box-shadow: 0 2px 8px 0 #ff4d4f33;
    transform: scale(1.12) perspective(400px) translateZ(10px);
  }
  .rating-circle.selected.rating-orange {
    background: #fa8c16;
    color: #fff;
    border: 2px solid #fa8c16;
    box-shadow: 0 2px 8px 0 #fa8c1633;
    transform: scale(1.12) perspective(400px) translateZ(10px);
  }
  .rating-circle.selected.rating-yellow {
    background: #fadb14;
    color: #222;
    border: 2px solid #fadb14;
    box-shadow: 0 2px 8px 0 #fadb1433;
    transform: scale(1.12) perspective(400px) translateZ(10px);
  }
  .rating-circle.selected.rating-green {
    background: #52c41a;
    color: #fff;
    border: 2px solid #52c41a;
    box-shadow: 0 2px 8px 0 #52c41a33;
    transform: scale(1.12) perspective(400px) translateZ(10px);
  }
  .rating-circle:hover, .rating-circle:focus {
    box-shadow: 0 4px 18px 0 #bbb2;
    transform: scale(1.08) perspective(400px) translateZ(8px);
    z-index: 1;
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
						background: colorScheme.cardTop,
						minHeight: 72,
						borderBottom: `2px solid ${colorScheme.primary}22`,
					}}
				>
					<span
						className="text-2xl font-bold tracking-tight"
						style={{ color: colorScheme.textMain, letterSpacing: 0.5 }}
					>
						Assessment
					</span>
					<span
						className="text-base font-semibold mt-1"
						style={{ color: colorScheme.primary, letterSpacing: 0.2 }}
					>
						{currentChallengeName}
					</span>
				</header>
				{/* Info Card */}
				<section
					className="w-full flex justify-center"
					style={{ marginTop: 32, marginBottom: 24 }}
				>
					<div
						className="rounded-xl shadow-md flex flex-row gap-8 items-center px-8 py-4"
						style={{
							maxWidth: 540,
							minWidth: 340,
							margin: "0 auto",
							background: colorScheme.cardBody,
							border: `1.5px solid ${colorScheme.primary}22`,
							justifyContent: "center",
							display: "flex",
						}}
					>
						<div style={{ color: colorScheme.textMain, fontWeight: 500 }}>
							<span style={{ opacity: 0.7 }}>Name:</span> {name}
						</div>
						<div style={{ color: colorScheme.textMain, fontWeight: 500 }}>
							<span style={{ opacity: 0.7 }}>Gender:</span> {gender}
						</div>
						<div style={{ color: colorScheme.textMain, fontWeight: 500 }}>
							<span style={{ opacity: 0.7 }}>Age Band:</span> {ageBand}
						</div>
					</div>
				</section>
				{/* Questions as vertically stacked cards */}
				<section
					className="w-full flex flex-col items-center"
					style={{ gap: 28, marginTop: 0, marginBottom: 0 }}
				>
					{questions.length === 0 && (
						<div
							style={{
								color: colorScheme.textMain,
								fontStyle: "italic",
								marginTop: 32,
							}}
						>
							No questions found for this age group.
						</div>
					)}
					{questions.map((q: any, idx: number) => (
						<div
							key={q.id}
							className="w-full flex flex-col items-center shadow-lg question-card"
							style={{
								background: colorScheme.cardBody,
								borderRadius: 18,
								border: `1.5px solid ${colorScheme.primary}33`,
								padding: "28px 36px",
								maxWidth: 540,
								minWidth: 340,
								margin: "0 auto",
								boxShadow: `0 4px 18px 0 ${colorScheme.primary}13`,
								color: colorScheme.textMain,
								alignItems: "center",
								display: "flex",
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
								{idx + 1}. {q.text}
							</div>
							{q.type === "radio" && q.options && (
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										gap: 14,
										marginTop: 6,
										width: "100%",
										alignItems: "center",
									}}
								>
									{q.options.map((opt: string) => (
										<button
											key={opt}
											type="button"
											className={`pill-btn${answers[q.id] === opt ? " selected" : ""}`}
											aria-pressed={answers[q.id] === opt}
											onClick={() => handleInputChange(q.id, opt)}
											tabIndex={0}
											style={{ marginBottom: 0, textAlign: "center" }}
										>
											{opt}
										</button>
									))}
								</div>
							)}
							{q.type === "boolean" && (
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										gap: 14,
										marginTop: 6,
										width: "100%",
										alignItems: "center",
									}}
								>
									{["Yes", "No"].map((opt) => (
										<button
											key={opt}
											type="button"
											className={`pill-btn${answers[q.id] === opt ? " selected" : ""}`}
											aria-pressed={answers[q.id] === opt}
											onClick={() => handleInputChange(q.id, opt)}
											tabIndex={0}
											style={{ marginBottom: 0, textAlign: "center" }}
										>
											{opt}
										</button>
									))}
								</div>
							)}
							{q.type === "rating" && (
								<div
									style={{
										display: "flex",
										flexDirection: "row",
										justifyContent: "center",
										alignItems: "center",
										marginTop: 10,
										width: "100%",
										gap: 0,
									}}
								>
									{[...Array(10)].map((_, idx) => {
										const val = (idx + 1).toString();
										const isSelected = answers[q.id] === val;
										// Determine color class for selected
										let colorClass = "";
										if (isSelected) {
											if (idx + 1 <= 3) colorClass = "rating-red";
											else if (idx + 1 <= 5) colorClass = "rating-orange";
											else if (idx + 1 <= 7) colorClass = "rating-yellow";
											else colorClass = "rating-green";
										}
										return (
											<span
												key={val}
												className={`rating-circle${isSelected ? " selected " + colorClass : ""}`}
												tabIndex={0}
												role="button"
												aria-pressed={isSelected}
												onClick={(e) => {
													// Reset all siblings' styles to default (for mouse hover effect)
													const parent = e.currentTarget.parentElement;
													if (parent) {
														Array.from(parent.children).forEach((child) => {
															if (child !== e.currentTarget) {
																child.removeAttribute("style");
															}
														});
													}
													handleInputChange(q.id, val);
												}}
												onKeyUp={(e) => {
													if (e.key === "Enter" || e.key === " ")
														handleInputChange(q.id, val);
												}}
												onMouseEnter={(e) => {
													if (!isSelected) {
														if (idx + 1 <= 3) {
															e.currentTarget.style.background = "#ff4d4f";
															e.currentTarget.style.color = "#fff";
															e.currentTarget.style.border =
																"2px solid #ff4d4f";
														} else if (idx + 1 <= 5) {
															e.currentTarget.style.background = "#fa8c16";
															e.currentTarget.style.color = "#fff";
															e.currentTarget.style.border =
																"2px solid #fa8c16";
														} else if (idx + 1 <= 7) {
															e.currentTarget.style.background = "#fadb14";
															e.currentTarget.style.color = "#222";
															e.currentTarget.style.border =
																"2px solid #fadb14";
														} else {
															e.currentTarget.style.background = "#52c41a";
															e.currentTarget.style.color = "#fff";
															e.currentTarget.style.border =
																"2px solid #52c41a";
														}
													}
												}}
												onMouseLeave={(e) => {
													if (!isSelected) {
														e.currentTarget.style.background = "#f5f5f5";
														e.currentTarget.style.color = "#888";
														e.currentTarget.style.border = "1.5px solid #ccc";
													}
												}}
											>
												{val}
											</span>
										);
									})}
								</div>
							)}
						</div>
					))}
				</section>
				{/* Navigation Buttons */}
				<div
					style={{
						marginTop: 32,
						marginBottom: 40,
						display: "flex",
						justifyContent: "space-between",
						width: 540,
						maxWidth: "90vw",
					}}
				>
					<button
						type="button"
						className="nav-btn"
						onClick={() => {
							if (currentChallengeIdx === 0) {
								window.location.href = "/assessment/start";
							} else {
								setCurrentChallengeIdx((idx) => idx - 1);
							}
						}}
					>
						Back
					</button>
					{currentChallengeIdx < challengeList.length - 1 ? (
						<button type="button" className="nav-btn" onClick={handleNext}>
							Next
						</button>
					) : (
						<button type="button" className="nav-btn" onClick={handleSubmit}>
							Submit
						</button>
					)}
				</div>
			</div>
		);
	},
});
