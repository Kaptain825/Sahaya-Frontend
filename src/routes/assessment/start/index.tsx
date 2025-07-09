import { materialRenderers } from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import childInfoSchema from "../../../schema/childInfoFormSchema.json";
import childInfoUiSchema from "../../../schema/childInfoUiSchema.json";
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

	const handleChange = (data: ChildInfoFormData) => {
		setFormData(data);
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
			style={{ background: colorScheme.background }}
		>
			{/* Top Bar */}
			<div
				className="w-full flex items-center px-8 py-3"
				style={{ background: "#5A4E4E", minHeight: 60 }}
			>
				<span className="text-white text-lg font-bold">Sahaya</span>
			</div>

			<div className="flex-1 flex items-center justify-center w-full">
				<div
					className="w-full bg-white rounded shadow-lg flex flex-col justify-center items-center"
					style={{ maxWidth: 420, minHeight: 520, aspectRatio: "3/4" }}
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

					{/* Card Body */}
					<div
						className="w-full px-8 py-8 rounded-b flex-1 flex flex-col justify-center"
						style={{ background: colorScheme.cardBody, paddingTop: 0 }}
					>
						<JsonForms
							schema={childInfoSchema}
							uischema={childInfoUiSchema}
							data={formData}
							renderers={materialRenderers}
							onChange={({ data }) => handleChange(data)}
						/>

						<button
							type="button"
							onClick={handleSubmit}
							className="w-full mt-4 py-3 rounded text-white text-lg font-semibold"
							style={{ background: colorScheme.primary }}
							onMouseOver={handleButtonHover}
							onFocus={handleButtonHover}
							onMouseOut={handleButtonOut}
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
