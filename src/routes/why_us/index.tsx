import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";

import whyUsIcons from "../../icons/whyUsIcons.json";
import staticText from "../../text/staticText.json";
import whyUsColorSchemeJson from "../../theme/whyUsColorScheme.json";

export const Route = createFileRoute("/why_us/")({
	component: WhyUsPage,
});

const cardData = whyUsIcons;

const whyUsColorScheme = whyUsColorSchemeJson as {
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

function WhyUsPage() {
	const [hovered, setHovered] = useState<number | null>(null);
	const router = useRouter();

	return (
		<div
			className="min-h-screen flex flex-col"
			style={{
				background: `linear-gradient(to bottom, ${whyUsColorScheme.backgroundGradientFrom}, ${whyUsColorScheme.backgroundGradientTo})`,
			}}
		>
			{/* Top Bar */}
			<header
				className="py-4 px-6 flex items-center"
				style={{ background: whyUsColorScheme.topBar }}
			>
				<span className="text-white text-xl font-semibold">Logo</span>
			</header>

			{/* WHY US Title */}
			<section className="text-center my-10">
				<h2
					className="text-5xl font-bold"
					style={{ color: whyUsColorScheme.title }}
				>
					{staticText.whyUsTitle}
				</h2>
			</section>

			{/* Cards */}
			<section className="flex justify-center items-start gap-10 px-8 flex-wrap grow">
				{cardData.map((card, index) => (
					<div
						key={card.title}
						className={`rounded-2xl text-center p-10 w-96 h-[380px] flex flex-col items-center justify-start transition-transform duration-300 ${
							hovered === index ? "scale-105" : ""
						}`}
						style={{
							background: "transparent",
							boxShadow: "none",
							border: `2px solid ${whyUsColorScheme.cardShadow}`,
							cursor: card.title === "REGISTER" ? "pointer" : undefined,
						}}
						onMouseEnter={() => setHovered(index)}
						onMouseLeave={() => setHovered(null)}
						onClick={() => {
							if (card.title === "REGISTER") {
								router.navigate({ to: "/signup" });
							}
						}}
						onKeyUp={(e) => {
							if (
								card.title === "REGISTER" &&
								(e.key === "Enter" || e.key === " ")
							) {
								router.navigate({ to: "/signup" });
							}
						}}
						tabIndex={card.title === "REGISTER" ? 0 : undefined}
						role={card.title === "REGISTER" ? "button" : undefined}
					>
						<div className="text-6xl mb-6 transition-transform duration-200 flex justify-center">
							<img
								src={hovered === index ? card.hoverIcon : card.icon}
								alt={`${card.title} icon`}
								style={{ width: 80, height: 80 }}
							/>
						</div>
						<h3
							className="font-bold text-xl mb-3"
							style={{ color: whyUsColorScheme.cardTitle }}
						>
							{card.title}
						</h3>
						<p
							className="text-base"
							style={{ color: whyUsColorScheme.cardText }}
						>
							{card.description}
						</p>
					</div>
				))}
			</section>

			{/* Contact Section */}
			<footer
				className="px-8 py-8 text-center mt-auto"
				style={{ background: whyUsColorScheme.contactBg }}
			>
				<h3
					className="font-bold text-lg mb-2"
					style={{ color: whyUsColorScheme.contactTitle }}
				>
					{staticText.contactTitle}
				</h3>
				<p style={{ color: whyUsColorScheme.contactText }}>
					{staticText.contactPhone}
				</p>
				<p style={{ color: whyUsColorScheme.contactText }}>
					{staticText.contactAddress}
				</p>
			</footer>
		</div>
	);
}

export default WhyUsPage;
