import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import staticText from "../../../text/staticText.json";
import colorSchemeJson from "../../../theme/colorScheme.json";
import whyUsColorScheme from "../../../theme/whyUsColorScheme.json";

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
const whyUs = whyUsColorScheme as {
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
	contactText: string;
};

interface AssessmentQuestion {
	id: string;
	questionText: string;
	challengeType: string;
	createdBy: string;
	updatedAt: string;
}

export const Route = createFileRoute("/template/list/")({
	component: AssessmentQuestionListPage,
});

export default Route;

function AssessmentQuestionListPage() {
	const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
	interface TemplateQuestion {
		question: string;
		challenge: string;
		ageBand: string;
		createdAt: string;
		type?: string;
		options?: string[];
	}

	const [templateQuestions, setTemplateQuestions] = useState<
		TemplateQuestion[]
	>([]);
	const [modal, setModal] = useState<null | {
		type: "template" | "api";
		data: any;
	}>(null);
	const [sortKey, setSortKey] = useState<"challengeType" | "updatedAt">(
		"challengeType",
	);
	const navigate = useNavigate();

	// Load templateQuestions from localStorage on mount
	useEffect(() => {
		const stored = localStorage.getItem("templateQuestions");
		if (stored) {
			setTemplateQuestions(JSON.parse(stored));
		}
	}, []);

	// Delete a template question from localStorage
	const handleDeleteTemplate = (createdAt: string) => {
		if (window.confirm("Are you sure you want to delete this question?")) {
			const updated = templateQuestions.filter(
				(q) => q.createdAt !== createdAt,
			);
			setTemplateQuestions(updated);
			localStorage.setItem("templateQuestions", JSON.stringify(updated));
		}
	};

	useEffect(() => {
		fetchQuestions();
	}, []);

	const fetchQuestions = async () => {
		try {
			const response = await fetch("/api/assessment/questions");
			const data = await response.json();
			if (Array.isArray(data) && data.length > 0) {
				setQuestions(data);
			} else {
				setQuestions([]); // No hardcoded fallback
			}
		} catch (err) {
			console.error("Error fetching questions", err);
			setQuestions([]); // No hardcoded fallback on error
		}
	};

	const handleDelete = async (id: string) => {
		if (window.confirm("Are you sure you want to delete this question?")) {
			await fetch(`/api/assessment/questions/${id}`, { method: "DELETE" });
			fetchQuestions(); // refresh list
		}
	};

	const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const key = e.target.value as "challengeType" | "updatedAt";
		setSortKey(key);
		const sorted = [...questions].sort((a, b) => a[key].localeCompare(b[key]));
		setQuestions(sorted);
	};

	return (
		<div
			className="min-h-screen p-6"
			style={{
				background: `linear-gradient(120deg, #e1e9f2, #d7e3ee, #d7dfea, #f0f9ff, #ecfdf5)`, // Complementary soft gradient
				backgroundSize: "400% 400%",
				animation: "gradientShift 15s ease infinite", // Breathing animation
				minHeight: "100vh",
				position: "relative", // Ensure floating shapes are positioned correctly
				overflow: "hidden", // Prevent floating shapes from affecting layout
			}}
		>
			{/* Floating Shapes */}
			<div
				style={{
					content: '""',
					position: "absolute",
					top: "-50px",
					left: "-50px",
					width: "200px",
					height: "200px",
					background: "rgba(248, 250, 252, 0.3)",
					borderRadius: "50%",
					animation: "floaty 30s ease-in-out infinite",
					filter: "blur(60px)",
					zIndex: -1,
				}}
			/>
			<div
				style={{
					content: '""',
					position: "absolute",
					bottom: "-50px",
					right: "-50px",
					width: "200px",
					height: "200px",
					background: "rgba(241, 245, 249, 0.3)",
					borderRadius: "50%",
					animation: "floaty 40s ease-in-out infinite",
					filter: "blur(60px)",
					zIndex: -1,
				}}
			/>
			{/* Header */}
			<div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
				<h1
					className="text-4xl font-bold"
					style={{
						color: whyUs.textline,
						letterSpacing: 0.5,
						padding: "8px 24px",
						borderRadius: 8,
						background: "transparent",
						marginRight: 24,
						marginBottom: 0,
						borderBottom: `3px solid ${whyUs.textline}`,
						display: "inline-block",
					}}
				>
					Assessment Questions
				</h1>
				<div style={{ display: "flex", alignItems: "center", gap: 16 }}>
					<label
						htmlFor="sort-select"
						style={{
							fontWeight: 600,
							color: whyUs.cardTitle,
							marginRight: 8,
							fontSize: 18,
							background: whyUs.cardBg,
							padding: "7px 16px",
							borderRadius: 8,
							border: `1.5px solid ${whyUs.cardTitle}`,
						}}
					>
						Sort by:
					</label>
					<select
						id="sort-select"
						value={sortKey}
						onChange={handleSortChange}
						style={{
							padding: "9px 10px",
							borderRadius: 8,
							border: `2px solid ${whyUs.cardTitle}`,
							background: whyUs.cardBg,
							color: whyUs.cardTitle,
							fontWeight: 600,
							fontSize: 16,
							boxShadow: `0 3px 10px ${whyUs.cardShadow}`,
							outline: "none",
							cursor: "pointer",
							transition: "all 0.3s ease-in-out",
							transform: "scale(1)",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.transform = "scale(1.05)";
							e.currentTarget.style.boxShadow = `0 4px 15px ${whyUs.cardShadow}`;
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.transform = "scale(1)";
							e.currentTarget.style.boxShadow = `0 3px 10px ${whyUs.cardShadow}`;
						}}
					>
						<option value="challengeType">Challenge</option>
						<option value="updatedAt">Last Updated</option>
					</select>
					<button
						type="button"
						onClick={() => navigate({ to: "/template/list/new" })}
						className="px-4 py-2 rounded text-white font-semibold transition-all duration-200 hover:brightness-90 hover:scale-105"
						style={{ background: whyUs.cardTitle, marginLeft: 16 }}
					>
						+ Create New Question
					</button>
				</div>
			</div>

			{/* Question Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{/* Render templateQuestions from localStorage first */}
				{templateQuestions.map((q) => (
					<button
						key={q.createdAt + q.question}
						type="button"
						className="rounded shadow-lg p-4 flex flex-col justify-between cursor-pointer text-left"
						style={{
							background: "#b2e1db", // Light gray background
							boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)", // Subtle shadow
							borderRadius: "16px", // Rounded corners
							transition:
								"transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
							transform: "scale(1)",
							border: "1px solid rgba(0, 0, 0, 0.1)", // Subtle border
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.transform = "scale(1.03)";
							e.currentTarget.style.boxShadow =
								"0 8px 25px rgba(0, 0, 0, 0.15)";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.transform = "scale(1)";
							e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)";
						}}
						onClick={() => setModal({ type: "template", data: q })}
					>
						<div>
							<h2
								className="text-xl font-bold mb-2"
								style={{ color: "#374151" }} // Dark gray text for contrast
							>
								{q.question}
							</h2>
							<p className="text-sm" style={{ color: "#6b7280" }}>
								Challenge: {q.challenge}
							</p>
							<p className="text-sm" style={{ color: "#6b7280" }}>
								Age Band: {q.ageBand}
							</p>
							<p className="text-sm" style={{ color: "#9ca3af", opacity: 0.8 }}>
								Created: {new Date(q.createdAt).toLocaleString()}
							</p>
						</div>
						<div
							className="flex justify-end gap-2 mt-4"
							onClick={(e) => e.stopPropagation()}
							onKeyDown={(e) => e.stopPropagation()}
						>
							<button
								type="button"
								className="px-3 py-1 text-white rounded transition-all duration-200 hover:brightness-90 hover:scale-105"
								style={{
									background: "#374151",
									color: "#ffffff",
								}}
							>
								Edit
							</button>
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									handleDeleteTemplate(q.createdAt);
								}}
								className="px-3 py-1 text-white rounded transition-all duration-200 hover:brightness-90 hover:scale-105"
								style={{
									background: "#ef4444",
									color: "#ffffff",
								}}
							>
								Delete
							</button>
						</div>
					</button>
				))}
				{/* Then render the original hardcoded questions */}
				{questions.map((q) => (
					<button
						key={q.id}
						type="button"
						className="rounded shadow-lg p-4 flex flex-col justify-between cursor-pointer text-left"
						style={{
							background: "#7fccc3", // Light gray background
							boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)", // Subtle shadow
							borderRadius: "16px", // Rounded corners
							transition:
								"transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
							transform: "scale(1)",
							border: "1px solid rgba(0, 0, 0, 0.1)", // Subtle border
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.transform = "scale(1.02)";
							e.currentTarget.style.boxShadow =
								"0 6px 20px rgba(0, 0, 0, 0.15)";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.transform = "scale(1)";
							e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)";
						}}
						onClick={() => setModal({ type: "api", data: q })}
					>
						<div>
							<h2
								className="text-xl font-bold mb-2"
								style={{ color: "#2d3748" }} // Dark gray for good contrast
							>
								{q.questionText}
							</h2>
							<p className="text-sm" style={{ color: "#4a5568" }}>
								Challenge: {q.challengeType}
							</p>
							<p className="text-sm" style={{ color: "#4a5568" }}>
								Age Band:{" "}
								<span className="italic" style={{ color: "#9ca3af" }}>
									N/A
								</span>
							</p>
							<p className="text-sm" style={{ color: "#6b7280", opacity: 0.8 }}>
								Last updated: {new Date(q.updatedAt).toLocaleString()}
							</p>
						</div>
						<div
							className="flex justify-end gap-2 mt-4"
							onClick={(e) => e.stopPropagation()}
							onKeyDown={(e) => e.stopPropagation()}
						>
							<button
								type="button"
								className="px-3 py-1 text-white rounded transition-all duration-200 hover:brightness-90 hover:scale-105"
								style={{
									background: whyUs.contactTitle,
									color: whyUs.contactTitle,
								}}
							>
								Edit
							</button>
							<button
								type="button"
								onClick={() => handleDelete(q.id)}
								className="px-3 py-1 text-white rounded transition-all duration-200 hover:brightness-90 hover:scale-105"
								style={{
									background: "#ef4444",
									color: "#ffffff",
								}}
							>
								Delete
							</button>
						</div>
					</button>
				))}
			</div>

			{/* Modal Popup */}
			{modal && (
				<dialog
					open
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						width: "100vw",
						height: "100vh",
						background: "rgba(0,0,0,0.32)",
						zIndex: 1000,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: "rgba(0,0,0,0.32)",
						border: "none",
						padding: 0,
						margin: 0,
					}}
					onClick={() => setModal(null)}
					onKeyDown={(e) => {
						if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
							setModal(null);
						}
					}}
					aria-modal="true"
				>
					<div
						style={{
							background: whyUs.cardBg,
							borderRadius: 18,
							minWidth: 340,
							maxWidth: 480,
							width: "90vw",
							boxShadow: `0 8px 32px 0 ${whyUs.cardShadow}`,
							padding: 32,
							position: "relative",
							color: whyUs.cardText,
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							border: "none",
						}}
						onClick={(e) => e.stopPropagation()}
						onKeyDown={(e) => {
							// Prevent propagation for keyboard events as well
							e.stopPropagation();
						}}
					>
						{/* X Close Button */}
						<button
							type="button"
							aria-label="X"
							onClick={() => setModal(null)}
							style={{
								position: "absolute",
								top: 8,
								right: 16,
								background: "transparent",
								border: `1.5px solid ${whyUs.deleteButton}`,
								fontSize: 16,
								fontWeight: 600,
								color: whyUs.cardText,
								cursor: "pointer",
								borderRadius: 6,
								transition: "background 0.18s, color 0.18s, border 0.18s",
								padding: "2px 12px",
								minWidth: 36,
								minHeight: 28,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								letterSpacing: 1,
								zIndex: 10,
							}}
							onMouseEnter={(e) => {
								(e.currentTarget as HTMLButtonElement).style.background =
									whyUs.deleteButton;
								(e.currentTarget as HTMLButtonElement).style.color =
									whyUs.cardText;
								(e.currentTarget as HTMLButtonElement).style.border =
									`1.5px solid ${whyUs.contactBg}`;
							}}
							onMouseLeave={(e) => {
								(e.currentTarget as HTMLButtonElement).style.background =
									"transparent";
								(e.currentTarget as HTMLButtonElement).style.color =
									whyUs.cardText;
								(e.currentTarget as HTMLButtonElement).style.border =
									`1.5px solid ${whyUs.deleteButton}`;
							}}
						>
							X
						</button>
						{/* Modal Content */}
						<div style={{ width: "100%", textAlign: "center", paddingTop: 56 }}>
							<h2
								style={{
									fontWeight: 700,
									fontSize: 22,
									marginBottom: 12,
									color: whyUs.cardText,
								}}
							>
								{modal.type === "template"
									? modal.data.question +
										(modal.data.type === "text" ? " (100 words)" : "")
									: modal.data.questionText}
							</h2>
							<p
								style={{
									fontWeight: 500,
									color: whyUs.cardText,
									marginBottom: 8,
								}}
							>
								Challenge:{" "}
								{modal.type === "template"
									? modal.data.challenge
									: modal.data.challengeType}
							</p>
							<p
								style={{
									fontWeight: 500,
									color: whyUs.cardText,
									marginBottom: 8,
								}}
							>
								Age Band:{" "}
								{modal.type === "template" ? (
									modal.data.ageBand
								) : (
									<span style={{ color: "#aaa" }}>N/A</span>
								)}
							</p>
							<p style={{ color: "#888", marginBottom: 18 }}>
								{modal.type === "template"
									? `Created: ${new Date(modal.data.createdAt).toLocaleString()}`
									: `Last updated: ${new Date(modal.data.updatedAt).toLocaleString()}`}
							</p>
							{/* Render options if present for radio, boolean, or rating */}
							{modal.type === "template" &&
								(modal.data.type === "radio" ||
									modal.data.type === "boolean" ||
									modal.data.type === "rating") &&
								modal.data.options && (
									<div style={{ marginBottom: 16 }}>
										<div style={{ fontWeight: 600, marginBottom: 8 }}>
											Options:
										</div>
										{modal.data.options.map((opt: string, idx: number) => (
											<div
												key={idx}
												style={{
													background: whyUs.cardBg,
													borderRadius: 8,
													padding: "8px 14px",
													marginBottom: 6,
													color: whyUs.cardText,
													textAlign: "left",
													fontWeight: 500,
													border: `1.5px solid ${whyUs.cardTitle}22`,
													width: "100%",
													maxWidth: 340,
													margin: "0 auto 6px auto",
												}}
											>
												{opt}
											</div>
										))}
									</div>
								)}
							{/* For rating/boolean, you can add more UI as needed */}
						</div>
					</div>
				</dialog>
			)}
		</div>
	);
}

// Add animations to the global styles
// const style = document.createElement("style");
// style.textContent = `
// 	@keyframes gradientShift {
// 		0% { background-position: 0% 50%; }
// 		50% { background-position: 100% 50%; }
// 		100% { background-position: 0% 50%; }
// 	}
// 	@keyframes floaty {
// 		0%   { transform: translate(0, 0) scale(1); }
// 		50%  { transform: translate(100px, 80px) scale(1.2); }
// 		100% { transform: translate(0, 0) scale(1); }
// 	}
// `;
// document.head.appendChild(style);
