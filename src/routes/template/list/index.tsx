import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import whyUsColorScheme from "../../../theme/whyUsColorScheme.json";

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

interface Template {
	id: string;
	assessmentTemplateName: string;
	lastUpdated: string;
}

interface ModalData {
	templateId?: string;
	templateName?: string;
	lastUpdated?: string;
}

export const Route = createFileRoute("/template/list/")({
	component: AssessmentTemplateListPage,
});

export default Route;

function AssessmentTemplateListPage() {
	//const [templates, setTemplateDetails] = useState<AssessmentTemplate[]>([]);
	//interface Template {
	//	assessmentTemplateName: string;
	//	lastUpdated: string;
	//}

	const [templateDetails, setTemplateDetails] = useState<
		Template[]
	>([]);
	const [modal, setModal] = useState<null | {
		type: "template" | "api";
		data: {
			templateId?: string;
			templateName?: string;
			lastUpdated?: string;
		}
	}>(null);
	const [sortKey, setSortKey] = useState<"ageBand" | "lastUpdated">("ageBand");
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
	const navigate = useNavigate();

	// Load template details from localStorage on mount
	useEffect(() => {
		const stored = localStorage.getItem("templateDetails");
		if (stored) {
			setTemplateDetails(JSON.parse(stored));
		}
	}, []);

	// Delete a template from localStorage
	const handleDeleteTemplate = (lastUpdated: string) => {
		if (window.confirm("Are you sure you want to delete this template?")) {
			const updated = templateDetails.filter(
				(q) => q.lastUpdated !== lastUpdated,
			)
			setTemplateDetails(updated);
			localStorage.setItem("templateDetails", JSON.stringify(updated));
		}
	}

	useEffect(() => {
		fetchTemplates();
	}, []);

	const fetchTemplates = async () => {
		try {
			const response = await fetch(
				"https://68b598e2e5dc090291af94cd.mockapi.io/template/assessment",
			)
			const data = await response.json();

			console.log("API Response:", data); // Debug log
			console.log("First item:", data[0]); // Debug log

			if (Array.isArray(data) && data.length > 0) {
				setTemplateDetails(data);
			} else {
				setTemplateDetails([]);
			}
		} catch (err) {
			console.error("Error fetching templates", err);
			setTemplateDetails([]);
		}
	}

	const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const key = e.target.value as "ageBand" | "lastUpdated";
		setSortKey(key);
		sortTemplates(key, sortDirection);
	}

	const toggleSortDirection = () => {
		const newDirection = sortDirection === "asc" ? "desc" : "asc";
		setSortDirection(newDirection);
		sortTemplates(sortKey, newDirection);
	}

	const sortTemplates = (key: "ageBand" | "lastUpdated", direction: "asc" | "desc") => {
		const sorted = [...templateDetails].sort((a, b) => {
			if (key === "ageBand") {
				const getAgeBand = (name: string) => {
					const lastDigit = parseInt(name.slice(-1));
					if (lastDigit === 0) return 0;
					if (lastDigit === 1) return 1;
					if (lastDigit === 2) return 2;
					if (lastDigit === 3) return 3;
					return 4;
				};
				const bandA = getAgeBand(a.assessmentTemplateName);
				const bandB = getAgeBand(b.assessmentTemplateName);
				return direction === "asc" ? bandA - bandB : bandB - bandA;
			} else {
				const comparison = new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
				return direction === "asc" ? -comparison : comparison;
			}
		});
		setTemplateDetails(sorted);
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
					Assessment Templates
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
					<div className="flex items-center gap-2">
						<select
							id="sort-select"
							value={sortKey}
							onChange={handleSortChange}
							style={{
								padding: "9px 22px",
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
							<option value="ageBand">Age Band</option>
							<option value="lastUpdated">Last Updated</option>
						</select>
						<button
							onClick={toggleSortDirection}
							className="p-2 rounded transition-all duration-200 hover:scale-105"
							style={{
								background: whyUs.cardBg,
								border: `2px solid ${whyUs.cardTitle}`,
								color: whyUs.cardTitle,
								fontSize: "1.2rem",
								lineHeight: 1,
								width: "36px",
								height: "36px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center"
							}}
						>
							{sortDirection === "asc" ? "↓" : "↑"}
						</button>
					</div>
					<button
						type="button"
						onClick={() => navigate({ to: "/template/questions/new" })}
						className="px-4 py-2 rounded text-white font-semibold transition-all duration-200 hover:brightness-90 hover:scale-105"
						style={{ background: whyUs.cardTitle, marginLeft: 16 }}
					>
						+ Create New Template
					</button>
				</div>
			</div>

			{/* Template Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{/* Render templates from localStorage first */}
				{templateDetails.map((q) => (
					<button
						key={q.lastUpdated + q.assessmentTemplateName}
						type="button"
						className="rounded shadow-lg p-4 flex flex-col justify-between cursor-pointer text-left"
						style={{
							background: "#ffffff", // White background
							boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)", // Subtle shadow
							borderRadius: "16px", // Rounded corners
							transition:
								"transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
							transform: "scale(1)",
							border: "1px solid #000000", // Black border
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
						onClick={() =>
							setModal({
								type: "template",
								data: {
									templateId: q.id,
									templateName: q.assessmentTemplateName,
									lastUpdated: q.lastUpdated,
								},
							})
						}
					>
						<div>
							<h2
								className="text-xl font-bold mb-2"
								style={{ color: "#374151" }} // Dark gray text for contrast
							>
								{q.assessmentTemplateName}
							</h2>
							<p className="text-sm" style={{ color: "#6b7280", opacity: 0.8 }}>
								Last updated: {new Date(q.lastUpdated).toLocaleDateString()} {new Date(q.lastUpdated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second: '2-digit', hour12: false})}
							</p>
							<p className="text-sm" style={{ color: "#4B5563" }}>
								Age Band: {(() => {
									const lastDigit = parseInt(q.assessmentTemplateName.slice(-1));
									if (lastDigit === 0) return "0-3";
									if (lastDigit === 1) return "3-5";
									if (lastDigit === 2) return "6-8";
									if (lastDigit === 3) return "9-12";
									return "13+";
								})()}
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
									e.stopPropagation()
									handleDeleteTemplate(q.lastUpdated);
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
							setModal(null)
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
						onKeyDown={(e) => e.stopPropagation()}
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
								border: `1.5px solid ${whyUs.deleteButton || "#ef4444"}`,
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
								e.currentTarget.style.background = whyUs.deleteButton || "#ef4444";
								e.currentTarget.style.color = whyUs.cardText;
								e.currentTarget.style.border = `1.5px solid ${whyUs.contactBg}`;
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.background = "transparent";
								e.currentTarget.style.color = whyUs.cardText;
								e.currentTarget.style.border = `1.5px solid ${whyUs.deleteButton || "#ef4444"}`;
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
								{modal.data.templateName}
							</h2>
							<p style={{ color: "#888", marginBottom: 24 }}>
								{modal.data.lastUpdated && 
									`Last updated: ${new Date(modal.data.lastUpdated).toLocaleDateString()} ${new Date(modal.data.lastUpdated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second: '2-digit', hour12: false})}`}
							</p>
							<button
								onClick={() => {
									const path = `/template/questions/list?templateId=${modal.data.templateId}`;
									window.location.href = path;
									setModal(null);
								}}
								className="mt-4 px-6 py-3 rounded-lg text-white font-semibold transition-all duration-200 hover:brightness-90 hover:scale-105"
								style={{
									background: whyUs.cardTitle,
									boxShadow: `0 4px 12px ${whyUs.cardShadow}`,
									cursor: "pointer",
								}}
							>
								Open Assessment Template
							</button>
						</div>
					</div>
				</dialog>
			)}
		</div>
	)
}
