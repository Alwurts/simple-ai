import type { SVGProps } from "react";

export const LogoAlwurtsMonochrome = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			width="400"
			height="400"
			viewBox="0 -60 321 321"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<title
				style={{
					position: "absolute",
					width: "1px",
					height: "1px",
					padding: "0",
					margin: "-1px",
					overflow: "hidden",
					clip: "rect(0, 0, 0, 0)",
					whiteSpace: "nowrap",
					borderWidth: 0,
				}}
			>
				Alwurts
			</title>
			<rect
				x="242"
				y="21"
				width="39.2372"
				height="94.4799"
				rx="19.6186"
				transform="rotate(-28 242 21)"
				fill="currentColor"
			/>
			<rect
				x="153"
				y="20.4207"
				width="41.1057"
				height="205.989"
				rx="20.5528"
				transform="rotate(-28 153 20.4207)"
				fill="currentColor"
			/>
			<rect
				x="61"
				y="19.2979"
				width="41.1057"
				height="205.989"
				rx="20.5528"
				transform="rotate(-28 61 19.2979)"
				fill="currentColor"
			/>
			<path d="M75 92.5L54 55.5L0 194H34.5L49 159.5H108L93 129H60L75 92.5Z" fill="currentColor" />
		</svg>
	);
};
