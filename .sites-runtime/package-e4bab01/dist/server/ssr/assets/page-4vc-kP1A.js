import { C as __toESM, t as require_jsx_runtime, y as require_react } from "../index.js";
import { c as trainingProfileOptions, d as exerciseFocusTags, f as exerciseLibrary, l as countProgramSets, n as getTrainingPlan, s as trainingProfileLabel, t as defaultSwimProfile, u as getWeekProgression } from "./swim-program-data-BEbEriBL.js";
//#region lib/health-data.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var healthProviderLabel = (provider) => provider === "apple_health" ? "Apple Health" : provider === "garmin" ? "Garmin" : "Sundhedsdata";
var healthTrendLabel = (trend) => ({
	up: "Opadgående",
	stable: "Stabil",
	down: "Nedadgående",
	insufficient: "Afventer 7-dages grundlag"
})[trend];
//#endregion
//#region lib/training-analytics.ts
var parseEffortRepCount = (value) => value.split("+").reduce((total, part) => total + (Number.parseFloat(part) || 0), 0);
var estimatedOneRepMax = (weight, reps, rir) => weight > 0 && reps > 0 ? weight * (1 + (reps + Math.max(0, rir)) / 30) : 0;
//#endregion
//#region app/athlete-dashboard.tsx
var import_jsx_runtime = require_jsx_runtime();
var formatKg = (value) => `${value.toLocaleString("da-DK")} kg`;
var formatIntensity = (value) => value === null ? "—" : `${value.toLocaleString("da-DK", { maximumFractionDigits: 1 })} %`;
function AthleteDashboard({ data, loading, onBack }) {
	const [selectedStrengthId, setSelectedStrengthId] = (0, import_react.useState)(null);
	const volumeProgress = data && data.summary.expectedVolumeKg > 0 ? Math.min(100, Math.round(data.summary.actualVolumeKg / data.summary.expectedVolumeKg * 100)) : 0;
	const selectedStrength = data?.strengthExercises.find((strength) => strength.id === selectedStrengthId) ?? data?.strengthExercises.find((strength) => strength.points.length > 0) ?? data?.strengthExercises[0];
	const maxPoint = Math.max(1, ...selectedStrength?.points.map((point) => point.estimated1Rm) ?? [1]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "screen athlete-dashboard enter",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "back",
				onClick: onBack,
				children: "← Tilbage"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow",
				children: "MIN UDVIKLING"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Din træning i tal." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "lede",
				children: "Følg arbejdet, se din styrke udvikle sig og brug tallene til bedre beslutninger."
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "dashboard-loading",
				children: "Henter din træningshistorik…"
			}) : !data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "dashboard-empty",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Ingen data endnu" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Gennemfør dit første planlagte pas for at starte dashboardet." })]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "dashboard-progress-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "TESTPERIODEN" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
							data.summary.completedSessions,
							" af ",
							data.summary.plannedSessions,
							" pas gennemført"
						] })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [volumeProgress, "%"] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "dashboard-progress-track",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { width: `${volumeProgress}%` } })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Andel af den forventede styrkevolumen, som er registreret." })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "dashboard-section-title",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "BELASTNING" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Forventet og faktisk" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "dashboard-comparison",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "FORVENTET VOLUMEN" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: formatKg(data.summary.expectedVolumeKg) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Samlet planlagt arbejde" })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "FAKTISK VOLUMEN" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: formatKg(data.summary.actualVolumeKg) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Vægt × udførte gentagelser" })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "FORVENTET INTENSITET" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: formatIntensity(data.summary.expectedIntensityPercent) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Gns. af estimeret 1RM" })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "FAKTISK INTENSITET" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: formatIntensity(data.summary.actualIntensityPercent) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Baseret på vægt, reps og RIR" })
						] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "dashboard-section-title",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "RELATIV STYRKE" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Udvikling i estimeret 1RM" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "strength-lift-selector",
					"aria-label": "Vælg hovedøvelse",
					children: data.strengthExercises.map((strength) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: selectedStrength?.id === strength.id ? "active" : "",
						onClick: () => setSelectedStrengthId(strength.id),
						type: "button",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: strength.exercise }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: strength.currentEstimated1Rm === null ? "Ingen data" : `${strength.currentEstimated1Rm.toLocaleString("da-DK", { maximumFractionDigits: 1 })} kg` })]
					}, strength.id))
				}),
				selectedStrength && selectedStrength.points.length > 0 && selectedStrength.currentEstimated1Rm !== null && selectedStrength.changePercent !== null && selectedStrength.relativeIndex !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "strength-history-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "strength-history-head",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: selectedStrength.exercise }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [selectedStrength.currentEstimated1Rm.toLocaleString("da-DK", { maximumFractionDigits: 1 }), " kg"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Aktuelt estimeret 1RM" })
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", {
								className: selectedStrength.changePercent >= 0 ? "positive" : "negative",
								children: [
									selectedStrength.changePercent >= 0 ? "+" : "",
									selectedStrength.changePercent.toLocaleString("da-DK", { maximumFractionDigits: 1 }),
									"%"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "strength-history-chart",
							"aria-label": `Historisk estimeret 1RM for ${selectedStrength.exercise}`,
							children: selectedStrength.points.map((point, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { height: `${Math.max(12, point.estimated1Rm / maxPoint * 100)}%` } }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: point.label })] }, `${point.label}-${index}`))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "strength-index-row",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Relativt styrkeindeks" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: selectedStrength.relativeIndex }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Første registrering = 100" })
							]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "dashboard-empty compact",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
						"Ingen data for ",
						selectedStrength?.exercise ?? "øvelsen",
						" endnu"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Historikken starter, når du logger et belastet sæt med reps og RIR." })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "dashboard-method-note",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Sådan regner BASE" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Estimeret 1RM beregnes med Epley-formlen ud fra vægt, gentagelser og registreret RIR. Tallene er træningsstøtte og ikke en maksimaltest." })]
				})
			] })
		]
	});
}
//#endregion
//#region app/exercise-alternatives.ts
var groups = [
	[
		"helkrop",
		"konkurrenceløft",
		"clean",
		"snatch",
		"jerk"
	],
	[
		"ben",
		"squat",
		"knæ",
		"lår",
		"hofte",
		"læg"
	],
	[
		"bagkæde",
		"dødløft",
		"hamstring",
		"glute",
		"ryg · kraft",
		"træk"
	],
	[
		"bryst",
		"bænk",
		"pres",
		"push-up",
		"dips"
	],
	[
		"ryg",
		"lat",
		"row",
		"pull-up",
		"trækstyrke"
	],
	[
		"skulder",
		"overhead",
		"lockout",
		"rotator"
	],
	[
		"core",
		"rotation",
		"anti-rotation",
		"bracing",
		"stabilitet"
	],
	[
		"eksplosiv",
		"sprint",
		"hop",
		"kast",
		"power"
	]
];
var text = (exercise) => `${exercise.name} ${exercise.target} ${exercise.category}`.toLocaleLowerCase("da-DK");
var muscleGroups = (exercise) => {
	const haystack = text(exercise);
	return groups.map((tokens, index) => tokens.some((token) => haystack.includes(token)) ? index : -1).filter((index) => index >= 0);
};
var definitionToSessionExercise = (exercise) => ({
	name: exercise.name,
	detail: `${exercise.sets} × ${exercise.reps}`,
	focus: exercise.cue,
	sets: Math.max(1, Number.parseInt(exercise.sets, 10) || 3),
	plannedReps: exercise.reps,
	defaultWeight: exercise.weight,
	tracking: exercise.format === "distance" ? "distance" : "load",
	restSeconds: exercise.format === "distance" ? 90 : 75,
	effortMetric: exercise.format === "distance" ? "heart_rate_zone" : "rir",
	effortTarget: exercise.format === "distance" ? "Pulszone 2–4" : "2–4 RIR",
	programRole: "assistance"
});
var median = (values, fallback) => {
	if (values.length === 0) return fallback;
	const sorted = [...values].sort((a, b) => a - b);
	const middle = Math.floor(sorted.length / 2);
	return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
};
var mostCommon = (values, fallback) => {
	const counts = /* @__PURE__ */ new Map();
	for (const value of values.filter(Boolean)) counts.set(value, (counts.get(value) ?? 0) + 1);
	return [...counts].sort((left, right) => right[1] - left[1])[0]?.[0] ?? fallback;
};
var roundedSessionWeight = (weight) => {
	const increment = weight < 40 ? .5 : 2.5;
	return Math.max(increment, Math.round(weight / increment) * increment);
};
var definitionToContextualSessionExercise = (exercise, session, replaced) => {
	const base = definitionToSessionExercise(exercise);
	const loadRatios = session.filter((item) => item.tracking !== "distance").flatMap((item) => {
		const definition = exerciseLibrary.find((candidate) => candidate.name === item.name);
		const libraryWeight = Number.parseFloat(definition?.weight ?? "0");
		const plannedWeight = Number.parseFloat(item.defaultWeight);
		return libraryWeight > 0 && plannedWeight > 0 ? [plannedWeight / libraryWeight] : [];
	});
	const intensityFactor = Math.min(1.35, Math.max(.65, median(loadRatios, 1)));
	const libraryWeight = Number.parseFloat(exercise.weight);
	const contextualWeight = exercise.format === "distance" || libraryWeight <= 0 ? exercise.weight : String(roundedSessionWeight(libraryWeight * intensityFactor));
	const comparable = session.filter((item) => item.tracking === base.tracking);
	const contextualSets = replaced?.sets ?? Math.max(1, Math.min(8, Math.round(median(comparable.map((item) => item.sets), base.sets))));
	const effortTarget = replaced?.effortTarget ?? mostCommon(comparable.map((item) => item.effortTarget ?? ""), base.effortTarget ?? "2–4 RIR");
	const restSeconds = replaced?.restSeconds ?? Math.round(median(comparable.map((item) => item.restSeconds ?? 0).filter((seconds) => seconds > 0), base.restSeconds ?? 75));
	return {
		...base,
		sets: contextualSets,
		detail: `${contextualSets} × ${base.plannedReps}`,
		defaultWeight: contextualWeight,
		effortTarget,
		restSeconds,
		programRole: replaced?.programRole ?? "assistance"
	};
};
var availableSessionExercises = (profile) => exerciseLibrary.filter((exercise) => exercise.visibility !== "coach_only" && (!exercise.sports?.length || exercise.sports.includes(profile)));
var fiveExerciseAlternatives = (current, profile) => {
	const source = exerciseLibrary.find((exercise) => exercise.name === current.name);
	const currentGroups = source ? muscleGroups(source) : [];
	return availableSessionExercises(profile).filter((exercise) => exercise.name !== current.name && exercise.format === "distance" === (current.tracking === "distance")).map((exercise) => {
		const groupMatches = muscleGroups(exercise).filter((group) => currentGroups.includes(group)).length;
		const categoryMatch = source?.category === exercise.category ? 1 : 0;
		return {
			exercise,
			score: groupMatches * 10 + categoryMatch * 4 + (exercise.sports?.includes(profile) ? 2 : 0)
		};
	}).filter((item) => currentGroups.length === 0 || item.score >= 10).sort((a, b) => b.score - a.score || a.exercise.name.localeCompare(b.exercise.name, "da")).slice(0, 5).map(({ exercise }) => exercise);
};
//#endregion
//#region app/exercise-videos.ts
var exerciseVideos = {
	"Snatch": {
		youtubeId: "1Lv1IyigIUY",
		source: "Catalyst Athletics",
		sourceUrl: "https://www.catalystathletics.com/exercise/58/Snatch/"
	},
	"Clean & Jerk": {
		youtubeId: "bNCXgyosXlc",
		source: "Catalyst Athletics",
		sourceUrl: "https://www.catalystathletics.com/exercise/76/Clean-Jerk/"
	},
	"Front squat": {
		youtubeId: "Q1R0_CbgHpc",
		source: "Catalyst Athletics",
		sourceUrl: "https://www.catalystathletics.com/exercise/78/Front-Squat/"
	},
	"Power snatch": {
		youtubeId: "ydHHsju1-Nc",
		source: "Catalyst Athletics",
		sourceUrl: "https://www.catalystathletics.com/exercise/61/Power-Snatch/"
	},
	"Hang snatch": {
		youtubeId: "Php-RclQ1yU",
		source: "Catalyst Athletics",
		sourceUrl: "https://www.catalystathletics.com/exercise/63/Hang-Snatch/"
	},
	"Snatch pull": {
		youtubeId: "G1QygZ3Kd3w",
		source: "Catalyst Athletics",
		sourceUrl: "https://www.catalystathletics.com/exercise/97/Snatch-Pull/"
	},
	"Overhead squat": {
		youtubeId: "m_fvfJi94D8",
		source: "Catalyst Athletics",
		sourceUrl: "https://www.catalystathletics.com/exercise/79/Overhead-Squat/"
	},
	"Clean pull": {
		youtubeId: "xx8WkFrST2Y",
		source: "Catalyst Athletics",
		sourceUrl: "https://www.catalystathletics.com/exercise/98/Clean-Pull/"
	},
	"Back squat": {
		youtubeId: "Akd5xmZlsvg",
		source: "Catalyst Athletics",
		sourceUrl: "https://www.catalystathletics.com/exercise/77/Back-Squat/"
	},
	"Strict press": {
		youtubeId: "_cfNP_VXs_U",
		source: "Catalyst Athletics",
		sourceUrl: "https://www.catalystathletics.com/exercise/90/Press/"
	},
	"Romanian deadlift": {
		youtubeId: "_U9KjljQyd0",
		source: "Catalyst Athletics",
		sourceUrl: "https://www.catalystathletics.com/exercise/101/Romanian-Deadlift-RDL/"
	}
};
var youtubeExerciseSearchUrl = (exerciseName) => `https://www.youtube.com/results?search_query=${encodeURIComponent(`${exerciseName} olympic weightlifting exercise demonstration`)}`;
//#endregion
//#region app/feedback-form.tsx
var sessionAreas = [
	"Dagens træning",
	"Readiness",
	"Anbefaling",
	"Træningslog",
	"Øvelsesbibliotek"
];
function FeedbackForm({ kind, onBack, onDone }) {
	const [role, setRole] = (0, import_react.useState)("athlete");
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	async function submitFeedback(event) {
		event.preventDefault();
		setSubmitting(true);
		setError("");
		const formData = new FormData(event.currentTarget);
		const answers = {};
		for (const [key, rawValue] of formData.entries()) {
			if ([
				"testerId",
				"role",
				"website"
			].includes(key)) continue;
			const value = String(rawValue).trim();
			if (!value) continue;
			const existing = answers[key];
			if (existing) answers[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
			else answers[key] = value;
		}
		try {
			const response = await fetch("/api/feedback", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					kind,
					testerId: String(formData.get("testerId") ?? "").trim().toUpperCase(),
					role,
					answers,
					website: String(formData.get("website") ?? "")
				})
			});
			if (!response.ok) {
				const payload = await response.json().catch(() => null);
				throw new Error(payload?.error ?? "Dit svar kunne ikke gemmes.");
			}
			onDone();
		} catch (submitError) {
			setError(submitError instanceof Error ? submitError.message : "Dit svar kunne ikke gemmes. Prøv igen.");
			setSubmitting(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "screen feedback-screen enter",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "back",
				type: "button",
				onClick: onBack,
				children: "← Tilbage"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow",
				children: kind === "session" ? "TESTFEEDBACK · 1 MIN" : "AFSLUTTENDE EVALUERING · 5–7 MIN"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: kind === "session" ? "Hvordan fungerede BASE i dag?" : "Hvordan var testperioden?" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "lede",
				children: kind === "session" ? "Svar umiddelbart efter træningen. Vi tester produktet – ikke dig." : "Din samlede vurdering hjælper os med at vælge, hvad vi skal bygge som det næste."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submitFeedback,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
						className: "form-section",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", { children: "Om din test" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "field-label",
								htmlFor: `${kind}-tester-id`,
								children: "Tester-ID"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "text-input",
								id: `${kind}-tester-id`,
								name: "testerId",
								placeholder: "Fx A1 eller T1",
								minLength: 2,
								maxLength: 12,
								pattern: "[A-Za-z0-9ÆØÅæøå-]+",
								autoComplete: "off",
								required: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "field-hint",
								children: "Brug det ID, du har fået af testlederen – ikke dit navn."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "field-label",
								children: "Din rolle"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "choice-row two-columns",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
									name: "role",
									value: "athlete",
									label: "Atlet",
									checked: role === "athlete",
									onChange: () => setRole("athlete")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
									name: "role",
									value: "coach",
									label: "Træner",
									checked: role === "coach",
									onChange: () => setRole("coach")
								})]
							})
						]
					}),
					kind === "session" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionQuestions, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinalQuestions, { role }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "honeypot",
						name: "website",
						tabIndex: -1,
						autoComplete: "off",
						"aria-hidden": "true"
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "form-error",
						role: "alert",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "privacy-note",
						children: "Kun dit tester-ID, din rolle og dine svar gemmes."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "primary submit-feedback",
						type: "submit",
						disabled: submitting,
						children: submitting ? "Gemmer svar…" : "Send feedback"
					})
				]
			})
		]
	});
}
function SessionQuestions() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
			className: "form-section",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", { children: "Dagens brug" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "field-label",
					children: "Hvad brugte du i dag?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "check-grid",
					children: sessionAreas.map((area) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "check-choice",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							name: "usedAreas",
							value: area
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: area })]
					}, area))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChoiceQuestion, {
					name: "completion",
					label: "Kunne du gennemføre det, du ville?",
					options: [
						"Ja, uden hjælp",
						"Ja, med lidt hjælp",
						"Delvist",
						"Nej"
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
			className: "form-section",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", { children: "Din oplevelse" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScaleQuestion, {
					name: "ease",
					label: "Hvor let var BASE at bruge?",
					low: "Meget svært",
					high: "Meget let"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScaleQuestion, {
					name: "clarity",
					label: "Hvor tydeligt var næste skridt?",
					low: "Meget uklart",
					high: "Meget tydeligt"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScaleQuestion, {
					name: "trust",
					label: "Hvor meget stolede du på anbefalingen?",
					low: "Slet ikke",
					high: "I høj grad"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
			className: "form-section",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", { children: "Med dine egne ord" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextQuestion, {
					name: "mostUseful",
					label: "Hvad var mest nyttigt i dag?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextQuestion, {
					name: "friction",
					label: "Var noget uklart, irriterende eller langsomt?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextQuestion, {
					name: "missing",
					label: "Hvad manglede du?"
				})
			]
		})
	] });
}
function FinalQuestions({ role }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
			className: "form-section",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", { children: "Samlet vurdering" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "field-label",
					htmlFor: "sessions-used",
					children: "Hvor mange gange brugte du BASE?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "text-input compact-input",
					id: "sessions-used",
					name: "sessionsUsed",
					type: "number",
					min: "1",
					max: "30",
					inputMode: "numeric",
					required: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScaleQuestion, {
					name: "overallEase",
					label: "Hvor let var BASE samlet set at bruge?",
					low: "Meget svært",
					high: "Meget let"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScaleQuestion, {
					name: "overallValue",
					label: "Hvor stor værdi gav BASE dig?",
					low: "Ingen værdi",
					high: "Meget stor værdi"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScaleQuestion, {
					name: "overallTrust",
					label: "Hvor troværdige var anbefalingerne?",
					low: "Utroværdige",
					high: "Meget troværdige"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChoiceQuestion, {
					name: "mostValuableFeature",
					label: "Hvilken funktion gav mest værdi?",
					options: [
						"Dagens plan",
						"Readiness",
						"Anbefaling",
						"Træningslog",
						"Øvelsesbibliotek"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChoiceQuestion, {
					name: "comparison",
					label: "Hvordan var BASE sammenlignet med din nuværende løsning?",
					options: [
						"Meget bedre",
						"Lidt bedre",
						"Cirka det samme",
						"Lidt dårligere",
						"Meget dårligere"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChoiceQuestion, {
					name: "weeklyUse",
					label: "Ville du bruge BASE hver uge?",
					options: [
						"Helt sikkert",
						"Sandsynligvis",
						"Måske",
						"Sandsynligvis ikke",
						"Slet ikke"
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
			className: "form-section role-section",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", { children: role === "athlete" ? "Som atlet" : "Som træner" }), role === "athlete" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScaleQuestion, {
					name: "readinessHelp",
					label: "Hjalp readiness-tjekket dig med at vurdere dagens træning?",
					low: "Slet ikke",
					high: "I høj grad"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScaleQuestion, {
					name: "loadFit",
					label: "Passede den anbefalede belastning til din dagsform?",
					low: "Slet ikke",
					high: "Meget godt"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChoiceQuestion, {
					name: "loggingDistraction",
					label: "Forstyrrede registreringen selve træningen?",
					options: [
						"Nej",
						"Lidt",
						"En del",
						"Meget"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextQuestion, {
					name: "loggingImprovement",
					label: "Hvad skulle gøre træningsloggen lettere?"
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScaleQuestion, {
					name: "coachOverview",
					label: "Gav BASE et tydeligt billede af atletens plan og status?",
					low: "Slet ikke",
					high: "I høj grad"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChoiceQuestion, {
					name: "coachSupport",
					label: "Hvordan påvirkede anbefalingerne din faglige vurdering?",
					options: [
						"Understøttede meget",
						"Understøttede lidt",
						"Hverken eller",
						"Forstyrrede lidt",
						"Forstyrrede meget"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextQuestion, {
					name: "coachMissingInfo",
					label: "Hvilke oplysninger manglede du?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextQuestion, {
					name: "responsibility",
					label: "Hvordan bør ansvaret fordeles mellem atlet, træner og BASE?"
				})
			] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
			className: "form-section",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", { children: "Det vigtigste næste skridt" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextQuestion, {
					name: "leastValuable",
					label: "Hvilken funktion gav mindst værdi – og hvorfor?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextQuestion, {
					name: "priorityChange",
					label: "Hvad er den vigtigste ændring, vi bør lave først?",
					required: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextQuestion, {
					name: "retentionReason",
					label: "Hvad ville få dig til at bruge BASE fast?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextQuestion, {
					name: "additionalFeedback",
					label: "Er der andet, vi bør vide?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChoiceQuestion, {
					name: "followUp",
					label: "Må vi kontakte dig til en 15-minutters samtale?",
					options: ["Ja", "Nej"]
				})
			]
		})
	] });
}
function ScaleQuestion({ name, label, low, high }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "question-block",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "field-label",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "feedback-scale",
				role: "radiogroup",
				"aria-label": label,
				children: [
					1,
					2,
					3,
					4,
					5
				].map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "radio",
					name,
					value,
					required: true
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: value })] }, value))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "scale-labels",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: low }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: high })]
			})
		]
	});
}
function ChoiceQuestion({ name, label, options }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "question-block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "field-label",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "choice-stack",
			role: "radiogroup",
			"aria-label": label,
			children: options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
				name,
				value: option,
				label: option
			}, option))
		})]
	});
}
function Choice({ name, value, label, checked, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "radio-choice",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "radio",
			name,
			value,
			checked,
			onChange,
			required: true
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label })]
	});
}
function TextQuestion({ name, label, required = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "question-block field-label",
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
			className: "text-area",
			name,
			rows: 3,
			maxLength: 1e3,
			required
		})]
	});
}
//#endregion
//#region app/training-days.ts
var trainingWeekdays = [
	"MANDAG",
	"TIRSDAG",
	"ONSDAG",
	"TORSDAG",
	"FREDAG",
	"LØRDAG",
	"SØNDAG"
];
var defaultTrainingDays = [
	"MANDAG",
	"ONSDAG",
	"LØRDAG"
];
var isTrainingDays = (value) => Array.isArray(value) && value.length === 3 && new Set(value).size === 3 && value.every((day) => trainingWeekdays.includes(day));
var hasConsecutiveTrainingDays = (days) => {
	const indexes = new Set(days.map((day) => trainingWeekdays.indexOf(day)));
	return [...indexes].some((index) => indexes.has((index + 1) % trainingWeekdays.length));
};
var dateForProgramDay = (week, day) => {
	const weekday = trainingWeekdays.indexOf(day);
	const date = new Date(Date.UTC(2026, 7, 3 + (week - 1) * 7 + weekday));
	const parts = new Intl.DateTimeFormat("da-DK", {
		day: "numeric",
		month: "short",
		timeZone: "UTC"
	}).formatToParts(date);
	return `${parts.find((part) => part.type === "day")?.value ?? ""}. ${(parts.find((part) => part.type === "month")?.value ?? "").replaceAll(".", "").toLocaleUpperCase("da-DK")}`;
};
var applyPreferredTrainingDays = (plan, preferredDays) => {
	const normalizedDays = isTrainingDays(preferredDays) ? [...preferredDays].sort((left, right) => trainingWeekdays.indexOf(left) - trainingWeekdays.indexOf(right)) : defaultTrainingDays;
	return Array.from(new Set(plan.map((day) => day.week))).flatMap((week) => {
		const weekPlan = plan.filter((day) => day.week === week);
		const trainingDays = weekPlan.filter((day) => day.programId && day.exercises.length > 0);
		if (trainingDays.length !== normalizedDays.length) return weekPlan;
		const scheduledTraining = trainingDays.map((day, index) => ({
			...day,
			day: normalizedDays[index],
			date: dateForProgramDay(week, normalizedDays[index])
		}));
		const remainingWeekdays = trainingWeekdays.filter((day) => !normalizedDays.includes(day));
		const scheduledRest = weekPlan.filter((day) => !day.programId || day.exercises.length === 0).map((day, index) => {
			const weekday = remainingWeekdays[index];
			return weekday ? {
				...day,
				day: weekday,
				date: dateForProgramDay(week, weekday)
			} : day;
		});
		return [...scheduledTraining, ...scheduledRest].sort((left, right) => trainingWeekdays.indexOf(left.day) - trainingWeekdays.indexOf(right.day));
	});
};
//#endregion
//#region app/page.tsx
var defaultPlan = getTrainingPlan(defaultSwimProfile);
var countReps = (value) => value.split("+").reduce((sum, part) => sum + (Number.parseFloat(part) || 0), 0);
var setLogKey = (exercisePosition, setPosition) => `${exercisePosition}:${setPosition}`;
var formatTimer = (seconds) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
var formatDeviceDate = (date) => new Intl.DateTimeFormat("da-DK", {
	weekday: "long",
	day: "numeric",
	month: "long"
}).format(date).toLocaleUpperCase("da-DK");
var formatDeviceShortDate = (date) => new Intl.DateTimeFormat("da-DK", {
	day: "2-digit",
	month: "2-digit",
	year: "numeric"
}).format(date);
var formatDeviceTime = (date) => new Intl.DateTimeFormat("da-DK", {
	hour: "2-digit",
	minute: "2-digit"
}).format(date);
var exerciseEffortMetric = (exercise) => exercise.effortMetric ?? (exercise.tracking === "distance" ? "heart_rate_zone" : "rir");
var defaultEffortValue = (exercise) => exerciseEffortMetric(exercise) === "heart_rate_zone" ? "2" : exercise.effortTarget?.startsWith("4") ? "5" : "3";
var effortLabel = (metric) => metric === "heart_rate_zone" ? "PULSZONE" : metric === "rir" ? "RIR" : "RPE";
var effortSummary = (metric, value) => metric === "heart_rate_zone" ? `pulszone ${value}` : metric === "rir" ? `${value} RIR` : `RPE ${value}`;
var programRoleLabel = (role) => role === "main" ? "HOVEDØVELSE" : role === "assistance" ? "ASSISTANCE" : role === "sport_specific" ? "SPORTSRELEVANT" : "";
var positionFromCompletedSets = (plan, completedSets) => {
	let remaining = completedSets;
	for (let exerciseIndex = 0; exerciseIndex < plan.length; exerciseIndex += 1) {
		if (remaining < plan[exerciseIndex].sets) return {
			exerciseIndex,
			setIndex: remaining
		};
		remaining -= plan[exerciseIndex].sets;
	}
	return {
		exerciseIndex: Math.max(0, plan.length - 1),
		setIndex: Math.max(0, plan.at(-1)?.sets ?? 1) - 1
	};
};
function Home() {
	const [view, setView] = (0, import_react.useState)("today");
	const [deviceNow, setDeviceNow] = (0, import_react.useState)(null);
	const [energy, setEnergy] = (0, import_react.useState)(3);
	const [sleep, setSleep] = (0, import_react.useState)(3);
	const [soreness, setSoreness] = (0, import_react.useState)(3);
	const [pain, setPain] = (0, import_react.useState)(false);
	const [adjusted, setAdjusted] = (0, import_react.useState)(false);
	const [exerciseIndex, setExerciseIndex] = (0, import_react.useState)(0);
	const [setIndex, setSetIndex] = (0, import_react.useState)(0);
	const [completedSets, setCompletedSets] = (0, import_react.useState)(0);
	const [setSaved, setSetSaved] = (0, import_react.useState)(false);
	const [weight, setWeight] = (0, import_react.useState)("70");
	const [reps, setReps] = (0, import_react.useState)("2");
	const [rpe, setRpe] = (0, import_react.useState)("3");
	const [techniqueQuality, setTechniqueQuality] = (0, import_react.useState)("");
	const [readinessChecked, setReadinessChecked] = (0, import_react.useState)(false);
	const [loadSuggestion, setLoadSuggestion] = (0, import_react.useState)(null);
	const [dashboardData, setDashboardData] = (0, import_react.useState)(null);
	const [dashboardLoading, setDashboardLoading] = (0, import_react.useState)(false);
	const [feedbackKind, setFeedbackKind] = (0, import_react.useState)("session");
	const [sessionPlan, setSessionPlan] = (0, import_react.useState)(defaultPlan[0].exercises);
	const [extraDraft, setExtraDraft] = (0, import_react.useState)([]);
	const [extraDay, setExtraDay] = (0, import_react.useState)([]);
	const [extraDayName, setExtraDayName] = (0, import_react.useState)("Teknik & styrke");
	const [savedExtraDayName, setSavedExtraDayName] = (0, import_react.useState)("");
	const [librarySearch, setLibrarySearch] = (0, import_react.useState)("");
	const [libraryCategory, setLibraryCategory] = (0, import_react.useState)("Alle");
	const [libraryFocus, setLibraryFocus] = (0, import_react.useState)("Alle");
	const [videoExercise, setVideoExercise] = (0, import_react.useState)(null);
	const [testerId, setTesterId] = (0, import_react.useState)(null);
	const [trainingProfile, setTrainingProfile] = (0, import_react.useState)(null);
	const [profileDraft, setProfileDraft] = (0, import_react.useState)(defaultSwimProfile);
	const [trainingDays, setTrainingDays] = (0, import_react.useState)(defaultTrainingDays);
	const [trainingDaysDraft, setTrainingDaysDraft] = (0, import_react.useState)(defaultTrainingDays);
	const [editingPreferences, setEditingPreferences] = (0, import_react.useState)(false);
	const [selectedWeek, setSelectedWeek] = (0, import_react.useState)(1);
	const [testerInput, setTesterInput] = (0, import_react.useState)("");
	const [identityLoading, setIdentityLoading] = (0, import_react.useState)(true);
	const [identityError, setIdentityError] = (0, import_react.useState)("");
	const [progress, setProgress] = (0, import_react.useState)({});
	const [coachPlans, setCoachPlans] = (0, import_react.useState)([]);
	const [healthSummary, setHealthSummary] = (0, import_react.useState)(null);
	const [sessionProgramId, setSessionProgramId] = (0, import_react.useState)(null);
	const [savingSet, setSavingSet] = (0, import_react.useState)(false);
	const [saveError, setSaveError] = (0, import_react.useState)("");
	const [sessionLogs, setSessionLogs] = (0, import_react.useState)({});
	const [editingSetKey, setEditingSetKey] = (0, import_react.useState)(null);
	const [resumePosition, setResumePosition] = (0, import_react.useState)(null);
	const [restTargetSeconds, setRestTargetSeconds] = (0, import_react.useState)(90);
	const [restElapsedSeconds, setRestElapsedSeconds] = (0, import_react.useState)(0);
	const [restElapsedAtStart, setRestElapsedAtStart] = (0, import_react.useState)(0);
	const [restStartedAt, setRestStartedAt] = (0, import_react.useState)(null);
	const [exerciseHistory, setExerciseHistory] = (0, import_react.useState)(null);
	const [historyLoading, setHistoryLoading] = (0, import_react.useState)(false);
	const [historyOpen, setHistoryOpen] = (0, import_react.useState)(false);
	const [exerciseChangeMode, setExerciseChangeMode] = (0, import_react.useState)(null);
	const [sessionExerciseSearch, setSessionExerciseSearch] = (0, import_react.useState)("");
	const [customizingSession, setCustomizingSession] = (0, import_react.useState)(false);
	const [dayExerciseProgramId, setDayExerciseProgramId] = (0, import_react.useState)(null);
	const [dayExerciseSearch, setDayExerciseSearch] = (0, import_react.useState)("");
	const sessionLogsRef = (0, import_react.useRef)(sessionLogs);
	const activeProfile = trainingProfile ?? profileDraft;
	const activePlan = (0, import_react.useMemo)(() => {
		const plan = getTrainingPlan(activeProfile);
		return activeProfile === "weightlifting" ? plan : applyPreferredTrainingDays(plan, trainingDays);
	}, [activeProfile, trainingDays]);
	const activeToday = activePlan[0];
	const selectedWeekPlan = (0, import_react.useMemo)(() => activePlan.filter((day) => day.week === selectedWeek), [activePlan, selectedWeek]);
	const selectedWeekProgression = getWeekProgression(selectedWeek);
	const nextProgram = (0, import_react.useMemo)(() => {
		const coachProgramIds = new Set(coachPlans.map((day) => day.programId));
		const day = [...coachPlans, ...activePlan].filter((day) => day.programId && day.exercises.length > 0).find((candidate) => progress[candidate.programId]?.status === "active") ?? coachPlans.find((candidate) => candidate.programId && progress[candidate.programId]?.status !== "completed") ?? activePlan.find((candidate) => candidate.programId && candidate.exercises.length > 0 && progress[candidate.programId]?.status !== "completed") ?? null;
		if (!day?.programId) return null;
		return {
			day,
			source: coachProgramIds.has(day.programId) ? "coach" : "base",
			progress: progress[day.programId]
		};
	}, [
		activePlan,
		coachPlans,
		progress
	]);
	const weekTotals = (0, import_react.useMemo)(() => activePlan.reduce((totals, day) => ({
		sessions: totals.sessions + (day.duration > 0 ? 1 : 0),
		minutes: totals.minutes + day.duration,
		sets: totals.sets + countProgramSets(day),
		distance: totals.distance + (day.distanceMeters ?? 0)
	}), {
		sessions: 0,
		minutes: 0,
		sets: 0,
		distance: 0
	}), [activePlan]);
	const currentExercise = sessionPlan[exerciseIndex];
	const currentEffortMetric = currentExercise ? exerciseEffortMetric(currentExercise) : "rir";
	const nextExercise = sessionPlan[exerciseIndex + 1];
	const totalPlannedSets = (0, import_react.useMemo)(() => sessionPlan.reduce((total, exercise) => total + exercise.sets, 0), [sessionPlan]);
	const extraTotals = (0, import_react.useMemo)(() => {
		return {
			sets: extraDraft.reduce((total, exercise) => total + (Number(exercise.sets) || 0), 0),
			volume: extraDraft.reduce((total, exercise) => exercise.format === "load" ? total + (Number(exercise.sets) || 0) * countReps(exercise.reps) * (Number(exercise.weight) || 0) : total, 0),
			distance: extraDraft.reduce((total, exercise) => exercise.format === "distance" ? total + (Number(exercise.sets) || 0) * (Number.parseFloat(exercise.reps) || 0) : total, 0)
		};
	}, [extraDraft]);
	const savedExtraTotals = (0, import_react.useMemo)(() => {
		return {
			sets: extraDay.reduce((total, exercise) => total + (Number(exercise.sets) || 0), 0),
			volume: extraDay.reduce((total, exercise) => exercise.format === "load" ? total + (Number(exercise.sets) || 0) * countReps(exercise.reps) * (Number(exercise.weight) || 0) : total, 0),
			distance: extraDay.reduce((total, exercise) => exercise.format === "distance" ? total + (Number(exercise.sets) || 0) * (Number.parseFloat(exercise.reps) || 0) : total, 0)
		};
	}, [extraDay]);
	const extraDayPlan = (0, import_react.useMemo)(() => extraDay.map((exercise) => ({
		name: exercise.name,
		detail: exercise.format === "distance" ? `${exercise.sets} × ${exercise.reps}` : `${exercise.sets} × ${exercise.reps} · ${exercise.weight} kg`,
		focus: exercise.focus,
		sets: Math.max(1, Number(exercise.sets) || 1),
		plannedReps: exercise.reps || "1",
		defaultWeight: exercise.weight || "0",
		tracking: exercise.format
	})), [extraDay]);
	const athleteExerciseLibrary = (0, import_react.useMemo)(() => exerciseLibrary.filter((exercise) => exercise.visibility !== "coach_only"), []);
	const exerciseAlternatives = (0, import_react.useMemo)(() => currentExercise ? fiveExerciseAlternatives(currentExercise, activeProfile) : [], [currentExercise, activeProfile]);
	const addableSessionExercises = (0, import_react.useMemo)(() => {
		const query = sessionExerciseSearch.trim().toLocaleLowerCase("da-DK");
		const chosen = new Set(sessionPlan.map((exercise) => exercise.name));
		return availableSessionExercises(activeProfile).filter((exercise) => !chosen.has(exercise.name) && (!query || `${exercise.name} ${exercise.target}`.toLocaleLowerCase("da-DK").includes(query))).slice(0, 20);
	}, [
		activeProfile,
		sessionExerciseSearch,
		sessionPlan
	]);
	const currentExerciseHasLogs = Object.values(sessionLogs).some((log) => log.exerciseIndex === exerciseIndex);
	const minimumCurrentExerciseSets = Math.max(1, ...Object.values(sessionLogs).filter((log) => log.exerciseIndex === exerciseIndex).map((log) => log.setIndex + 1));
	const libraryCategories = (0, import_react.useMemo)(() => ["Alle", ...Array.from(new Set(athleteExerciseLibrary.map((exercise) => exercise.category)))], [athleteExerciseLibrary]);
	const swimStrengthCount = (0, import_react.useMemo)(() => athleteExerciseLibrary.filter((exercise) => exercise.category === "Svømmestyrke").length, [athleteExerciseLibrary]);
	const filteredExercises = (0, import_react.useMemo)(() => {
		const query = librarySearch.trim().toLocaleLowerCase("da-DK");
		return athleteExerciseLibrary.filter((exercise) => {
			const matchesCategory = libraryCategory === "Alle" || exercise.category === libraryCategory;
			const matchesFocus = libraryFocus === "Alle" || exercise.tags?.includes(libraryFocus);
			const searchableText = `${exercise.name} ${exercise.category} ${exercise.target} ${exercise.cue} ${exercise.tags?.join(" ") ?? ""}`.toLocaleLowerCase("da-DK");
			return matchesCategory && matchesFocus && (!query || searchableText.includes(query));
		});
	}, [
		athleteExerciseLibrary,
		libraryCategory,
		libraryFocus,
		librarySearch
	]);
	const selectedVideo = videoExercise ? exerciseVideos[videoExercise] : void 0;
	const currentSetKey = setLogKey(exerciseIndex, setIndex);
	const currentSetWasLogged = Boolean(sessionLogs[currentSetKey]);
	const sortedSessionLogs = (0, import_react.useMemo)(() => Object.values(sessionLogs).sort((a, b) => a.exerciseIndex - b.exerciseIndex || a.setIndex - b.setIndex), [sessionLogs]);
	const restRunning = restStartedAt !== null;
	const restSecondsRemaining = Math.max(0, restTargetSeconds - restElapsedSeconds);
	const restOvertimeSeconds = Math.max(0, restElapsedSeconds - restTargetSeconds);
	const displayedEstimatedOneRepMax = currentEffortMetric === "rir" ? exerciseHistory?.estimatedOneRepMax ?? estimatedOneRepMax(Number.parseFloat(weight) || 0, parseEffortRepCount(reps), Number.parseFloat(rpe) || 0) : null;
	const displayedIntensityPercent = displayedEstimatedOneRepMax && Number.parseFloat(weight) > 0 ? Math.round(Number.parseFloat(weight) / displayedEstimatedOneRepMax * 100) : null;
	const adaptiveFocusApplied = Boolean(exerciseHistory?.adaptiveFocus?.assistanceExercises.every((name) => sessionPlan.some((exercise) => exercise.name === name)));
	const startRestTimer = (targetSeconds) => {
		setRestTargetSeconds(targetSeconds);
		setRestElapsedSeconds(0);
		setRestElapsedAtStart(0);
		setRestStartedAt(Date.now());
	};
	const resetRestTimer = (targetSeconds) => {
		setRestTargetSeconds(targetSeconds);
		setRestElapsedSeconds(0);
		setRestElapsedAtStart(0);
		setRestStartedAt(null);
	};
	const pauseRestTimer = () => {
		if (restStartedAt === null) return;
		const elapsed = restElapsedAtStart + Math.max(0, Math.floor((Date.now() - restStartedAt) / 1e3));
		setRestElapsedSeconds(elapsed);
		setRestElapsedAtStart(elapsed);
		setRestStartedAt(null);
	};
	const resumeRestTimer = () => {
		setRestElapsedAtStart(restElapsedSeconds);
		setRestStartedAt(Date.now());
	};
	(0, import_react.useEffect)(() => {
		sessionLogsRef.current = sessionLogs;
	}, [sessionLogs]);
	(0, import_react.useEffect)(() => {
		let timer;
		const syncWithDeviceClock = () => {
			const now = /* @__PURE__ */ new Date();
			setDeviceNow(now);
			window.clearTimeout(timer);
			timer = window.setTimeout(syncWithDeviceClock, 6e4 - (now.getSeconds() * 1e3 + now.getMilliseconds()) + 50);
		};
		const syncWhenVisible = () => {
			if (document.visibilityState === "visible") syncWithDeviceClock();
		};
		syncWithDeviceClock();
		window.addEventListener("focus", syncWithDeviceClock);
		document.addEventListener("visibilitychange", syncWhenVisible);
		return () => {
			window.clearTimeout(timer);
			window.removeEventListener("focus", syncWithDeviceClock);
			document.removeEventListener("visibilitychange", syncWhenVisible);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (restStartedAt === null) return;
		const syncRestTimer = () => {
			setRestElapsedSeconds(restElapsedAtStart + Math.max(0, Math.floor((Date.now() - restStartedAt) / 1e3)));
		};
		const syncWhenVisible = () => {
			if (document.visibilityState === "visible") syncRestTimer();
		};
		syncRestTimer();
		const timer = window.setInterval(syncRestTimer, 1e3);
		window.addEventListener("focus", syncRestTimer);
		document.addEventListener("visibilitychange", syncWhenVisible);
		return () => {
			window.clearInterval(timer);
			window.removeEventListener("focus", syncRestTimer);
			document.removeEventListener("visibilitychange", syncWhenVisible);
		};
	}, [restStartedAt, restElapsedAtStart]);
	(0, import_react.useEffect)(() => {
		if (view !== "session" || !sessionProgramId || !currentExercise || currentExercise.tracking === "distance") return;
		const controller = new AbortController();
		fetch(`/api/training/exercise-history?programId=${encodeURIComponent(sessionProgramId)}&exerciseIndex=${exerciseIndex}`, {
			cache: "no-store",
			signal: controller.signal
		}).then(async (response) => {
			if (!response.ok) throw new Error("Historikken kunne ikke hentes.");
			return response.json();
		}).then((data) => {
			setExerciseHistory(data);
			const firstSet = setLogKey(exerciseIndex, 0);
			if (!sessionLogsRef.current[firstSet] && data.recommendation) setWeight(String(data.recommendation.proposedWeight));
		}).catch((error) => {
			if (!(error instanceof DOMException && error.name === "AbortError")) setExerciseHistory(null);
		}).finally(() => {
			if (!controller.signal.aborted) setHistoryLoading(false);
		});
		return () => controller.abort();
	}, [
		view,
		sessionProgramId,
		exerciseIndex,
		currentExercise
	]);
	const loadProgress = async () => {
		const response = await fetch("/api/training", { cache: "no-store" });
		if (!response.ok) return;
		const data = await response.json();
		setProgress(Object.fromEntries((data.sessions ?? []).map((session) => [session.programId, session])));
	};
	const loadHealthSummary = async () => {
		const response = await fetch("/api/health/summary", { cache: "no-store" });
		if (!response.ok) return;
		setHealthSummary((await response.json()).summary ?? null);
	};
	const loadCoachPlans = async () => {
		const response = await fetch("/api/training/plans", { cache: "no-store" });
		if (!response.ok) return;
		setCoachPlans((await response.json()).plans ?? []);
	};
	const loadDashboard = async () => {
		setDashboardLoading(true);
		try {
			const response = await fetch("/api/training/analytics", { cache: "no-store" });
			if (!response.ok) {
				setDashboardData(null);
				return;
			}
			setDashboardData(await response.json());
		} finally {
			setDashboardLoading(false);
		}
	};
	const openDashboard = () => {
		setView("dashboard");
		loadDashboard();
	};
	(0, import_react.useEffect)(() => {
		let active = true;
		fetch("/api/participant", { cache: "no-store" }).then(async (response) => response.json()).then(async (data) => {
			if (!active) return;
			setTesterId(data.testerId);
			setTrainingProfile(data.trainingProfile);
			if (data.trainingProfile) setProfileDraft(data.trainingProfile);
			if (data.trainingDays?.length === 3) {
				setTrainingDays(data.trainingDays);
				setTrainingDaysDraft(data.trainingDays);
			}
			if (data.testerId) await Promise.all([
				loadProgress(),
				loadHealthSummary(),
				loadCoachPlans()
			]);
		}).catch(() => void 0).finally(() => {
			if (active) setIdentityLoading(false);
		});
		return () => {
			active = false;
		};
	}, []);
	const toggleTrainingDay = (day) => setTrainingDaysDraft((current) => current.includes(day) ? current.filter((candidate) => candidate !== day) : current.length < 3 ? [...current, day] : current);
	const connectTester = async () => {
		setIdentityError("");
		setIdentityLoading(true);
		try {
			const response = await fetch("/api/participant", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					testerId: testerId ?? testerInput,
					trainingProfile: profileDraft,
					trainingDays: trainingDaysDraft
				})
			});
			const data = await response.json();
			if (!response.ok || !data.testerId) throw new Error(data.error ?? "Tester-ID kunne ikke gemmes.");
			setTesterId(data.testerId);
			setTrainingProfile(data.trainingProfile ?? profileDraft);
			setTrainingDays(data.trainingDays ?? trainingDaysDraft);
			setTrainingDaysDraft(data.trainingDays ?? trainingDaysDraft);
			setEditingPreferences(false);
			setTesterInput("");
			await Promise.all([
				loadProgress(),
				loadHealthSummary(),
				loadCoachPlans()
			]);
		} catch (error) {
			setIdentityError(error instanceof Error ? error.message : "Tester-ID kunne ikke gemmes.");
		} finally {
			setIdentityLoading(false);
		}
	};
	const disconnectTester = async () => {
		await fetch("/api/participant", { method: "DELETE" });
		setTesterId(null);
		setTrainingProfile(null);
		setTrainingDays(defaultTrainingDays);
		setTrainingDaysDraft(defaultTrainingDays);
		setEditingPreferences(false);
		setProgress({});
		setCoachPlans([]);
		setHealthSummary(null);
		setDashboardData(null);
		setIdentityError("");
	};
	const openFeedback = (kind) => {
		setFeedbackKind(kind);
		setView("feedback");
	};
	const readiness = (0, import_react.useMemo)(() => {
		if (pain) return {
			level: "Rød",
			className: "red",
			score: 38,
			text: "Pause hård træning",
			reason: "Du har angivet smerte. BASE ændrer ikke din plan automatisk."
		};
		const score = Math.round((energy + sleep + (6 - soreness)) / 15 * 100);
		if (score >= 72) return {
			level: "Grøn",
			className: "green",
			score,
			text: "Følg planen",
			reason: "Dine svar ligger tæt på dit normale niveau."
		};
		return {
			level: "Gul",
			className: "amber",
			score,
			text: "Sænk intensiteten",
			reason: "Lav energi og ømhed gør rolig teknik vigtigere end høj fart i dag."
		};
	}, [
		energy,
		sleep,
		soreness,
		pain
	]);
	const reset = () => {
		setView("today");
		setEnergy(3);
		setSleep(3);
		setSoreness(3);
		setPain(false);
		setAdjusted(false);
		setExerciseIndex(0);
		setSetIndex(0);
		setCompletedSets(0);
		setSetSaved(false);
		setWeight("0");
		setReps(activeToday.exercises[0]?.plannedReps ?? "100 m");
		setRpe(activeToday.exercises[0] ? defaultEffortValue(activeToday.exercises[0]) : "3");
		setTechniqueQuality("");
		setLoadSuggestion(null);
		setSessionPlan(activeToday.exercises);
		setSessionProgramId(null);
		setSaveError("");
		setSessionLogs({});
		setEditingSetKey(null);
		setResumePosition(null);
		resetRestTimer(90);
		setExerciseHistory(null);
		setHistoryOpen(false);
		setHistoryLoading(false);
		setExerciseChangeMode(null);
		setSessionExerciseSearch("");
		setCustomizingSession(false);
	};
	const startSession = (useAdjustment, plan = activeToday.exercises, programId = null, alreadyCompleted = 0, initialLogs = []) => {
		if (plan.length === 0) return;
		const position = positionFromCompletedSets(plan, alreadyCompleted);
		const openingExercise = plan[position.exerciseIndex];
		const logs = Object.fromEntries(initialLogs.map((log) => [setLogKey(log.exerciseIndex, log.setIndex), log]));
		const openingLog = logs[setLogKey(position.exerciseIndex, position.setIndex)];
		setSessionPlan(plan);
		setSessionProgramId(programId);
		setAdjusted(useAdjustment);
		setExerciseIndex(position.exerciseIndex);
		setSetIndex(position.setIndex);
		setCompletedSets(alreadyCompleted);
		setSessionLogs(logs);
		setSetSaved(Boolean(openingLog));
		setEditingSetKey(null);
		setResumePosition(null);
		setSaveError("");
		setWeight(openingLog?.weight ?? (useAdjustment && position.exerciseIndex === 0 && openingExercise.tracking !== "distance" ? "65" : openingExercise.defaultWeight));
		setReps(openingLog?.reps ?? openingExercise.plannedReps);
		setRpe(openingLog?.rpe ?? defaultEffortValue(openingExercise));
		setTechniqueQuality(openingLog?.techniqueQuality ?? "");
		setLoadSuggestion(null);
		setExerciseHistory(null);
		setHistoryOpen(false);
		setHistoryLoading(openingExercise.tracking !== "distance");
		resetRestTimer(openingExercise.restSeconds ?? 90);
		setView("session");
	};
	const startPlannedSession = async (day, useAdjustment = false) => {
		if (!day.programId || day.exercises.length === 0) return;
		if (!testerId) {
			setIdentityError("Indtast dit tester-ID for at starte og gemme dette pas.");
			setView("week");
			return;
		}
		setIdentityError("");
		try {
			const response = await fetch("/api/training", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					action: "start",
					programId: day.programId
				})
			});
			const data = await response.json();
			if (!response.ok) throw new Error(data.error ?? "Passet kunne ikke åbnes.");
			setProgress((current) => ({
				...current,
				[data.programId]: data
			}));
			startSession(useAdjustment, data.exercises ?? day.exercises, day.programId, data.completedSets, data.sets ?? []);
		} catch (error) {
			setIdentityError(error instanceof Error ? error.message : "Passet kunne ikke åbnes.");
			setView("week");
		}
	};
	const saveCurrentSet = async () => {
		if (setSaved) return;
		setSaveError("");
		if (currentEffortMetric === "rir" && !techniqueQuality) {
			setSaveError("Vurdér den tekniske kvalitet før du gemmer sættet.");
			return;
		}
		if (!sessionProgramId) {
			setCompletedSets((count) => count + 1);
			setSessionLogs((logs) => ({
				...logs,
				[currentSetKey]: {
					exerciseIndex,
					setIndex,
					weight,
					reps,
					rpe,
					effortMetric: currentEffortMetric,
					techniqueQuality: techniqueQuality || null
				}
			}));
			setSetSaved(true);
			startRestTimer(currentExercise.restSeconds ?? 90);
			return;
		}
		setSavingSet(true);
		try {
			const response = await fetch("/api/training", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					action: "log_set",
					programId: sessionProgramId,
					exerciseIndex,
					setIndex,
					weight,
					reps,
					rpe,
					effortMetric: currentEffortMetric,
					techniqueQuality: techniqueQuality || void 0,
					readinessScore: readinessChecked ? readiness.score : null,
					pain: readinessChecked ? pain : null
				})
			});
			const data = await response.json();
			if (!response.ok) throw new Error(data.error ?? "Sættet kunne ikke gemmes.");
			setCompletedSets(data.completedSets);
			setProgress((current) => ({
				...current,
				[data.programId]: data
			}));
			if (data.savedSet) setSessionLogs((logs) => ({
				...logs,
				[setLogKey(data.savedSet.exerciseIndex, data.savedSet.setIndex)]: data.savedSet
			}));
			setLoadSuggestion(data.sparring ?? null);
			setSetSaved(true);
			if (!currentSetWasLogged) startRestTimer(currentExercise.restSeconds ?? 90);
		} catch (error) {
			setSaveError(error instanceof Error ? error.message : "Sættet kunne ikke gemmes.");
		} finally {
			setSavingSet(false);
		}
	};
	const customizeTodaySession = async (nextPlan, changedIndex) => {
		if (!sessionProgramId || customizingSession) return;
		const replacedCurrentExercise = changedIndex === exerciseIndex && nextPlan[exerciseIndex]?.name !== currentExercise.name;
		setCustomizingSession(true);
		setSaveError("");
		try {
			const response = await fetch("/api/training", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					action: "customize",
					programId: sessionProgramId,
					exerciseNames: nextPlan.map((exercise) => exercise.name),
					exerciseSets: nextPlan.map((exercise) => exercise.sets)
				})
			});
			const data = await response.json();
			if (!response.ok || !data.exercises) throw new Error(data.error ?? "Træningen kunne ikke tilpasses.");
			setSessionPlan(data.exercises);
			setProgress((current) => ({
				...current,
				[data.programId]: data
			}));
			if (changedIndex === exerciseIndex) {
				const replacement = data.exercises[exerciseIndex];
				setSetIndex((current) => Math.min(current, replacement.sets - 1));
				if (replacedCurrentExercise) {
					setWeight(replacement.defaultWeight);
					setReps(replacement.plannedReps);
					setRpe(defaultEffortValue(replacement));
					setTechniqueQuality("");
					setExerciseHistory(null);
					setHistoryOpen(false);
					setHistoryLoading(replacement.tracking !== "distance");
				}
				if (!restRunning) resetRestTimer(replacement.restSeconds ?? 90);
			}
			setExerciseChangeMode(null);
			setSessionExerciseSearch("");
		} catch (error) {
			setSaveError(error instanceof Error ? error.message : "Træningen kunne ikke tilpasses.");
		} finally {
			setCustomizingSession(false);
		}
	};
	const applyAdaptiveFocus = async () => {
		const focus = exerciseHistory?.adaptiveFocus;
		if (!focus || adaptiveFocusApplied) return;
		const definitions = focus.assistanceExercises.map((name) => availableSessionExercises(activeProfile).find((exercise) => exercise.name === name)).filter((exercise) => Boolean(exercise));
		if (definitions.length === 0) return;
		const nextPlan = [...sessionPlan];
		const protectedIndexes = new Set(Object.values(sessionLogs).map((log) => log.exerciseIndex));
		const usedIndexes = /* @__PURE__ */ new Set();
		for (const definition of definitions) {
			if (nextPlan.some((exercise) => exercise.name === definition.name)) continue;
			const replaceIndex = nextPlan.findIndex((exercise, index) => index !== exerciseIndex && !protectedIndexes.has(index) && !usedIndexes.has(index) && exercise.programRole === "assistance");
			if (replaceIndex >= 0) {
				nextPlan[replaceIndex] = definitionToContextualSessionExercise(definition, nextPlan, nextPlan[replaceIndex]);
				usedIndexes.add(replaceIndex);
			} else nextPlan.push(definitionToContextualSessionExercise(definition, nextPlan));
		}
		await customizeTodaySession(nextPlan);
	};
	const addExerciseToPlannedDay = async (day, exercise) => {
		if (!day.programId || customizingSession) return;
		const currentExercises = progress[day.programId]?.exercises ?? day.exercises;
		if (currentExercises.length >= 12 || currentExercises.some((item) => item.name === exercise.name)) return;
		const nextPlan = [...currentExercises, definitionToContextualSessionExercise(exercise, currentExercises)];
		setCustomizingSession(true);
		setIdentityError("");
		try {
			const response = await fetch("/api/training", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					action: "customize",
					programId: day.programId,
					exerciseNames: nextPlan.map((item) => item.name),
					exerciseSets: nextPlan.map((item) => item.sets)
				})
			});
			const data = await response.json();
			if (!response.ok || !data.exercises) throw new Error(data.error ?? "Øvelsen kunne ikke tilføjes til dagen.");
			setProgress((current) => ({
				...current,
				[data.programId]: data
			}));
			setDayExerciseProgramId(null);
			setDayExerciseSearch("");
		} catch (error) {
			setIdentityError(error instanceof Error ? error.message : "Øvelsen kunne ikke tilføjes til dagen.");
		} finally {
			setCustomizingSession(false);
		}
	};
	const openLoggedSet = (log) => {
		if (!editingSetKey) setResumePosition({
			exerciseIndex,
			setIndex
		});
		setEditingSetKey(setLogKey(log.exerciseIndex, log.setIndex));
		if (log.exerciseIndex !== exerciseIndex) {
			setExerciseHistory(null);
			setHistoryOpen(false);
			setHistoryLoading(sessionPlan[log.exerciseIndex]?.tracking !== "distance");
		}
		setExerciseIndex(log.exerciseIndex);
		setSetIndex(log.setIndex);
		setWeight(log.weight);
		setReps(log.reps);
		setRpe(log.rpe);
		setTechniqueQuality(log.techniqueQuality ?? "");
		setLoadSuggestion(null);
		setSetSaved(true);
		setSaveError("");
	};
	const returnToTraining = () => {
		if (!resumePosition) {
			setEditingSetKey(null);
			return;
		}
		const resumeExercise = sessionPlan[resumePosition.exerciseIndex];
		const resumeLog = sessionLogs[setLogKey(resumePosition.exerciseIndex, resumePosition.setIndex)];
		setExerciseIndex(resumePosition.exerciseIndex);
		if (resumePosition.exerciseIndex !== exerciseIndex) {
			setExerciseHistory(null);
			setHistoryOpen(false);
			setHistoryLoading(resumeExercise.tracking !== "distance");
		}
		setSetIndex(resumePosition.setIndex);
		setWeight(resumeLog?.weight ?? resumeExercise.defaultWeight);
		setReps(resumeLog?.reps ?? resumeExercise.plannedReps);
		setRpe(resumeLog?.rpe ?? defaultEffortValue(resumeExercise));
		setTechniqueQuality(resumeLog?.techniqueQuality ?? "");
		setSetSaved(Boolean(resumeLog));
		setEditingSetKey(null);
		setResumePosition(null);
		setSaveError("");
	};
	const advanceSession = () => {
		if (setIndex + 1 < currentExercise.sets) {
			setSetIndex((index) => index + 1);
			setSetSaved(false);
			setTechniqueQuality("");
			setLoadSuggestion(null);
			return;
		}
		if (nextExercise) {
			setExerciseIndex((index) => index + 1);
			setSetIndex(0);
			setSetSaved(false);
			setWeight(nextExercise.defaultWeight);
			setReps(nextExercise.plannedReps);
			setRpe(defaultEffortValue(nextExercise));
			setTechniqueQuality("");
			setLoadSuggestion(null);
			setExerciseHistory(null);
			setHistoryOpen(false);
			setHistoryLoading(nextExercise.tracking !== "distance");
			return;
		}
		setView("complete");
	};
	const acceptLoadSuggestion = () => {
		if (loadSuggestion?.decision !== "increase" || loadSuggestion.proposedWeight === null || setIndex + 1 >= currentExercise.sets) return;
		setSetIndex((index) => index + 1);
		setWeight(String(loadSuggestion.proposedWeight));
		setReps(currentExercise.plannedReps);
		setRpe(defaultEffortValue(currentExercise));
		setTechniqueQuality("");
		setSetSaved(false);
		setLoadSuggestion(null);
	};
	const toggleExtraExercise = (exercise) => {
		setExtraDraft((current) => {
			if (current.some((item) => item.name === exercise.name)) return current.filter((item) => item.name !== exercise.name);
			if (current.length >= 5) return current;
			return [...current, {
				name: exercise.name,
				focus: exercise.cue,
				sets: exercise.sets,
				reps: exercise.reps,
				weight: exercise.weight,
				format: exercise.format ?? "load"
			}];
		});
	};
	const updateExtraExercise = (name, field, value) => {
		setExtraDraft((current) => current.map((exercise) => exercise.name === name ? {
			...exercise,
			[field]: value
		} : exercise));
	};
	const saveExtraDay = () => {
		if (extraDraft.length === 0) return;
		setExtraDay(extraDraft.map((exercise) => ({ ...exercise })));
		setSavedExtraDayName(extraDayName.trim() || "Ekstra træningsdag");
		setView("extraDay");
	};
	const editExtraDay = () => {
		setExtraDraft(extraDay.map((exercise) => ({ ...exercise })));
		setExtraDayName(savedExtraDayName || "Teknik & styrke");
		setView("extraBuilder");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "app-shell",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "topbar",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "brand",
						"aria-label": "BASE",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "brand-mark",
							"aria-hidden": "true",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "brand-wave brand-wave-one" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "brand-wave brand-wave-two" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "brand-wordmark",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "BASE" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "." })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("time", {
						className: "device-clock",
						dateTime: deviceNow?.toISOString(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: deviceNow ? formatDeviceShortDate(deviceNow) : "—" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: deviceNow ? formatDeviceTime(deviceNow) : "—" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "avatar",
						"aria-label": "Åbn profil",
						children: "MH"
					})
				]
			}),
			view === "today" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "screen enter",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: deviceNow ? formatDeviceDate(deviceNow) : "LOKAL DATO"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "God træning." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "lede",
						children: [
							"Dit program er tilpasset ",
							trainingProfileLabel(activeProfile).toLocaleLowerCase("da-DK"),
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						className: "coach-entry-button",
						href: "/coach",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "TRÆNERADGANG" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Åbn træneroverblik" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "→" })
						]
					}),
					nextProgram ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "hero-card next-program-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "next-program-label",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "NÆSTE PROGRAM" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: nextProgram.source === "coach" ? "FRA DIN TRÆNER" : "BASE-PROGRAM" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hero-meta",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									nextProgram.day.day,
									" · ",
									nextProgram.day.date
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [nextProgram.day.duration, " MIN"] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: nextProgram.day.title }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [nextProgram.day.focus, "."] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "session-stats",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: nextProgram.day.exercises.length }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "blokke" })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: countProgramSets(nextProgram.day) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "arbejdssæt" })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
										nextProgram.progress?.completedSets ?? 0,
										"/",
										countProgramSets(nextProgram.day)
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "udført" })] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "next-program-start",
								onClick: () => startPlannedSession(nextProgram.day),
								children: [nextProgram.progress?.status === "active" ? "Fortsæt program" : "Start program", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "→" })]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "hero-card all-programs-complete",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hero-meta",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "TESTPERIODE" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "FÆRDIG" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Alle programmer er gennemført" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Tak for indsatsen. Du kan stadig se og rette dine udførte sæt i tougersoversigten." })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "athlete-dashboard-entry",
						onClick: openDashboard,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "dashboard-entry-icon",
								children: "↗"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Se din udvikling" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Volumen · intensitet · estimeret 1RM" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "→" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "readiness-card",
						onClick: () => setView("readiness"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pulse-dot" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Check din readiness" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "30 sekunder · tilpas dagens belastning" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "→" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "week-entry",
						onClick: () => setView("week"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "week-entry-date",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "UGER" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Åbn dit 12-ugers program" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
								weekTotals.sessions,
								" pas · ",
								weekTotals.minutes,
								" min · ",
								weekTotals.sets,
								" arbejdssæt"
							] })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "→" })
						]
					}),
					nextProgram && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "section-head",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Øvelser i næste program" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [nextProgram.day.exercises.length, " blokke"] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "exercise-list",
						children: nextProgram.day.exercises.map((exercise, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "exercise",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "exercise-number",
									children: ["0", index + 1]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: exercise.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: exercise.detail })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "exercise-video-button",
									"aria-label": `Se video for ${exercise.name}`,
									onClick: () => setVideoExercise(exercise.name),
									children: "▶"
								})
							]
						}, exercise.name))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "library-link",
						onClick: () => setView("library"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Udforsk øvelsesbiblioteket" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
							exerciseLibrary.length.toLocaleString("da-DK"),
							" i BASE · ",
							athleteExerciseLibrary.length.toLocaleString("da-DK"),
							" åbne i testen"
						] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "→" })]
					}),
					extraDay.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "extra-day-entry",
						onClick: () => setView("library"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "extra-day-icon",
								children: "＋"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Sammensæt ekstra træningsdag" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Vælg øvelser og tilpas doseringen" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "→" })
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "saved-extra-day",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "saved-extra-day-head",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "EKSTRA DAG" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: editExtraDay,
									children: "Redigér"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: savedExtraDayName }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								extraDay.length,
								" øvelser · ",
								savedExtraTotals.sets,
								" arbejdssæt · ",
								savedExtraTotals.distance > 0 ? `${savedExtraTotals.distance.toLocaleString("da-DK")} m svømning` : `${savedExtraTotals.volume.toLocaleString("da-DK")} kg volumen`
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "secondary",
								onClick: () => setView("extraDay"),
								children: "Se ekstra træningsdag"
							})
						]
					}),
					nextProgram && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "primary",
						onClick: () => startPlannedSession(nextProgram.day),
						children: nextProgram.progress?.status === "active" ? "Fortsæt næste program" : "Start næste program"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "feedback-entry",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "feedback-entry-icon",
								children: "◎"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Afslutter du testperioden?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Del din samlede oplevelse på 5–7 minutter." })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => openFeedback("final"),
								children: "Åbn"
							})
						]
					})
				]
			}),
			view === "dashboard" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AthleteDashboard, {
				data: dashboardData,
				loading: dashboardLoading,
				onBack: () => setView("today")
			}),
			view === "week" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "screen enter",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "back",
						onClick: () => setView("today"),
						children: "← Tilbage"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "eyebrow",
						children: ["12-UGERS TESTFORLØB · UGE ", selectedWeek]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Dit program over 12 uger." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "lede",
						children: "Åbn hvert planlagt pas, udfør alle sæt og fortsæt senere uden at miste din fremdrift."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: testerId ? "tester-card connected" : "tester-card",
						children: [testerId && trainingProfile && !editingPreferences ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tester-check",
								children: "✓"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
								testerId,
								" · ",
								trainingProfileLabel(trainingProfile)
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: trainingProfile === "weightlifting" ? "Den eksisterende vægtløftertest beholder sine fem faste ugentlige pas." : `Træningsdage: ${trainingDays.map((day) => day.toLocaleLowerCase("da-DK")).join(" · ")}` })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "tester-actions",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => {
										setProfileDraft(trainingProfile);
										setTrainingDaysDraft(trainingDays);
										setEditingPreferences(true);
									},
									children: "Redigér"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: disconnectTester,
									children: "Log ud"
								})]
							})
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "tester-copy",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: testerId ? "Redigér profil og træningsdage" : "Forbind tester-ID og træningsprofil" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Vælg den profil og de tre ugedage, der passer til din hverdag." })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "profile-options",
								role: "radiogroup",
								"aria-label": "Træningsprofil",
								children: trainingProfileOptions.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									role: "radio",
									"aria-checked": profileDraft === option.id,
									className: profileDraft === option.id ? "active" : "",
									onClick: () => setProfileDraft(option.id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: option.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: option.description })]
								}, option.id))
							}),
							profileDraft === "weightlifting" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "training-day-note",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Eksisterende vægtløftertest" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Profilen har fem faste ugentlige pas og beholder den nuværende rytme, så den igangværende test ikke ændres." })]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "training-day-picker",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "VÆLG 3 TRÆNINGSDAGE" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "training-day-options",
										children: trainingWeekdays.map((day) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											className: trainingDaysDraft.includes(day) ? "active" : "",
											"aria-pressed": trainingDaysDraft.includes(day),
											onClick: () => toggleTrainingDay(day),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: day.slice(0, 3) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: day.toLocaleLowerCase("da-DK") })]
										}, day))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [trainingDaysDraft.length, "/3 valgt · valget gælder alle 12 uger og kan ændres senere."] }),
									hasConsecutiveTrainingDays(trainingDaysDraft) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Bemærk: Du har valgt sammenhængende træningsdage. Overvej at gøre mindst ét af passene lettere." })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "tester-connect",
								children: [
									!testerId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										"aria-label": "Tester-ID",
										value: testerInput,
										onChange: (event) => setTesterInput(event.target.value),
										placeholder: "A1",
										maxLength: 12
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: connectTester,
										disabled: identityLoading || !testerId && !testerInput.trim() || profileDraft !== "weightlifting" && trainingDaysDraft.length !== 3,
										children: identityLoading ? "…" : testerId ? "Gem valg" : "Forbind"
									}),
									testerId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "cancel",
										onClick: () => {
											setProfileDraft(trainingProfile ?? "middle_distance");
											setTrainingDaysDraft(trainingDays);
											setEditingPreferences(false);
										},
										children: "Annullér"
									})
								]
							})
						] }), identityError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "tester-error",
							children: identityError
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "week-summary",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: weekTotals.sessions }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "planlagte pas" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [weekTotals.minutes, " min"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "planlagt styrketid" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: trainingProfileLabel(activeProfile) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "profil" })] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "program-week-picker",
						"aria-label": "Vælg programuge",
						children: Array.from({ length: 12 }, (_, index) => index + 1).map((week) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: selectedWeek === week ? "active" : "",
							"aria-pressed": selectedWeek === week,
							onClick: () => setSelectedWeek(week),
							children: ["Uge ", week]
						}, week))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: `program-phase-card ${selectedWeekProgression.phase === "Deload" ? "deload" : ""}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								selectedWeekProgression.phase.toLocaleUpperCase("da-DK"),
								" · UGE ",
								selectedWeek
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: selectedWeekProgression.intensity }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: selectedWeekProgression.summary }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
								"Styrke: ",
								selectedWeekProgression.rirTarget,
								" · Kondition: ",
								selectedWeekProgression.heartRateTarget
							] })
						]
					}),
					coachPlans.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "coach-assigned-plans",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "FRA DIN TRÆNER" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [coachPlans.length, " tildelte pas"] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Disse pas er sammensat specifikt til din testprofil." })
						] }), coachPlans.map((day) => {
							const dayProgress = day.programId ? progress[day.programId] : void 0;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									day.intensity === "Vandpas" ? "VANDPAS" : "STYRKE",
									" · ",
									day.day,
									" ",
									day.date
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: day.title }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
									day.focus,
									" · ",
									day.exercises.length,
									" øvelser"
								] })
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => startPlannedSession(day),
								children: [dayProgress ? dayProgress.status === "completed" ? "Se sæt" : "Fortsæt" : "Åbn pas", " →"]
							})] }, day.programId);
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "week-list",
						children: selectedWeekPlan.map((day) => {
							const dayProgress = day.programId ? progress[day.programId] : void 0;
							const dayExercises = dayProgress?.exercises?.length ? dayProgress.exercises : day.exercises;
							const effectiveDay = {
								...day,
								exercises: dayExercises
							};
							const daySets = countProgramSets(effectiveDay);
							const dayExerciseOptions = day.programId === dayExerciseProgramId ? availableSessionExercises(activeProfile).filter((exercise) => !dayExercises.some((item) => item.name === exercise.name) && (!dayExerciseSearch.trim() || `${exercise.name} ${exercise.target}`.toLocaleLowerCase("da-DK").includes(dayExerciseSearch.trim().toLocaleLowerCase("da-DK")))).slice(0, 16) : [];
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: `week-day ${day.status}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "week-day-head",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "week-date",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: ["UGE ", day.week] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: day.day }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: day.date })
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `week-status ${day.status}`,
											children: dayProgress?.status === "completed" ? "UDFØRT" : dayProgress ? `${dayProgress.completedSets}/${dayProgress.plannedSets} SÆT` : day.status === "today" ? "I DAG" : day.status === "rest" ? "HVILE" : day.status === "recovery" ? "REST." : "PLANLAGT"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "week-day-title",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: day.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: day.focus })] }), day.duration > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
											day.distanceMeters ? `${day.distanceMeters.toLocaleString("da-DK")} m · ` : "",
											day.duration,
											" min"
										] })]
									}),
									dayExercises.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "week-exercises",
										children: dayExercises.map((exercise) => {
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onClick: () => setVideoExercise(exercise.name),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
													exercise.programRole ? `${programRoleLabel(exercise.programRole)} · ` : "",
													exercise.name,
													" · ",
													exercise.sets,
													" × ",
													exercise.plannedReps,
													exercise.restSeconds ? ` · ${exercise.restSeconds} sek pause` : "",
													exercise.effortTarget ? ` · ${exercise.effortTarget}` : ""
												] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: exerciseVideos[exercise.name] ? "▶" : "⌕" })]
											}, exercise.name);
										})
									}),
									day.programId && dayProgress?.status !== "completed" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "add-exercise-to-day",
										onClick: () => {
											setDayExerciseProgramId(dayExerciseProgramId === day.programId ? null : day.programId);
											setDayExerciseSearch("");
										},
										disabled: dayExercises.length >= 12,
										children: "＋ Tilføj øvelse til dagen"
									}),
									day.programId === dayExerciseProgramId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "day-exercise-picker",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: dayExerciseSearch,
												onChange: (event) => setDayExerciseSearch(event.target.value),
												placeholder: "Søg efter øvelse eller muskelgruppe"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
												className: "contextual-dose-note",
												children: "Standarddoseringen tilpasses denne dags sæt, pauser og intensitet."
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: dayExerciseOptions.map((exercise) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onClick: () => addExerciseToPlannedDay(effectiveDay, exercise),
												disabled: customizingSession,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: exercise.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: exercise.target })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Tilføj +" })]
											}, exercise.name)) })
										]
									}),
									day.programId && dayProgress?.status !== "completed" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "open-program",
										onClick: () => startPlannedSession(effectiveDay),
										children: dayProgress ? `Fortsæt pas · ${dayProgress.completedSets}/${daySets} sæt →` : "Start dette pas →"
									}),
									dayProgress?.status === "completed" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "program-complete",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "✓ Pas gennemført og gemt" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => startPlannedSession(effectiveDay),
											children: "Se og ret udførte sæt"
										})]
									})
								]
							}, `${day.week}-${day.day}`);
						})
					}),
					extraDay.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "week-extra-day",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "＋" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: savedExtraDayName }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
								"Din ekstra dag · ",
								extraDay.length,
								" øvelser · ",
								savedExtraTotals.sets,
								" sæt"
							] })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setView("extraDay"),
								children: "Se dag"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "week-note",
						children: "Test-ID’et huskes i browseren i 21 dage. Træningsdata gemmes i BASE-databasen – ikke i en almindelig cookie."
					})
				]
			}),
			view === "library" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "screen enter",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "back",
						onClick: () => setView("today"),
						children: "← Tilbage"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "ØVELSESBIBLIOTEK"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Variation med et formål." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "lede",
						children: "Hver øvelse har et klart træningsmål, en konkret dosering og ét teknisk fokus."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "library-summary",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: exerciseLibrary.length.toLocaleString("da-DK") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "i BASE" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: athleteExerciseLibrary.length.toLocaleString("da-DK") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "åbne i testen" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: Object.keys(exerciseVideos).length }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "testvideoer" })] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "swim-strength-index",
						onClick: () => setLibraryCategory("Svømmestyrke"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "SVØMMESTYRKE" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [swimStrengthCount, " øvelser på land"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Skuldre, træk, streamline, core og eksplosivitet" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Se indeks →" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "video-library-note",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "▶" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Videoafprøvning" }), " Centrale øvelser har en integreret teknikvideo. Resten åbner en målrettet YouTube-søgning."] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "library-tools",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "library-search",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "SØG I BIBLIOTEKET" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "search",
									value: librarySearch,
									onChange: (event) => setLibrarySearch(event.target.value),
									placeholder: "Fx pause, squat eller jerk"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "focus-filters",
								"aria-label": "Filtrér øvelser efter fokus",
								children: ["Alle", ...exerciseFocusTags].map((focus) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: libraryFocus === focus ? "active" : "",
									"aria-pressed": libraryFocus === focus,
									onClick: () => setLibraryFocus(focus),
									children: focus === "Alle" ? "Alle fokusområder" : focus
								}, focus))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "category-filters",
								"aria-label": "Filtrér øvelser efter kategori",
								children: libraryCategories.map((category) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: libraryCategory === category ? "active" : "",
									"aria-pressed": libraryCategory === category,
									onClick: () => setLibraryCategory(category),
									children: category
								}, category))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", {
								className: "library-result-count",
								children: [filteredExercises.length, " øvelser vist"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "library-list",
						children: [filteredExercises.slice(0, 120).map((exercise, index) => {
							const selected = extraDraft.some((item) => item.name === exercise.name);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: selected ? "library-exercise selected" : "library-exercise",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "library-index",
										children: String(index + 1).padStart(2, "0")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "library-content",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "category-pill",
												children: [
													exercise.category,
													" · ",
													exercise.difficulty
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: exercise.name }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: exercise.target }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Fokus:" }),
												" ",
												exercise.cue
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "watch-video",
												onClick: () => setVideoExercise(exercise.name),
												children: exerciseVideos[exercise.name] ? "▶ Se teknikvideo" : "⌕ Find teknikvideo"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: selected ? "selected" : "",
										"aria-label": `${selected ? "Fjern" : "Tilføj"} ${exercise.name} ${selected ? "fra" : "til"} program`,
										"aria-pressed": selected,
										onClick: () => toggleExtraExercise(exercise),
										children: selected ? "✓" : "+"
									})
								]
							}, exercise.name);
						}), filteredExercises.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "library-empty",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Ingen øvelser matcher." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Prøv et andet søgeord eller vælg kategorien Alle." })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "builder-dock",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [extraDraft.length, " / 5 øvelser valgt"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Vælg op til fem øvelser til din ekstra dag." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "primary",
							disabled: extraDraft.length === 0,
							onClick: () => setView("extraBuilder"),
							children: "Sammensæt dagen"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "secondary",
						onClick: () => setView("today"),
						children: "Tilbage til dagens træning"
					})
				]
			}),
			view === "extraBuilder" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "screen enter",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "back",
						onClick: () => setView("library"),
						children: "← Tilbage til biblioteket"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "EKSTRA TRÆNINGSDAG"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Sammensæt din dag." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "lede",
						children: "Tilpas træningsmængden, så den passer til formålet med dagen."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "day-name-field",
						children: ["NAVN PÅ DAGEN", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: extraDayName,
							onChange: (event) => setExtraDayName(event.target.value),
							maxLength: 36
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "builder-exercises",
						children: extraDraft.map((exercise, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "builder-exercise",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "builder-exercise-head",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(index + 1).padStart(2, "0") }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: exercise.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: exercise.focus })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										"aria-label": `Fjern ${exercise.name}`,
										onClick: () => setExtraDraft((current) => current.filter((item) => item.name !== exercise.name)),
										children: "×"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `prescription-inputs ${exercise.format === "distance" ? "distance" : ""}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["SÆT", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										inputMode: "numeric",
										value: exercise.sets,
										onChange: (event) => updateExtraExercise(exercise.name, "sets", event.target.value)
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [exercise.format === "distance" ? "DISTANCE" : "REPS", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										inputMode: "text",
										value: exercise.reps,
										onChange: (event) => updateExtraExercise(exercise.name, "reps", event.target.value)
									})] }),
									exercise.format === "load" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
										"VÆGT",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											inputMode: "decimal",
											value: exercise.weight,
											onChange: (event) => updateExtraExercise(exercise.name, "weight", event.target.value)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "kg" })
									] })
								]
							})]
						}, exercise.name))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "extra-day-totals",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: extraDraft.length }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "øvelser" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: extraTotals.sets }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "arbejdssæt" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: extraTotals.distance > 0 ? `${extraTotals.distance.toLocaleString("da-DK")} m` : `${extraTotals.volume.toLocaleString("da-DK")} kg` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: extraTotals.distance > 0 ? "svømmedistance" : "samlet volumen" })] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "primary",
						disabled: extraDraft.length === 0,
						onClick: saveExtraDay,
						children: "Gem ekstra træningsdag"
					})
				]
			}),
			view === "extraDay" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "screen enter",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "back",
						onClick: () => setView("today"),
						children: "← Tilbage"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "DIN EKSTRA DAG"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: savedExtraDayName }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "lede",
						children: "En fleksibel træningsdag sammensat fra øvelsesbiblioteket."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "extra-day-totals",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: extraDay.length }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "øvelser" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: savedExtraTotals.sets }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "arbejdssæt" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: savedExtraTotals.distance > 0 ? `${savedExtraTotals.distance.toLocaleString("da-DK")} m` : `${savedExtraTotals.volume.toLocaleString("da-DK")} kg` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: savedExtraTotals.distance > 0 ? "svømmedistance" : "samlet volumen" })] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "exercise-list extra-day-list",
						children: extraDay.map((exercise, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "exercise",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "exercise-number",
									children: String(index + 1).padStart(2, "0")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: exercise.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: exercise.format === "distance" ? `${exercise.sets} × ${exercise.reps}` : `${exercise.sets} × ${exercise.reps} · ${exercise.weight} kg` })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "exercise-video-button",
									"aria-label": `Se video for ${exercise.name}`,
									onClick: () => setVideoExercise(exercise.name),
									children: exerciseVideos[exercise.name] ? "▶" : "⌕"
								})
							]
						}, exercise.name))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "primary",
						onClick: () => startSession(false, extraDayPlan),
						children: "Start ekstra træning"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "secondary",
						onClick: editExtraDay,
						children: "Redigér dagen"
					})
				]
			}),
			view === "readiness" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "screen enter",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "back",
						onClick: () => setView("today"),
						children: "← Tilbage"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "DAGLIGT CHECK-IN"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Hvordan har kroppen det?" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "lede",
						children: "Svar ud fra hvordan du har det lige nu."
					}),
					healthSummary?.available && healthSummary.latest && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "health-context-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "health-context-head",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "DATA FRA" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: healthProviderLabel(healthSummary.provider) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `health-trend ${healthSummary.trend}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), healthTrendLabel(healthSummary.trend)]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "health-context-metrics",
								children: [
									healthSummary.latest.sleepDurationMinutes !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
										Math.floor(healthSummary.latest.sleepDurationMinutes / 60),
										"t ",
										healthSummary.latest.sleepDurationMinutes % 60,
										"m"
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Søvn" })] }),
									healthSummary.latest.sleepScore !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: healthSummary.latest.sleepScore }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Søvnscore" })] }),
									healthSummary.latest.restingHeartRate !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: healthSummary.latest.restingHeartRate }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Hvilepuls" })] }),
									healthSummary.latest.hrvMs !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [healthSummary.latest.hrvMs, " ms"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "HRV" })] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [healthSummary.daysIncluded, " dages data · bruges som kontekst, ikke til automatisk at ændre planen."] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Energi",
						low: "Flad",
						high: "Stærk",
						value: energy,
						setValue: setEnergy
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Søvnkvalitet",
						low: "Dårlig",
						high: "God",
						value: sleep,
						setValue: setSleep
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Muskelømhed",
						low: "Ingen",
						high: "Meget",
						value: soreness,
						setValue: setSoreness
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pain-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Har du smerter?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Ikke almindelig muskelømhed" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: pain ? "toggle on" : "toggle",
							onClick: () => setPain(!pain),
							"aria-pressed": pain,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "primary",
						onClick: () => {
							setReadinessChecked(true);
							setView("recommendation");
						},
						children: "Se min anbefaling"
					})
				]
			}),
			view === "recommendation" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "screen enter",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "back",
						onClick: () => setView("readiness"),
						children: "← Redigér svar"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "DIN READINESS"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `score-ring ${readiness.className}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: readiness.score }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/ 100" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `status ${readiness.className}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
							readiness.level,
							" readiness"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: readiness.text }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "lede",
						children: readiness.reason
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "change-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "change-title",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Forslag til dagens plan" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: pain ? "Ingen hård træning" : readiness.level === "Grøn" ? "Ingen ændring" : "Rolig intensitet" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "weight-change",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Planlagt snatch" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "70 kg" })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "→" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Foreslået" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: pain ? "—" : readiness.level === "Grøn" ? "70 kg" : "65 kg" })] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Du kan altid se den oprindelige plan og ændre beslutningen." })
						]
					}),
					!pain && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "primary",
						onClick: () => startPlannedSession(nextProgram?.day ?? activeToday, readiness.level !== "Grøn"),
						children: readiness.level === "Grøn" ? "Fortsæt med planen" : "Anvend og start træning"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "secondary",
						onClick: () => startPlannedSession(nextProgram?.day ?? activeToday),
						children: pain ? "Gå tilbage til planen" : "Behold oprindelig plan"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "safety",
						children: "BASE giver træningsstøtte – ikke medicinsk rådgivning."
					})
				]
			}),
			view === "session" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "screen enter session-screen",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "live-row",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "live-dot" }),
							" TRÆNING I GANG ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
								completedSets,
								" / ",
								totalPlannedSets,
								" sæt"
							] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "eyebrow",
						children: [
							"ØVELSE ",
							exerciseIndex + 1,
							" AF ",
							sessionPlan.length
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: currentExercise.name }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "lede",
						children: [currentExercise.focus, "."]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "session-exercise-actions",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setExerciseChangeMode(exerciseChangeMode === "replace" ? null : "replace"),
							disabled: currentExerciseHasLogs || customizingSession,
							children: "Skift øvelse"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setExerciseChangeMode(exerciseChangeMode === "add" ? null : "add"),
							disabled: sessionPlan.length >= 12 || customizingSession,
							children: "+ Tilføj ekstra øvelse"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "session-set-controls",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => customizeTodaySession(sessionPlan.map((exercise, index) => index === exerciseIndex ? {
									...exercise,
									sets: exercise.sets - 1
								} : exercise), exerciseIndex),
								disabled: currentExercise.sets <= minimumCurrentExerciseSets || customizingSession,
								children: "− Fjern sæt"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [currentExercise.sets, " sæt"] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => customizeTodaySession(sessionPlan.map((exercise, index) => index === exerciseIndex ? {
									...exercise,
									sets: exercise.sets + 1
								} : exercise), exerciseIndex),
								disabled: currentExercise.sets >= 20 || customizingSession,
								children: "+ Tilføj sæt"
							})
						]
					}),
					currentExerciseHasLogs && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "session-customize-note",
						children: "Øvelsen kan ikke skiftes, efter et sæt er gemt. Dine registreringer bevares."
					}),
					exerciseChangeMode === "replace" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "session-exercise-picker",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "5 ALTERNATIVER" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Samme muskelgruppe" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setExerciseChangeMode(null),
								children: "Luk"
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "session-alternative-list",
							children: exerciseAlternatives.map((exercise) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => customizeTodaySession(sessionPlan.map((item, index) => index === exerciseIndex ? definitionToContextualSessionExercise(exercise, sessionPlan, item) : item), exerciseIndex),
								disabled: customizingSession,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: exercise.name }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: exercise.target }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Vælg →" })
								]
							}, exercise.name))
						})]
					}),
					exerciseChangeMode === "add" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "session-exercise-picker add",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "EKSTRA ØVELSE" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Føj til dagens træning" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setExerciseChangeMode(null),
									children: "Luk"
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: sessionExerciseSearch,
								onChange: (event) => setSessionExerciseSearch(event.target.value),
								placeholder: "Søg efter øvelse eller muskelgruppe"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
								className: "contextual-dose-note",
								children: "BASE matcher automatisk dagens sæt, pause, intensitet og relative belastning."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "session-alternative-list",
								children: addableSessionExercises.map((exercise) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => customizeTodaySession([...sessionPlan, definitionToContextualSessionExercise(exercise, sessionPlan)]),
									disabled: customizingSession,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: exercise.name }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: exercise.target }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tilføj +" })
									]
								}, exercise.name))
							})
						]
					}),
					currentExercise.tracking !== "distance" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: `exercise-history-summary ${exerciseHistory?.recommendation?.decision ?? "planned"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "PERSONLIG STARTVÆGT" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: historyLoading ? "Beregner ud fra tidligere sæt…" : exerciseHistory?.recommendation ? `${String(exerciseHistory.recommendation.proposedWeight).replace(".", ",")} kg` : `${currentExercise.defaultWeight} kg` }),
							!historyLoading && exerciseHistory?.recommendation && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
								exerciseHistory.recommendation.headline,
								" · ",
								exerciseHistory.recommendation.reasons[0]
							] })
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setHistoryOpen((open) => !open),
							disabled: historyLoading,
							children: historyOpen ? "Skjul historik" : `Se historik${exerciseHistory?.history.length ? ` · ${exerciseHistory.history.length} pas` : ""}`
						})]
					}),
					exerciseHistory?.adaptiveFocus && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "adaptive-focus-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "BASE · 2-UGERS FOKUS" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: exerciseHistory.adaptiveFocus.headline }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: exerciseHistory.adaptiveFocus.reasons[0] })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: exerciseHistory.adaptiveFocus.assistanceExercises.map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: name }, name)) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "BASE omfordeler eksisterende assistance, hvor det er muligt, så den samlede belastning ikke bare vokser." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: applyAdaptiveFocus,
								disabled: customizingSession || adaptiveFocusApplied,
								children: adaptiveFocusApplied ? "Fokus er indarbejdet" : customizingSession ? "Tilpasser…" : "Indarbejd fokus i passet"
							})
						]
					}),
					historyOpen && exerciseHistory && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "exercise-history-panel",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "exercise-history-title",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "TIDLIGERE SÆT" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: exerciseHistory.exerciseName })]
						}), exerciseHistory.history.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Ingen tidligere registreringer. BASE bruger den planlagte vægt i dette pas." }) : exerciseHistory.history.map((session) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "exercise-history-session",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: session.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								new Date(session.date).toLocaleDateString("da-DK", {
									day: "numeric",
									month: "short",
									year: "numeric"
								}),
								" · ",
								session.sets.length,
								"/",
								session.plannedSets,
								" sæt"
							] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: session.sets.map((set) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"Sæt ",
								set.setIndex + 1,
								": ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
									set.weight,
									" kg × ",
									set.reps
								] }),
								" · ",
								set.rir,
								" RIR"
							] }, set.setIndex)) })]
						}, `${session.programId}-${session.date}`))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "session-video-button",
						onClick: () => setVideoExercise(currentExercise.name),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: exerciseVideos[currentExercise.name] ? "▶" : "⌕" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: exerciseVideos[currentExercise.name] ? "Se teknikvideo" : "Find teknikvideo" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Åbnes uden at nulstille træningen" })] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: `rest-timer ${restSecondsRemaining === 0 ? "finished" : ""}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "PAUSETIMER" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
								"Starter automatisk, når sættet gemmes · ",
								restTargetSeconds,
								" sek anbefalet"
							] })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rest-timer-times",
								"aria-live": "polite",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "REEL PAUSE" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: formatTimer(restElapsedSeconds) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: restSecondsRemaining > 0 ? "TILBAGE" : "OVER ANBEFALING" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: restSecondsRemaining > 0 ? formatTimer(restSecondsRemaining) : `+${formatTimer(restOvertimeSeconds)}` })] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rest-timer-actions",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: restRunning ? pauseRestTimer : resumeRestTimer,
										children: restRunning ? "Pause" : "Start"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => resetRestTimer(currentExercise.restSeconds ?? 90),
										children: "Nulstil"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setRestTargetSeconds((seconds) => seconds + 30),
										children: "+30 sek"
									})
								]
							})
						]
					}),
					adjusted && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "adjusted-note",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "↘" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Træn med rolig intensitet" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Readiness · gul · behold teknisk kvalitet" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setAdjusted(false),
								children: "Fortryd"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "set-progress",
						style: { gridTemplateColumns: `repeat(${currentExercise.sets}, 1fr)` },
						children: Array.from({ length: currentExercise.sets }, (_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: index < setIndex || index === setIndex && setSaved ? "done" : index === setIndex ? "current" : "",
							children: index + 1
						}, index))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "log-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "set-heading",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"SÆT ",
									setIndex + 1,
									" AF ",
									currentExercise.sets
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [currentExercise.plannedReps, currentExercise.tracking === "distance" ? currentExercise.restSeconds ? ` · ${currentExercise.restSeconds} sek pause` : "" : " reps"] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "effort-guidance",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: currentEffortMetric === "heart_rate_zone" ? "CARDIO" : "STYRKE" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: currentExercise.effortTarget ?? (currentEffortMetric === "heart_rate_zone" ? "Pulszone efter passets mål" : "RIR efter passets mål") }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: currentEffortMetric === "heart_rate_zone" ? "Uden pulsur: brug samtaletempo og RPE 2–4 som fallback." : "RIR er antal gode gentagelser, du vurderer var tilbage." })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `inputs ${currentExercise.tracking === "distance" ? "distance-inputs" : ""}`,
								children: [
									currentExercise.tracking !== "distance" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
										"VÆGT",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											inputMode: "decimal",
											value: weight,
											onChange: (e) => setWeight(e.target.value),
											disabled: setSaved
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "kg" })
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [currentExercise.tracking === "distance" ? "DISTANCE" : "REPS", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										inputMode: "text",
										value: reps,
										onChange: (e) => setReps(e.target.value),
										disabled: setSaved
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [effortLabel(currentEffortMetric), currentEffortMetric === "heart_rate_zone" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: rpe,
										onChange: (e) => setRpe(e.target.value),
										disabled: setSaved,
										children: [
											1,
											2,
											3,
											4,
											5
										].map((zone) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
											value: zone,
											children: ["Zone ", zone]
										}, zone))
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										inputMode: "decimal",
										value: rpe,
										onChange: (e) => setRpe(e.target.value),
										disabled: setSaved
									})] })
								]
							}),
							currentEffortMetric === "rir" && displayedIntensityPercent !== null && displayedEstimatedOneRepMax !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "estimated-max-explainer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [displayedIntensityPercent, "%"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
									"af estimeret 1RM · ",
									String(Math.round(displayedEstimatedOneRepMax * 10) / 10).replace(".", ","),
									" kg"
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [exerciseHistory?.estimatedOneRepMax ? "Beregnet fra dine seneste udførte sæt." : "Foreløbigt beregnet ud fra vægt, reps og RIR.", " Derfor føles dagens belastning sådan."] })] })]
							}),
							currentEffortMetric === "rir" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "technique-quality",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Teknisk kvalitet" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Vurdér sættet ærligt — det indgår i BASEs belastningsforslag." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: [
									["good", "God"],
									["uncertain", "Usikker"],
									["poor", "Ikke god"]
								].map(([value, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: techniqueQuality === value ? `active ${value}` : "",
									onClick: () => setTechniqueQuality(value),
									disabled: setSaved,
									children: label
								}, value)) })]
							}),
							!setSaved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "primary",
								onClick: saveCurrentSet,
								disabled: savingSet,
								children: savingSet ? "Gemmer…" : currentSetWasLogged ? "Gem ændringer" : "Gem sæt"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "saved",
									children: [
										"✓ Sæt gemt · ",
										currentExercise.tracking === "distance" ? reps : `${weight} kg × ${reps}`,
										" · ",
										effortSummary(currentEffortMetric, rpe)
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "edit-set-button",
									onClick: () => setSetSaved(false),
									children: "Rediger dette sæt"
								}),
								loadSuggestion && currentEffortMetric === "rir" && !editingSetKey && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
									className: `base-sparring ${loadSuggestion.decision}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "BASE SPARRING" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: loadSuggestion.headline })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: loadSuggestion.reasons.slice(0, 3).map((reason) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: reason }, reason)) }),
										loadSuggestion.decision === "increase" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "base-sparring-actions",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onClick: acceptLoadSuggestion,
												children: [
													"Brug ",
													String(loadSuggestion.proposedWeight).replace(".", ","),
													" kg"
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setLoadSuggestion(null),
												children: "Behold planen"
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "primary next-set-button",
									onClick: editingSetKey ? returnToTraining : advanceSession,
									children: editingSetKey ? "Tilbage til træningen" : nextExercise === void 0 && setIndex + 1 === currentExercise.sets ? "Afslut træning" : setIndex + 1 === currentExercise.sets ? `Næste øvelse · ${nextExercise?.name}` : `Fortsæt til sæt ${setIndex + 2}`
								})
							] }),
							saveError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "set-save-error",
								children: saveError
							})
						]
					}),
					sortedSessionLogs.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "completed-set-list",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Udførte sæt" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tryk på et sæt for at rette det" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "completed-set-buttons",
							children: sortedSessionLogs.map((log) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: setLogKey(log.exerciseIndex, log.setIndex) === currentSetKey ? "active" : "",
								onClick: () => openLoggedSet(log),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									sessionPlan[log.exerciseIndex]?.name ?? `Øvelse ${log.exerciseIndex + 1}`,
									" · sæt ",
									log.setIndex + 1
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
									sessionPlan[log.exerciseIndex]?.tracking === "distance" ? log.reps : `${log.weight} kg × ${log.reps}`,
									" · ",
									effortSummary(log.effortMetric ?? (sessionPlan[log.exerciseIndex] ? exerciseEffortMetric(sessionPlan[log.exerciseIndex]) : "rpe"), log.rpe)
								] })]
							}, setLogKey(log.exerciseIndex, log.setIndex)))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "next-exercise",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: nextExercise ? "NÆSTE ØVELSE" : "SIDSTE ØVELSE" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: nextExercise ? `${nextExercise.name} · ${nextExercise.detail}` : `${totalPlannedSets - completedSets} sæt tilbage` })]
					})
				]
			}),
			view === "complete" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "screen complete-screen enter",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "checkmark",
						children: "✓"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "SESSION AFSLUTTET"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Godt arbejde." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "lede",
						children: "Du gennemførte passet. Dine sæt er gemt på din testprofil."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "summary-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: completedSets }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "sæt logget" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: sessionPlan.length }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "øvelser" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: adjusted ? "−7 %" : "0 %" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "tilpasning" })] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "test-question",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Hjælp os med at gøre BASE bedre" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Besvar 10 korte spørgsmål om denne session. Det tager cirka ét minut." })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "primary",
						onClick: () => openFeedback("session"),
						children: "Giv feedback på træningen"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "secondary",
						onClick: () => {
							reset();
							setView("week");
						},
						children: "Spring over og se testprogrammet"
					})
				]
			}),
			view === "feedback" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeedbackForm, {
				kind: feedbackKind,
				onBack: () => setView(feedbackKind === "session" ? "complete" : "today"),
				onDone: () => setView("feedbackThanks")
			}),
			view === "feedbackThanks" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "screen complete-screen enter",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "checkmark",
						children: "✓"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "SVAR MODTAGET"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Tak for din feedback." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "lede",
						children: "Dit svar er gemt og bruges til at prioritere den næste version af BASE."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "feedback-confirmation",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: feedbackKind === "session" ? "Sessionen er evalueret" : "Testperioden er evalueret" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Du har ikke delt navn eller følsomme helbredsoplysninger." })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "primary",
						onClick: reset,
						children: "Tilbage til forsiden"
					})
				]
			}),
			videoExercise && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "video-overlay",
				onClick: () => setVideoExercise(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "video-dialog",
					role: "dialog",
					"aria-modal": "true",
					"aria-labelledby": "video-title",
					onClick: (event) => event.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "video-dialog-head",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "TEKNIKVIDEO · PROTOTYPE" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								id: "video-title",
								children: videoExercise
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								"aria-label": "Luk video",
								onClick: () => setVideoExercise(null),
								children: "×"
							})]
						}),
						selectedVideo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "video-frame",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
								src: `https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?rel=0&playsinline=1`,
								title: `${videoExercise} teknikvideo`,
								allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
								referrerPolicy: "strict-origin-when-cross-origin",
								allowFullScreen: true
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "video-search-fallback",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "⌕" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Videoen er ikke udvalgt endnu" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Til testperioden kan du åbne en målrettet søgning og vælge den mest relevante demonstration." })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "video-dialog-actions",
							children: selectedVideo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: selectedVideo.sourceUrl,
								target: "_blank",
								rel: "noreferrer",
								children: [
									"Kilde: ",
									selectedVideo.source,
									" ↗"
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								className: "video-search-action",
								href: youtubeExerciseSearchUrl(videoExercise),
								target: "_blank",
								rel: "noreferrer",
								children: [
									"Søg efter ",
									videoExercise,
									" på YouTube ↗"
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "video-safety-note",
							children: "Ekstern demonstration til prototypetest. Følg altid din træners anvisninger."
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "prototype-label",
				children: "INTERAKTIV PROTOTYPE · TESTSVAR GEMMES"
			})
		]
	});
}
function Metric({ label, low, high, value, setValue }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "metric",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "metric-head",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [value, "/5"] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "scale",
				children: [
					1,
					2,
					3,
					4,
					5
				].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setValue(n),
					className: value === n ? "active" : "",
					children: n
				}, n))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "scale-labels",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: low }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: high })]
			})
		]
	});
}
//#endregion
export { Home as default };
