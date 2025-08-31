import { materialRenderers } from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import childInfoSchema from "../../../schema/childInfoFormSchema.json";
import childInfoUiSchema from "../../../schema/childInfoUiSchema.json";
import staticText from "../../../text/staticText.json";
import colorSchemeJson from "../../../theme/whyUsColorScheme.json";

interface ColorScheme {
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
	contactTitleDark: string;
	contactText: string;
	deleteButton: string;
	textline: string;
	primaryHover: string;
	primary: string;
	cardTop: string;
	textMain: string;
	cardBody: string;
}

const colorScheme = colorSchemeJson as ColorScheme;

interface ChildInfoFormData {
	name: string;
	gender: string;
	ageBand: string;
	challenges: string[];
}

export const Route = createFileRoute("/assessment/start/")({
	component: ChildInfoPage,
});

export default function ChildInfoPage() {
	const [formData, setFormData] = useState<ChildInfoFormData>({
		name: "",
		gender: "",
		ageBand: "",
		challenges: [],
	});
	const navigate = useNavigate();

	const handleChange = (data: Partial<ChildInfoFormData>) => {
		setFormData((prevData) => ({
			...prevData,
			...data,
		}));
	};

	const handleSubmit = () => {
		if (
			formData.name &&
			formData.gender &&
			formData.ageBand &&
			formData.challenges.length > 0
		) {
			navigate({
				to: "/assessment/challenge",
				search: {
					name: formData.name,
					gender: formData.gender,
					ageBand: formData.ageBand,
					challenges: formData.challenges,
				},
			});
		} else {
			alert("Please complete all fields before continuing.");
		}
	};

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
			style={{
				background: `linear-gradient(120deg, ${colorScheme.backgroundGradientFrom}, ${colorScheme.backgroundGradientTo})`,
			}}
		>
			{/* Top Bar */}
			<div
				className="w-full flex items-center px-8 py-3"
				style={{ background: "#5A4E4E", minHeight: 60 }}
			>
				<span className="text-white text-lg font-bold">Sahaya</span>
			</div>

			<div className="flex-1 flex items-center justify-center w-full p-4">
				<div
					className="w-full bg-white rounded shadow-lg flex flex-col"
					style={{ maxWidth: 420 }}
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
							{staticText.firstAssessmentTitle}
						</h2>
						<p className="text-base" style={{ color: colorScheme.textMain }}>
							{staticText.firstAssessmentIntro}
						</p>
					</div>

					{/* Form Content */}
					<div
						className="p-8 flex flex-col"
						style={{ background: colorScheme.cardBody }}
					>
						<JsonForms
							schema={childInfoSchema}
							uischema={childInfoUiSchema}
							data={formData}
							renderers={materialRenderers}
							onChange={({ data }: { data: Partial<ChildInfoFormData> }) =>
								handleChange(data)
							}
						/>

						{/* Button */}
						<button
							type="button"
							onClick={handleSubmit}
							className="w-full mt-6 py-3 rounded text-white text-lg font-semibold transition-all duration-200"
							style={{ background: colorScheme.contactTitle }}
							onMouseOver={(e) => {
								e.currentTarget.style.background = colorScheme.contactTitleDark;
								e.currentTarget.style.transform = "scale(1.05)";
								e.currentTarget.style.boxShadow =
									"0 4px 8px rgba(0, 0, 0, 0.2)";
							}}
							onMouseOut={(e) => {
								e.currentTarget.style.background = colorScheme.contactTitle;
								e.currentTarget.style.transform = "scale(1)";
								e.currentTarget.style.boxShadow = "none";
							}}
							onFocus={handleButtonHover}
							onBlur={handleButtonOut}
						>
							Continue
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
