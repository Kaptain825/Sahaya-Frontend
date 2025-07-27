import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import staticText from "../../../text/staticText.json";
import whyUsColorSchemeJson from "../../../theme/whyUsColorScheme.json";

interface ColorScheme {
	background: string;
	cardTop: string;
	cardBody: string;
	primary: string;
	primaryHover: string;
	textMain: string;
	link: string;
}

const colorScheme = whyUsColorSchemeJson as {
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
	const [isScrolling, setIsScrolling] = useState(false);
	const navigate = useNavigate();
	const scrollRef = useRef<HTMLDivElement>(null);

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
			fetchQuestions();
		}
	};

	const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const key = e.target.value as "challengeType" | "updatedAt";
		setSortKey(key);
		const sorted = [...questions].sort((a, b) => a[key].localeCompare(b[key]));
		setQuestions(sorted);
	};

	// Overlay logic for scroll
	const handleScroll = () => {
		if (scrollRef.current) {
			const { scrollTop } = scrollRef.current;
			setIsScrolling(scrollTop > 0);
		}
	};

	return (
		<div
			className="min-h-screen p-6"
			style={{
				background: `linear-gradient(135deg, ${colorScheme.backgroundGradientFrom} 0%, ${colorScheme.backgroundGradientTo} 100%)`,
			}}
		>
			{/* Header */}
			<div className="flex justify-between items-center mb-6">
				<h1
					className="text-3xl font-bold"
					style={{ color: colorScheme.cardTitle }}
				>
					Assessment Questions
				</h1>
				<button
					type="button"
					onClick={() => navigate({ to: "/template/list/new" })}
					className="px-4 py-2 rounded text-white font-semibold transition-all duration-200 ease-in-out"
					style={{ background: colorScheme.cardTitle }}
					onMouseEnter={(e) => {
						e.currentTarget.style.background = "#176a3c";
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.background = colorScheme.cardTitle;
					}}
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
			<div className="relative">
				<div
					ref={scrollRef}
					onScroll={handleScroll}
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto"
					style={{ maxHeight: "60vh" }}
				>
					{questions.map((q) => (
						<div
							key={q.id}
							className="rounded shadow-lg p-4 flex flex-col justify-between transition-all duration-200 ease-in-out hover:shadow-2xl hover:scale-[1.01] cursor-pointer border-2 border-black"
							style={{ background: colorScheme.cardBg }}
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
									className="px-3 py-1 text-white rounded transition-all duration-200 ease-in-out"
									style={{ background: "#4a90e2" }}
									onMouseEnter={(e) => {
										e.currentTarget.style.background = "#276bb7";
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.background = "#4a90e2";
									}}
								>
									Edit
								</button>
								<button
									type="button"
									onClick={() => handleDelete(q.id)}
									className="px-3 py-1 text-white rounded transition-all duration-200 ease-in-out"
									style={{ background: "#e94e4e" }}
									onMouseEnter={(e) => {
										e.currentTarget.style.background = "#b93838";
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.background = "#e94e4e";
									}}
								>
									Delete
								</button>
							</div>
						</div>
					))}
				</div>
				{isScrolling && (
					<div className="absolute inset-0 pointer-events-none transition-all duration-300 bg-black bg-opacity-20" />
				)}
			</div>
		</div>
	);
}
