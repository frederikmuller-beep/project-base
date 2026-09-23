import { C as __toESM, t as require_jsx_runtime, y as require_react } from "../index.js";
import { t as Link } from "./link-xiHQ0wo4.js";
import { a as programTemplates, d as exerciseFocusTags, f as exerciseLibrary, i as buildTemplatePlan, o as sportProfiles, r as swimPlans } from "./swim-program-data-BEbEriBL.js";
//#region app/coach/coach-dashboard.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var waterTemplates = Object.values(swimPlans).flat().filter((day) => day.programId && day.exercises.length > 0);
var localIsoDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
var todayIso = () => localIsoDate(/* @__PURE__ */ new Date());
var emptyDraft = () => ({
	id: null,
	title: "",
	focus: "Teknisk kvalitet og en tydelig opgave",
	scheduledDate: todayIso(),
	trainingType: "strength",
	exercises: []
});
var dateLabel = (value) => {
	if (!value) return "Ingen aktivitet endnu";
	const date = new Date(value.includes("T") ? value : `${value.replace(" ", "T")}Z`);
	return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("da-DK", {
		dateStyle: "medium",
		timeStyle: "short"
	}).format(date);
};
function CoachDashboard() {
	const [coachKey, setCoachKey] = (0, import_react.useState)("");
	const [athletes, setAthletes] = (0, import_react.useState)([]);
	const [availableAthletes, setAvailableAthletes] = (0, import_react.useState)([]);
	const [plans, setPlans] = (0, import_react.useState)([]);
	const [selectedId, setSelectedId] = (0, import_react.useState)(null);
	const [draft, setDraft] = (0, import_react.useState)(emptyDraft);
	const [librarySearch, setLibrarySearch] = (0, import_react.useState)("");
	const [libraryCategory, setLibraryCategory] = (0, import_react.useState)("Alle");
	const [libraryFocus, setLibraryFocus] = (0, import_react.useState)("Alle");
	const [templateId, setTemplateId] = (0, import_react.useState)("");
	const [programTemplateId, setProgramTemplateId] = (0, import_react.useState)("");
	const [programSport, setProgramSport] = (0, import_react.useState)("all");
	const [programDifficulty, setProgramDifficulty] = (0, import_react.useState)("all");
	const [unlocked, setUnlocked] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [mutating, setMutating] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const selected = athletes.find((athlete) => athlete.testerId === selectedId) ?? null;
	const selectedPlans = plans.filter((plan) => plan.testerId === selectedId);
	const categories = (0, import_react.useMemo)(() => ["Alle", ...Array.from(new Set(exerciseLibrary.map((exercise) => exercise.category)))], []);
	const filteredExercises = (0, import_react.useMemo)(() => {
		const query = librarySearch.trim().toLocaleLowerCase("da-DK");
		return exerciseLibrary.filter((exercise) => (libraryCategory === "Alle" || exercise.category === libraryCategory) && (libraryFocus === "Alle" || exercise.tags?.includes(libraryFocus)) && (!query || `${exercise.name} ${exercise.category} ${exercise.target} ${exercise.tags?.join(" ") ?? ""}`.toLocaleLowerCase("da-DK").includes(query)));
	}, [
		libraryCategory,
		libraryFocus,
		librarySearch
	]);
	const filteredProgramTemplates = (0, import_react.useMemo)(() => programTemplates.filter((template) => (programSport === "all" || template.sportId === programSport) && (programDifficulty === "all" || template.difficulty === programDifficulty)), [programDifficulty, programSport]);
	const totals = (0, import_react.useMemo)(() => ({
		sessions: athletes.reduce((sum, athlete) => sum + athlete.sessionsStarted, 0),
		completed: athletes.reduce((sum, athlete) => sum + athlete.sessionsCompleted, 0),
		sets: athletes.reduce((sum, athlete) => sum + athlete.setsLogged, 0)
	}), [athletes]);
	const requestHeaders = (json = false) => ({
		authorization: `Bearer ${coachKey}`,
		...json ? { "content-type": "application/json" } : {}
	});
	const loadPlans = async () => {
		const response = await fetch("/api/coach/plans", {
			headers: requestHeaders(),
			cache: "no-store"
		});
		const payload = await response.json().catch(() => null);
		if (!response.ok || !payload?.plans) throw new Error(payload?.error ?? "Trænerplanerne kunne ikke hentes.");
		setPlans(payload.plans);
	};
	const loadAthletes = async () => {
		setLoading(true);
		setError("");
		try {
			const response = await fetch("/api/coach/athletes", {
				headers: requestHeaders(),
				cache: "no-store"
			});
			const payload = await response.json().catch(() => null);
			if (!response.ok || !payload?.athletes || !payload.availableAthletes) throw new Error(payload?.error ?? "Atletdata kunne ikke hentes.");
			setAthletes(payload.athletes);
			setAvailableAthletes(payload.availableAthletes);
			setSelectedId((current) => payload.athletes?.some((athlete) => athlete.testerId === current) ? current : payload.athletes?.[0]?.testerId ?? null);
			await loadPlans();
			setUnlocked(true);
		} catch (loadError) {
			setError(loadError instanceof Error ? loadError.message : "Atletdata kunne ikke hentes.");
		} finally {
			setLoading(false);
		}
	};
	const assignAthlete = async (testerId) => {
		setMutating(true);
		setError("");
		try {
			const response = await fetch("/api/coach/athletes", {
				method: "POST",
				headers: requestHeaders(true),
				body: JSON.stringify({ testerId })
			});
			const payload = await response.json().catch(() => null);
			if (!response.ok) throw new Error(payload?.error ?? "Atleten kunne ikke tildeles.");
			await loadAthletes();
			setSelectedId(payload?.testerId ?? testerId);
			setDraft(emptyDraft());
		} catch (assignError) {
			setError(assignError instanceof Error ? assignError.message : "Atleten kunne ikke tildeles.");
		} finally {
			setMutating(false);
		}
	};
	const removeAthlete = async (testerId) => {
		setMutating(true);
		setError("");
		try {
			const response = await fetch(`/api/coach/athletes?testerId=${encodeURIComponent(testerId)}`, {
				method: "DELETE",
				headers: requestHeaders()
			});
			const payload = await response.json().catch(() => null);
			if (!response.ok) throw new Error(payload?.error ?? "Tildelingen kunne ikke fjernes.");
			await loadAthletes();
			setDraft(emptyDraft());
		} catch (removeError) {
			setError(removeError instanceof Error ? removeError.message : "Tildelingen kunne ikke fjernes.");
		} finally {
			setMutating(false);
		}
	};
	const addExercise = (exercise) => setDraft((current) => ({
		...current,
		exercises: [...current.exercises, {
			name: exercise.name,
			focus: exercise.cue,
			sets: Math.max(1, Number(exercise.sets) || 1),
			plannedReps: exercise.reps,
			defaultWeight: exercise.weight,
			tracking: exercise.format ?? "load",
			restSeconds: exercise.format === "distance" ? 30 : 75,
			effortMetric: exercise.format === "distance" ? "heart_rate_zone" : "rir",
			effortTarget: exercise.format === "distance" ? "Pulszone efter trænerens plan" : "RIR efter trænerens plan",
			detail: ""
		}]
	}));
	const updateExercise = (index, key, value) => setDraft((current) => ({
		...current,
		exercises: current.exercises.map((exercise, position) => position === index ? {
			...exercise,
			[key]: key === "sets" || key === "restSeconds" ? Math.max(0, Number(value) || 0) : value
		} : exercise)
	}));
	const removeExercise = (index) => setDraft((current) => ({
		...current,
		exercises: current.exercises.filter((_, position) => position !== index)
	}));
	const loadWaterTemplate = () => {
		const template = waterTemplates.find((day) => day.programId === templateId);
		if (!template) return;
		setDraft((current) => ({
			...current,
			id: null,
			title: template.title,
			focus: template.focus,
			trainingType: "swim",
			exercises: template.exercises.map((exercise) => ({
				...exercise,
				tracking: "distance",
				restSeconds: exercise.restSeconds ?? 30
			}))
		}));
	};
	const loadProgramTemplate = () => {
		const template = buildTemplatePlan(programTemplateId)[0];
		if (!template) return;
		const isWater = [
			"long_distance",
			"middle_distance",
			"sprint"
		].includes(programTemplates.find((item) => item.id === programTemplateId)?.sportId ?? "");
		setDraft((current) => ({
			...current,
			id: null,
			title: template.title,
			focus: template.focus,
			trainingType: isWater ? "swim" : "strength",
			exercises: template.exercises.map((exercise) => ({
				...exercise,
				tracking: exercise.tracking ?? "load",
				restSeconds: exercise.restSeconds ?? 75
			}))
		}));
	};
	const assignTwelveWeekProgram = async () => {
		if (!selectedId || !programTemplateId) return;
		const template = programTemplates.find((item) => item.id === programTemplateId);
		const days = buildTemplatePlan(programTemplateId);
		if (!template || days.length === 0) return;
		setMutating(true);
		setError("");
		try {
			const firstMonday = /* @__PURE__ */ new Date();
			firstMonday.setDate(firstMonday.getDate() + ((8 - firstMonday.getDay()) % 7 || 7));
			for (let index = 0; index < days.length; index += 1) {
				const day = days[index];
				const scheduledDate = new Date(firstMonday);
				scheduledDate.setDate(firstMonday.getDate() + (day.week - 1) * 7 + [
					0,
					2,
					5
				][index % 3]);
				const response = await fetch("/api/coach/plans", {
					method: "POST",
					headers: requestHeaders(true),
					body: JSON.stringify({
						testerId: selectedId,
						title: day.title,
						focus: day.focus,
						scheduledDate: localIsoDate(scheduledDate),
						trainingType: [
							"long_distance",
							"middle_distance",
							"sprint"
						].includes(template.sportId) ? "swim" : "strength",
						exercises: day.exercises
					})
				});
				const payload = await response.json().catch(() => null);
				if (!response.ok) throw new Error(payload?.error ?? `Uge ${day.week} kunne ikke tildeles.`);
			}
			await loadPlans();
			setProgramTemplateId("");
		} catch (assignError) {
			setError(assignError instanceof Error ? assignError.message : "12-ugers programmet kunne ikke tildeles.");
		} finally {
			setMutating(false);
		}
	};
	const editPlan = (plan) => {
		setDraft({
			id: plan.programId,
			title: plan.title,
			focus: plan.focus,
			scheduledDate: plan.scheduledDate,
			trainingType: plan.trainingType,
			exercises: plan.exercises.map((exercise) => ({
				...exercise,
				tracking: exercise.tracking ?? "load",
				restSeconds: exercise.restSeconds ?? 75
			}))
		});
		document.getElementById("coach-plan-builder")?.scrollIntoView({
			behavior: "smooth",
			block: "start"
		});
	};
	const savePlan = async () => {
		if (!selectedId || !draft.title.trim() || draft.exercises.length === 0) return;
		setMutating(true);
		setError("");
		try {
			const response = await fetch("/api/coach/plans", {
				method: "POST",
				headers: requestHeaders(true),
				body: JSON.stringify({
					...draft,
					testerId: selectedId
				})
			});
			const payload = await response.json().catch(() => null);
			if (!response.ok) throw new Error(payload?.error ?? "Trænerpasset kunne ikke gemmes.");
			await loadPlans();
			setDraft(emptyDraft());
			setTemplateId("");
		} catch (saveError) {
			setError(saveError instanceof Error ? saveError.message : "Trænerpasset kunne ikke gemmes.");
		} finally {
			setMutating(false);
		}
	};
	const removePlan = async (id) => {
		setMutating(true);
		setError("");
		try {
			const response = await fetch(`/api/coach/plans?id=${encodeURIComponent(id)}`, {
				method: "DELETE",
				headers: requestHeaders()
			});
			const payload = await response.json().catch(() => null);
			if (!response.ok) throw new Error(payload?.error ?? "Trænerpasset kunne ikke fjernes.");
			await loadPlans();
			if (draft.id === id) setDraft(emptyDraft());
		} catch (removeError) {
			setError(removeError instanceof Error ? removeError.message : "Trænerpasset kunne ikke fjernes.");
		} finally {
			setMutating(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "coach-shell",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				className: "export-back",
				href: "/",
				children: "← Til BASE"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow",
				children: "TRÆNER · ARBEJDSRUM"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Følg og planlæg træningen." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "lede",
				children: "Tildel aktive testprofiler, sammensæt styrke- eller vandpas og følg udførelsen."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "coach-access-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["TRÆNERNØGLE", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "password",
					value: coachKey,
					onChange: (event) => setCoachKey(event.target.value),
					placeholder: "Indtast den private nøgle"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: coachKey.length < 24 || loading,
					onClick: loadAthletes,
					children: loading ? "Henter…" : unlocked ? "Opdatér" : "Åbn træneroverblik"
				})]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "export-error",
				role: "alert",
				children: error
			}),
			unlocked && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "coach-profile-pool",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "AKTIVE TESTPROFILER" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Tildel uden at kende tester-ID’et" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Vælg en aktiv profil. ID’et bruges kun som pseudonym i BASE." })
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "coach-profile-pool-list",
						children: [availableAthletes.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Alle aktive testprofiler er allerede tildelt." }), availableAthletes.map((athlete) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							disabled: mutating,
							onClick: () => assignAthlete(athlete.testerId),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: athlete.trainingProfileLabel }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: athlete.testerId }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: ["Aktiv ", dateLabel(athlete.lastActiveAt)] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "＋ Tildel" })
							]
						}, athlete.testerId))]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "coach-summary",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: athletes.length }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "tildelte atleter" })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
							totals.completed,
							"/",
							totals.sessions
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "pas gennemført" })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: plans.length }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "trænertildelte pas" })] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "coach-layout",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "athlete-list",
						"aria-label": "Atleter",
						children: [athletes.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "coach-empty",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Ingen atleter tildelt endnu." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Vælg en aktiv testprofil ovenfor." })]
						}), athletes.map((athlete) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: selectedId === athlete.testerId ? "active" : "",
							onClick: () => {
								setSelectedId(athlete.testerId);
								setDraft(emptyDraft());
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "athlete-avatar",
									children: athlete.testerId.slice(0, 2)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: athlete.testerId }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
									athlete.trainingProfileLabel,
									" · ",
									athlete.sessionsCompleted,
									"/",
									athlete.sessionsStarted,
									" pas"
								] })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "→" })
							]
						}, athlete.testerId))]
					}), selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "athlete-detail",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "athlete-detail-head",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["ATLET · ", selected.trainingProfileLabel.toLocaleUpperCase("da-DK")] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: selected.testerId })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "athlete-detail-actions",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
										"Senest aktiv",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
										dateLabel(selected.lastActiveAt)
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										disabled: mutating,
										onClick: () => removeAthlete(selected.testerId),
										children: "Fjern tildeling"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "coach-athlete-dashboard",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ATLETDASHBOARD" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Samlet træningsdata" })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
										selected.sessionsCompleted,
										"/",
										selected.sessionsStarted
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "gennemførte pas" })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [selected.strengthVolumeKg.toLocaleString("da-DK"), " kg"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "faktisk styrkevolume" })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [(selected.distanceMeters / 1e3).toLocaleString("da-DK", { maximumFractionDigits: 1 }), " km"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "registreret distance" })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: selected.setsLogged }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "registrerede sæt" })] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "coach-plan-builder",
								id: "coach-plan-builder",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "coach-builder-title",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "PROGRAMBYGGER" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: draft.id ? "Redigér tildelt pas" : "Tildel et nyt pas" })] }), draft.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setDraft(emptyDraft()),
											children: "Nyt pas"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
										className: "coach-program-bank",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "12-UGERS PROGRAMBANK" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "500 komplette skabeloner" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Filtrér efter sport og niveau. Skjulte løbe-, shuttle- og vandforløb er kun tilgængelige her." })
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "coach-program-filters",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													value: programSport,
													onChange: (event) => {
														setProgramSport(event.target.value);
														setProgramTemplateId("");
													},
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "all",
														children: "Alle sportsgrene"
													}), sportProfiles.map((sport) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: sport.id,
														children: sport.label
													}, sport.id))]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													value: programDifficulty,
													onChange: (event) => {
														setProgramDifficulty(event.target.value);
														setProgramTemplateId("");
													},
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "all",
															children: "Alle niveauer"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Begynder" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Øvet" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Avanceret" })
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												value: programTemplateId,
												onChange: (event) => setProgramTemplateId(event.target.value),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
													value: "",
													children: [
														"Vælg blandt ",
														filteredProgramTemplates.length,
														" programmer…"
													]
												}), filteredProgramTemplates.map((template) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
													value: template.id,
													children: [
														template.visibility === "coach_only" ? "🔒 " : "",
														template.title,
														" · ",
														template.difficulty
													]
												}, template.id))]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "coach-program-actions",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													disabled: !programTemplateId || mutating,
													onClick: loadProgramTemplate,
													children: "Indlæs første pas"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: "primary",
													disabled: !programTemplateId || mutating,
													onClick: assignTwelveWeekProgram,
													children: mutating ? "Tildeler…" : "Tildel alle 12 uger"
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "coach-template-row",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["SKJULTE VANDPAS", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: templateId,
											onChange: (event) => setTemplateId(event.target.value),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												children: "Vælg færdigt svømmepas…"
											}), waterTemplates.map((template) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
												value: template.programId ?? "",
												children: [
													template.title,
													" · ",
													template.distanceMeters?.toLocaleString("da-DK"),
													" m"
												]
											}, template.programId))]
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											disabled: !templateId,
											onClick: loadWaterTemplate,
											children: "Indlæs vandpas"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "coach-plan-meta",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["TITEL", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: draft.title,
												onChange: (event) => setDraft((current) => ({
													...current,
													title: event.target.value
												})),
												placeholder: "Fx Teknik & fart"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["DATO", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "date",
												value: draft.scheduledDate,
												onChange: (event) => setDraft((current) => ({
													...current,
													scheduledDate: event.target.value
												}))
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["TYPE", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												value: draft.trainingType,
												onChange: (event) => setDraft((current) => ({
													...current,
													trainingType: event.target.value
												})),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "strength",
													children: "Styrke på land"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "swim",
													children: "Træning i vand"
												})]
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "wide",
												children: ["FOKUS", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													value: draft.focus,
													onChange: (event) => setDraft((current) => ({
														...current,
														focus: event.target.value
													}))
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "coach-library-tools",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												"aria-label": "Søg øvelse",
												value: librarySearch,
												onChange: (event) => setLibrarySearch(event.target.value),
												placeholder: `Søg i ${exerciseLibrary.length} øvelser…`
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
												"aria-label": "Kategori",
												value: libraryCategory,
												onChange: (event) => setLibraryCategory(event.target.value),
												children: categories.map((category) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: category }, category))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												"aria-label": "Fokusområde",
												value: libraryFocus,
												onChange: (event) => setLibraryFocus(event.target.value),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Alle",
													children: "Alle fokusområder"
												}), exerciseFocusTags.map((focus) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: focus }, focus))]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "coach-library-list",
										children: filteredExercises.slice(0, 120).map((exercise) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => addExercise(exercise),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: exercise.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
												exercise.category,
												" · ",
												exercise.difficulty,
												" · ",
												exercise.target
											] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "＋" })]
										}, exercise.name))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "coach-draft-list",
										children: [draft.exercises.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "coach-empty",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Passet er tomt." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Indlæs et vandpas eller tilføj øvelser fra biblioteket." })]
										}), draft.exercises.map((exercise, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: index + 1 }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: exercise.name }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												"aria-label": `Fjern ${exercise.name}`,
												onClick: () => removeExercise(index),
												children: "Fjern"
											})
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["SÆT", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												inputMode: "numeric",
												value: exercise.sets,
												onChange: (event) => updateExercise(index, "sets", event.target.value)
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [exercise.tracking === "distance" ? "DISTANCE" : "REPS", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: exercise.plannedReps,
												onChange: (event) => updateExercise(index, "plannedReps", event.target.value)
											})] }),
											exercise.tracking !== "distance" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["VÆGT", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: exercise.defaultWeight,
												onChange: (event) => updateExercise(index, "defaultWeight", event.target.value)
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["PAUSE", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												inputMode: "numeric",
												value: exercise.restSeconds,
												onChange: (event) => updateExercise(index, "restSeconds", event.target.value)
											})] })
										] })] }, `${exercise.name}-${index}`))]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "coach-save-plan",
										disabled: mutating || !draft.title.trim() || draft.exercises.length === 0,
										onClick: savePlan,
										children: mutating ? "Gemmer…" : draft.id ? "Gem ændringer hos atleten" : "Tildel passet til atleten"
									})
								]
							}),
							selectedPlans.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "coach-planned-list",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "TILDELT AF TRÆNER" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Kommende pas" })] }), selectedPlans.map((plan) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										plan.trainingType === "swim" ? "VAND" : "STYRKE",
										" · ",
										plan.scheduledDate
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: plan.title }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
										plan.exercises.length,
										" øvelser · ca. ",
										plan.duration,
										" min"
									] })
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => editPlan(plan),
									children: "Redigér"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "remove",
									disabled: mutating,
									onClick: () => removePlan(plan.programId),
									children: "Fjern"
								})] })] }, plan.programId))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "coach-history",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "UDFØRELSE" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Registrerede træninger" })] }), selected.sessions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "coach-empty",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Ingen træning registreret endnu." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Atletens udførte sæt vises her." })]
								}) : selected.sessions.map((session) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
									className: "coach-session",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "coach-session-head",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: session.date ?? "PLANLAGT PAS" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: session.title })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
												className: session.status,
												children: session.status === "completed" ? "UDFØRT" : "I GANG"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "coach-progress",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { width: `${Math.min(100, session.completedSets / Math.max(1, session.plannedSets) * 100)}%` } })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
											session.completedSets,
											" af ",
											session.plannedSets,
											" sæt · startet ",
											dateLabel(session.startedAt)
										] }),
										session.sets.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "coach-sets",
											children: session.sets.map((set, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												set.exerciseName,
												" · sæt ",
												set.setNumber
											] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
												set.weight === "0" ? set.reps : `${set.weight} kg × ${set.reps}`,
												" · ",
												set.effortMetric === "heart_rate_zone" ? `zone ${set.rpe}` : set.effortMetric === "rir" ? `${set.rpe} RIR` : `RPE ${set.rpe}`,
												set.techniqueQuality ? ` · teknik ${set.techniqueQuality === "good" ? "god" : set.techniqueQuality === "uncertain" ? "usikker" : "ikke god"}` : ""
											] })] }, `${set.exerciseName}-${set.setNumber}-${index}`))
										})
									]
								}, session.id))]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "coach-privacy",
					children: "Træneren ser kun pseudonyme testprofiler og træningsdata. Feedback, readiness og helbredsdata deles ikke."
				})
			] })
		]
	});
}
//#endregion
export { CoachDashboard };
