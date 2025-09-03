import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import whyUsColorScheme from "../../../../theme/whyUsColorScheme.json";

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
	textline?: string;
	deleteButton?: string;
};

interface AssessmentQuestion {
	id: string;
	questionText: string;
	challengeType: string;
	createdBy?: string;
	updatedAt: string;
	ageBand?: string;
}

export const Route = createFileRoute("/template/questions/list/")({
	component: QuestionsListPage,
});

function QuestionsListPage() {
	const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
	const [templateId, setTemplateId] = useState<string | null>(null);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const id = params.get("templateId");
		setTemplateId(id);
		if (id) fetchQuestions(id);
	}, []);

	const fetchQuestions = async (id: string) => {
		try {
			// Example endpoint; adjust if your API differs
			const res = await fetch(
				`https://68b2bc6cc28940c9e69d3990.mockapi.io/api/v1/Getall/${id}`,
			)
			const data = await res.json();
			if (Array.isArray(data)) setQuestions(data);
			else setQuestions([]);
		} catch (err) {
			console.error("Error fetching questions", err);
			setQuestions([]);
		}
	}

	return (
		<div
			className="min-h-screen p-6"
			style={{
				background:
					"linear-gradient(120deg, #e1e9f2, #d7e3ee, #d7dfea, #f0f9ff, #ecfdf5)", // Complementary soft gradient
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
					Template Questions
				</h1>
				<div style={{ display: "flex", alignItems: "center", gap: 16 }}>
					<button
						type="button"
						onClick={() => {
							const href = templateId
								? `/template/questions/new?templateId=${encodeURIComponent(
									templateId,
								)}`
								: "/template/questions/new";
							window.location.href = href;
						}}
						className="px-4 py-2 rounded text-white font-semibold transition-all duration-200 hover:brightness-90 hover:scale-105"
						style={{ background: whyUs.cardTitle }}
					>
						+ Add Question
					</button>
				</div>
			</div>

			{/* Question Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{questions.map((q) => (
					<div
						key={q.id}
						className="rounded shadow-lg p-4 flex flex-col justify-between"
						style={{
							background: "#ffffff",
							boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
							borderRadius: "16px",
							border: "1px solid rgba(0, 0, 0, 0.1)",
						}}
					>
						<div>
							<h2
								className="text-xl font-bold mb-2"
								style={{ color: "#374151" }} // Dark gray text for contrast
							>
								{q.questionText}
							</h2>
							<p className="text-sm" style={{ color: "#6b7280" }}>
								Challenge: {q.challengeType}
							</p>
							{q.ageBand && (
								<p className="text-sm" style={{ color: "#6b7280" }}>
									Age Band: {q.ageBand}
								</p>
							)}
							<p className="text-sm" style={{ color: "#6b7280", opacity: 0.8 }}>
								Last Updated: {new Date(q.updatedAt).toLocaleString()}
							</p>
						</div>
						<div className="flex justify-end gap-2 mt-4">
							<button
								type="button"
								className="px-3 py-1 text-white rounded transition-all duration-200 hover:brightness-90 hover:scale-105"
								style={{ background: "#374151" }}
								onClick={() => {
									const href = templateId
										? `/template/questions?templateId=${encodeURIComponent(
											templateId,
										)}&questionId=${encodeURIComponent(q.id)}`
										: `/template/questions?questionId=${encodeURIComponent(q.id)}`;
									window.location.href = href;
								}}
							>
								Edit
							</button>
							<button
								type="button"
								className="px-3 py-1 text-white rounded transition-all duration-200 hover:brightness-90 hover:scale-105"
								style={{ background: "#ef4444" }}
								onClick={() => {
									if (!confirm("Are you sure you want to delete this question?")) return;
									setQuestions((prev) => prev.filter((x) => x.id !== q.id));
								}}
							>
								Delete
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default Route;