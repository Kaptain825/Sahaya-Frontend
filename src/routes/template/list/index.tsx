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
	const [sortKey, setSortKey] = useState<"challengeType" | "updatedAt">(
		"challengeType",
	);
	const navigate = useNavigate();

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
					onClick={() => navigate({ to: "/assessment/challenge" })}
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
				{questions.map((q) => (
					<div
						key={q.id}
						className="rounded shadow-lg p-4 flex flex-col justify-between"
						style={{ background: colorScheme.cardBody }}
					>
						<div>
							<h2 className="text-xl font-bold mb-2 text-gray-900">
								{q.questionText}
							</h2>
							<p className="text-sm text-gray-600">
								Challenge: {q.challengeType}
							</p>
							<p className="text-sm text-gray-500">
								Last updated: {new Date(q.updatedAt).toLocaleString()}
							</p>
						</div>

						<div className="flex justify-end gap-2 mt-4">
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
					</div>
				))}
			</div>
		</div>
	);
}
