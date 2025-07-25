import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import staticText from "../../../text/staticText.json";
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
	const [questions, setQuestions] = useState<AssessmentQuestion[]>([
		{
			id: "1",
			questionText: "What is the child's preferred communication method?",
			challengeType: "Communication",
			createdBy: "admin",
			updatedAt: new Date().toISOString(),
		},
		{
			id: "2",
			questionText: "Does the child require assistance with mobility?",
			challengeType: "Mobility",
			createdBy: "admin",
			updatedAt: new Date(Date.now() - 86400000).toISOString(),
		},
		{
			id: "3",
			questionText: "Is the child sensitive to loud noises?",
			challengeType: "Sensory",
			createdBy: "admin",
			updatedAt: new Date(Date.now() - 3600000).toISOString(),
		},
	]);
	const [templateQuestions, setTemplateQuestions] = useState<any[]>([]);
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
				// Keep fake data if API returns empty
				setQuestions([
					{
						id: "1",
						questionText: "What is the child's preferred communication method?",
						challengeType: "Communication",
						createdBy: "admin",
						updatedAt: new Date().toISOString(),
					},
					{
						id: "2",
						questionText: "Does the child require assistance with mobility?",
						challengeType: "Mobility",
						createdBy: "admin",
						updatedAt: new Date(Date.now() - 86400000).toISOString(),
					},
					{
						id: "3",
						questionText: "Is the child sensitive to loud noises?",
						challengeType: "Sensory",
						createdBy: "admin",
						updatedAt: new Date(Date.now() - 3600000).toISOString(),
					},
				]);
			}
		} catch (err) {
			console.error("Error fetching questions", err);
			// Show fake data on error
			setQuestions([
				{
					id: "1",
					questionText: "What is the child's preferred communication method?",
					challengeType: "Communication",
					createdBy: "admin",
					updatedAt: new Date().toISOString(),
				},
				{
					id: "2",
					questionText: "Does the child require assistance with mobility?",
					challengeType: "Mobility",
					createdBy: "admin",
					updatedAt: new Date(Date.now() - 86400000).toISOString(),
				},
				{
					id: "3",
					questionText: "Is the child sensitive to loud noises?",
					challengeType: "Sensory",
					createdBy: "admin",
					updatedAt: new Date(Date.now() - 3600000).toISOString(),
				},
			]);
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
			style={{ background: colorScheme.background }}
		>
			{/* Header */}
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold text-white">Assessment Questions</h1>
				<button
					type="button"
					onClick={() => navigate({ to: "/template/list/new" })}
					className="px-4 py-2 rounded text-white font-semibold"
					style={{ background: colorScheme.primary }}
				>
					+ Create New Question
				</button>
			</div>

			{/* Sort Filter */}
			<div className="mb-4">
				<label htmlFor="sort-select" className="text-white mr-2">
					Sort by:
				</label>
				<select
					id="sort-select"
					value={sortKey}
					onChange={handleSortChange}
					className="p-2 rounded"
				>
					<option value="challengeType">Challenge</option>
					<option value="updatedAt">Last Updated</option>
				</select>
			</div>

			{/* Question Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{/* Render templateQuestions from localStorage first */}
				{templateQuestions.map((q, idx) => (
					<button
						key={q.createdAt + q.question}
						type="button"
						className="rounded shadow-lg p-4 flex flex-col justify-between cursor-pointer text-left"
						style={{ background: colorScheme.cardBody }}
						onClick={() => setModal({ type: "template", data: q })}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								setModal({ type: "template", data: q });
							}
						}}
					>
						<div>
							<h2 className="text-xl font-bold mb-2 text-gray-900">
								{q.question}
							</h2>
							<p className="text-sm text-gray-600">Challenge: {q.challenge}</p>
							<p className="text-sm text-gray-600">Age Band: {q.ageBand}</p>
							<p className="text-sm text-gray-500">
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
								onClick={(e) => {
									e.stopPropagation();
									alert("Edit for template questions not implemented yet.");
								}}
								className="px-3 py-1 text-white rounded"
								style={{ background: "#4a90e2" }}
							>
								Edit
							</button>
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									handleDeleteTemplate(q.createdAt);
								}}
								className="px-3 py-1 text-white rounded"
								style={{ background: "#e94e4e" }}
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
						style={{ background: colorScheme.cardBody }}
						onClick={() => setModal({ type: "api", data: q })}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								setModal({ type: "api", data: q });
							}
						}}
					>
						<div>
							<h2 className="text-xl font-bold mb-2 text-gray-900">
								{q.questionText}
							</h2>
							<p className="text-sm text-gray-600">
								Challenge: {q.challengeType}
							</p>
							{/* Age Band not available in API questions, show placeholder */}
							<p className="text-sm text-gray-600">
								Age Band: <span className="italic text-gray-400">N/A</span>
							</p>
							<p className="text-sm text-gray-500">
								Last updated: {new Date(q.updatedAt).toLocaleString()}
							</p>
						</div>
						<div
							className="flex justify-end gap-2 mt-4"
							onClick={(e) => e.stopPropagation()}
							onKeyUp={(e) => e.stopPropagation()}
						>
							<button
								type="button"
								onClick={() =>
									navigate({ to: `/assessment/questions/edit/${q.id}` })
								}
								className="px-3 py-1 text-white rounded"
								style={{ background: "#4a90e2" }}
							>
								Edit
							</button>
							<button
								type="button"
								onClick={() => handleDelete(q.id)}
								className="px-3 py-1 text-white rounded"
								style={{ background: "#e94e4e" }}
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
							background: colorScheme.cardBody,
							borderRadius: 18,
							minWidth: 340,
							maxWidth: 480,
							width: "90vw",
							boxShadow: `0 8px 32px 0 ${colorScheme.primary}33`,
							padding: 32,
							position: "relative",
							color: colorScheme.textMain,
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
								top: 12,
								right: 24,
								background: "transparent",
								border: `2px solid ${colorScheme.primary}`,
								fontSize: 22,
								fontWeight: 700,
								color: colorScheme.textMain,
								cursor: "pointer",
								borderRadius: 8,
								transition: "background 0.18s, color 0.18s, border 0.18s",
								padding: "2px 22px 2px 22px",
								minWidth: 56,
								minHeight: 36,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								letterSpacing: 2,
								zIndex: 10,
							}}
							onMouseEnter={(e) => {
								(e.currentTarget as HTMLButtonElement).style.background =
									"#e94e4e";
								(e.currentTarget as HTMLButtonElement).style.color = "#fff";
								(e.currentTarget as HTMLButtonElement).style.border =
									"2px solid #e94e4e";
							}}
							onMouseLeave={(e) => {
								(e.currentTarget as HTMLButtonElement).style.background =
									"transparent";
								(e.currentTarget as HTMLButtonElement).style.color =
									colorScheme.textMain;
								(e.currentTarget as HTMLButtonElement).style.border =
									`2px solid ${colorScheme.primary}`;
							}}
						>
							X
						</button>
						{/* Modal Content */}
						<div style={{ width: "100%", textAlign: "center", paddingTop: 56 }}>
							<h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 12 }}>
								{modal.type === "template"
									? modal.data.question +
										(modal.data.type === "text" ? " (100 words)" : "")
									: modal.data.questionText}
							</h2>
							<p
								style={{
									fontWeight: 500,
									color: colorScheme.primary,
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
									color: colorScheme.primary,
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
													background: "#f5f5f5",
													borderRadius: 8,
													padding: "8px 14px",
													marginBottom: 6,
													color: "#333",
													textAlign: "left",
													fontWeight: 500,
													border: `1.5px solid ${colorScheme.primary}22`,
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
