import { C as __toESM, t as require_jsx_runtime, y as require_react } from "../index.js";
import { t as Link } from "./link-xiHQ0wo4.js";
//#region app/owner/owner-dashboard.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var dateTimeLabel = (value) => {
	if (!value) return "Ingen aktivitet";
	const normalized = value.includes("T") ? value : `${value.replace(" ", "T")}Z`;
	const date = new Date(normalized);
	return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("da-DK", {
		dateStyle: "short",
		timeStyle: "short"
	}).format(date);
};
var dayLabel = (value) => new Intl.DateTimeFormat("da-DK", {
	day: "numeric",
	month: "short"
}).format(/* @__PURE__ */ new Date(`${value}T12:00:00Z`));
var percent = (value) => `${Math.round(value * 100)} %`;
var rating = (value) => value === null ? "—" : value.toLocaleString("da-DK", {
	minimumFractionDigits: 1,
	maximumFractionDigits: 1
});
function OwnerDashboard() {
	const [ownerKey, setOwnerKey] = (0, import_react.useState)("");
	const [data, setData] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [profile, setProfile] = (0, import_react.useState)("all");
	const [autoRefresh, setAutoRefresh] = (0, import_react.useState)(true);
	const loadDashboard = (0, import_react.useCallback)(async () => {
		if (ownerKey.length < 24) return;
		setLoading(true);
		setError("");
		try {
			const response = await fetch("/api/owner/dashboard", {
				headers: { authorization: `Bearer ${ownerKey}` },
				cache: "no-store"
			});
			const payload = await response.json().catch(() => null);
			if (!response.ok || !payload?.totals) throw new Error(payload?.error ?? "Dashboardet kunne ikke hentes.");
			setData(payload);
		} catch (loadError) {
			setData(null);
			setError(loadError instanceof Error ? loadError.message : "Dashboardet kunne ikke hentes.");
		} finally {
			setLoading(false);
		}
	}, [ownerKey]);
	(0, import_react.useEffect)(() => {
		if (!data || !autoRefresh) return;
		const interval = window.setInterval(() => {
			loadDashboard();
		}, 6e4);
		return () => window.clearInterval(interval);
	}, [
		autoRefresh,
		data,
		loadDashboard
	]);
	const visibleAthletes = (0, import_react.useMemo)(() => data?.athletes.filter((athlete) => profile === "all" || athlete.profile === profile) ?? [], [data, profile]);
	const chartMax = Math.max(1, ...data?.activity.map((day) => Math.max(day.started, day.completed)) ?? [1]);
	const profileMax = Math.max(1, ...data?.profiles.map((item) => item.athletes) ?? [1]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "owner-shell",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "owner-header",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						href: "/",
						children: "← Til BASE"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "EJER · LIVE TESTDATA"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "BASE-overblik" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Følg aktivitet, engagement, feedback og trænerdækning." })
				] }), data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "owner-freshness",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: loading ? "refreshing" : "" }),
						"Opdateret ",
						dateTimeLabel(data.generatedAt),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => void loadDashboard(),
							disabled: loading,
							children: loading ? "Henter…" : "Opdatér nu"
						})
					]
				})]
			}),
			!data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "owner-access-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Privat ejeradgang" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Dashboardet viser alle pseudonyme testdata og er kun beregnet til projektejeren." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["EJERNØGLE", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "password",
						value: ownerKey,
						onChange: (event) => setOwnerKey(event.target.value),
						placeholder: "Indtast din private nøgle"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => void loadDashboard(),
						disabled: ownerKey.length < 24 || loading,
						children: loading ? "Henter…" : "Åbn dashboard"
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "owner-error",
						role: "alert",
						children: error
					})
				]
			}),
			data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "owner-kpis",
					"aria-label": "Nøgletal",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "TESTERE" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: data.totals.testers }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
								data.totals.activated,
								" har startet · ",
								data.totals.coachAssigned,
								" træner-tildelt"
							] })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "GENNEMFØRTE PAS" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: data.totals.sessionsCompleted }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
								data.totals.sessionsStarted,
								" startet · ",
								percent(data.totals.completionRate),
								" gennemført"
							] })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "REGISTREREDE SÆT" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: data.totals.setsLogged }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "På tværs af alle testprofiler" })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "FEEDBACKSVAR" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: data.totals.feedbackResponses }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [percent(data.totals.feedbackCoverage), " af testerne har svaret"] })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: data.totals.needsAttention > 0 ? "attention" : "",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "KRÆVER OPMÆRKSOMHED" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: data.totals.needsAttention }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Ikke startet eller inaktiv i mindst 3 dage" })
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "owner-grid",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "owner-panel owner-activity-panel",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "owner-panel-head",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "AKTIVITET" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Seneste 14 dage" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "owner-legend",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "started" }), "Startet"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "completed" }), "Gennemført"] })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "owner-chart",
							"aria-label": "Startede og gennemførte træninger de seneste 14 dage",
							children: data.activity.map((day) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "owner-chart-day",
								title: `${dayLabel(day.date)}: ${day.started} startet, ${day.completed} gennemført, ${day.sets} sæt`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "owner-bars",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
										className: "started",
										style: { height: `${day.started / chartMax * 100}%` }
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
										className: "completed",
										style: { height: `${day.completed / chartMax * 100}%` }
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: dayLabel(day.date) })]
							}, day.date))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "owner-panel",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "owner-panel-head",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "PROFILFORDELING" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Testere og gennemførelse" })] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "owner-profile-list",
							children: data.profiles.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: profile === item.profile ? "active" : "",
								onClick: () => setProfile(profile === item.profile ? "all" : item.profile),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: item.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										item.completed,
										"/",
										item.started,
										" pas gennemført"
									] })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "owner-profile-bar",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { width: `${item.athletes / profileMax * 100}%` } })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: item.athletes })
								]
							}, item.profile))
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "owner-feedback-section",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "owner-section-title",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "FEEDBACKKVALITET" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Hvad fortæller testerne?" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							data.feedback.sessionResponses,
							" sessionssvar · ",
							data.feedback.finalResponses,
							" afsluttende · ",
							data.feedback.coachResponses,
							" fra trænere"
						] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "owner-ratings",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Brugervenlighed" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: rating(data.feedback.ease) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "ud af 5" })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tydelighed" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: rating(data.feedback.clarity) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "ud af 5" })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tillid" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: rating(data.feedback.trust) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "ud af 5" })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Oplevet værdi" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: rating(data.feedback.value) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "ud af 5" })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Friktion nævnt" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: data.feedback.frictionMentions }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "svar med konkret friktion" })
							] })
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "owner-athlete-section",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "owner-section-title",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "HANDLINGSLISTE" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Testere" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "owner-table-controls",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: profile === "all" ? "active" : "",
								onClick: () => setProfile("all"),
								children: "Alle profiler"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: autoRefresh,
								onChange: (event) => setAutoRefresh(event.target.checked)
							}), " Auto-opdatér"] })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "owner-table-wrap",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Tester" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Profil" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Pas" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Sæt" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Feedback" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Træner" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Senest aktiv" })
						] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [visibleAthletes.map((athlete) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: athlete.testerId }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: athlete.profileLabel }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `owner-status ${athlete.status}`,
								children: athlete.status === "active" ? "Aktiv" : athlete.status === "follow_up" ? "Følg op" : "Ikke startet"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [
								athlete.sessionsCompleted,
								"/",
								athlete.sessionsStarted
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: athlete.setsLogged }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: athlete.feedbackResponses }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: athlete.assignedToCoach ? "Ja" : "Nej" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: dateTimeLabel(athlete.lastActiveAt) })
						] }, athlete.testerId)), visibleAthletes.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 8,
							children: "Ingen testere i denne profil."
						}) })] })] })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "owner-source-note",
					children: "Kilde: BASE-testdatabasen · pseudonyme tester-ID’er · data opdateres ved åbning og hvert minut, når auto-opdatering er aktiv."
				})
			] })
		]
	});
}
//#endregion
export { OwnerDashboard };
