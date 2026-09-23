import { C as __toESM, t as require_jsx_runtime, y as require_react } from "../index.js";
import { t as Link } from "./link-xiHQ0wo4.js";
//#region app/admin/export/export-panel.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var exports = [
	{
		dataset: "overview",
		title: "Testoverblik",
		description: "Én række pr. tester med gennemførte pas, sæt og feedback."
	},
	{
		dataset: "training",
		title: "Træningsdata",
		description: "Alle planlagte pas og registrerede arbejdssæt."
	},
	{
		dataset: "feedback",
		title: "Feedbacksvar",
		description: "Alle sessionsevalueringer og afsluttende spørgeskemaer."
	}
];
function ExportPanel() {
	const [exportKey, setExportKey] = (0, import_react.useState)("");
	const [downloading, setDownloading] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	const download = async (dataset) => {
		setError("");
		setDownloading(dataset);
		try {
			const response = await fetch(`/api/admin/export?dataset=${dataset}`, {
				headers: { authorization: `Bearer ${exportKey}` },
				cache: "no-store"
			});
			if (!response.ok) {
				const payload = await response.json().catch(() => null);
				throw new Error(payload?.error ?? "Eksporten kunne ikke hentes.");
			}
			const blob = await response.blob();
			const filename = (response.headers.get("content-disposition") ?? "").match(/filename="([^"]+)"/)?.[1] ?? `base-${dataset}.csv`;
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = filename;
			document.body.appendChild(link);
			link.click();
			link.remove();
			URL.revokeObjectURL(url);
		} catch (downloadError) {
			setError(downloadError instanceof Error ? downloadError.message : "Eksporten kunne ikke hentes.");
		} finally {
			setDownloading(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "export-shell",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				className: "export-back",
				href: "/",
				children: "← Til BASE"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow",
				children: "INTERN TESTADMINISTRATION"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Eksportér testdata." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "lede",
				children: "Download pseudonymiserede testdata som CSV-filer, der kan åbnes direkte i Excel eller Google Sheets."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "export-key-field",
				children: ["EKSPORTNØGLE", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "password",
					value: exportKey,
					onChange: (event) => setExportKey(event.target.value),
					autoComplete: "current-password",
					placeholder: "Indtast din private nøgle"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "export-options",
				children: exports.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "export-option",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: item.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: item.description })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: exportKey.length < 24 || downloading !== null,
						onClick: () => download(item.dataset),
						children: downloading === item.dataset ? "Henter…" : "Download CSV"
					})]
				}, item.dataset))
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "export-error",
				role: "alert",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "export-privacy",
				children: "Nøglen gemmes ikke i browseren. Eksporterne indeholder tester-ID, men ingen navne eller urdata."
			})
		]
	});
}
//#endregion
export { ExportPanel };
