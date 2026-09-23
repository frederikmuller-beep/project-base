//#region app/exercise-units.ts
var unilateralExerciseUnits = {
	"Split squat": "ben",
	"Bulgarian split squat": "ben",
	"Single-leg Romanian deadlift": "ben",
	"Step-up": "ben",
	"Reverse lunge": "ben",
	"Lateral lunge": "ben",
	"Half-kneeling landmine press": "arm",
	"Single-arm cable pulldown": "arm",
	"Single-arm row with rotation": "arm",
	"Swim bench freestyle pull": "arm",
	"Band freestyle stroke": "arm",
	"Band backstroke pull": "arm",
	"Isometric catch hold": "arm",
	"Cable internal rotation": "arm",
	"Cable external rotation": "arm",
	"Pallof press": "side",
	"Side plank": "side",
	"Copenhagen plank": "side",
	"Bird dog": "side",
	"Dead bug": "side",
	"Rotational medicine ball throw": "side",
	"Tall-kneeling cable chop": "side",
	"Tall-kneeling cable lift": "side",
	"Suitcase carry": "side",
	"Cossack squat": "side",
	"World's greatest stretch": "side",
	"Overhead carry": "arm",
	"Enarmscrawl": "arm",
	"Enarmsrygcrawl": "arm",
	"Enarmsbutterfly": "arm",
	"Sidekick": "side"
};
var clarifyUnilateralReps = (exerciseName, reps) => {
	const unit = unilateralExerciseUnits[exerciseName];
	if (!unit || /\bpr\.\s/.test(reps)) return reps;
	return `${reps} pr. ${unit}`;
};
//#endregion
//#region app/exercise-data.ts
var exerciseFocusTags = [
	"Eksplosivitet",
	"Elastik",
	"Unilateral",
	"Koordination",
	"Core"
];
var exerciseLibrarySource = [
	{
		name: "Snatch",
		category: "Konkurrenceløft",
		target: "Helkrop · teknik",
		cue: "Tæt stang og aktiv modtagelse",
		sets: "5",
		reps: "2",
		weight: "60"
	},
	{
		name: "Hang snatch",
		category: "Snatch",
		target: "Timing · eksplosivitet",
		cue: "Hold spændingen over knæet",
		sets: "4",
		reps: "3",
		weight: "50"
	},
	{
		name: "Power snatch",
		category: "Snatch",
		target: "Hastighed · træk",
		cue: "Modtag stangen højt og stabilt",
		sets: "5",
		reps: "2",
		weight: "55"
	},
	{
		name: "Snatch balance",
		category: "Snatch",
		target: "Modtagelse · fodarbejde",
		cue: "Pres aktivt op mod stangen",
		sets: "4",
		reps: "3",
		weight: "45"
	},
	{
		name: "Clean & Jerk",
		category: "Konkurrenceløft",
		target: "Helkrop · teknik",
		cue: "Stabil clean før et roligt dip",
		sets: "5",
		reps: "1+1",
		weight: "80"
	},
	{
		name: "Hang clean",
		category: "Clean",
		target: "Position · turnover",
		cue: "Afslut benene før albuerne",
		sets: "4",
		reps: "3",
		weight: "70"
	},
	{
		name: "Power clean",
		category: "Clean",
		target: "Eksplosivitet · hastighed",
		cue: "Mød stangen – lad den ikke falde",
		sets: "5",
		reps: "2",
		weight: "75"
	},
	{
		name: "Push jerk",
		category: "Jerk",
		target: "Ben-drive · timing",
		cue: "Lodret dip og hurtig lockout",
		sets: "5",
		reps: "3",
		weight: "70"
	},
	{
		name: "Front squat",
		category: "Squat",
		target: "Ben · core",
		cue: "Albuer højt gennem hele løftet",
		sets: "4",
		reps: "4",
		weight: "90"
	},
	{
		name: "Back squat",
		category: "Squat",
		target: "Maksimal benstyrke",
		cue: "Stabil bracing og ensartet dybde",
		sets: "5",
		reps: "5",
		weight: "110"
	},
	{
		name: "Snatch pull",
		category: "Træk",
		target: "Ryg · position · kraft",
		cue: "Bevar skuldrene over stangen",
		sets: "4",
		reps: "3",
		weight: "80"
	},
	{
		name: "Clean pull",
		category: "Træk",
		target: "Ben · ryg · kraft",
		cue: "Skub gulvet væk og afslut lodret",
		sets: "4",
		reps: "3",
		weight: "110"
	},
	{
		name: "Strict press",
		category: "Assistance",
		target: "Skuldre · lockout",
		cue: "Spænd balder og hold ribben nede",
		sets: "4",
		reps: "6",
		weight: "40"
	},
	{
		name: "High hang snatch",
		category: "Snatch",
		target: "Timing · hurtighed",
		cue: "Bliv lodret og angrib under stangen",
		sets: "5",
		reps: "2",
		weight: "45"
	},
	{
		name: "Low hang snatch",
		category: "Snatch",
		target: "Position · tålmodighed",
		cue: "Hold rygvinklen til stangen passerer knæet",
		sets: "4",
		reps: "3",
		weight: "50"
	},
	{
		name: "Block snatch",
		category: "Snatch",
		target: "Eksplosivitet · position",
		cue: "Skab tryk før du accelererer",
		sets: "5",
		reps: "2",
		weight: "55"
	},
	{
		name: "Deficit snatch",
		category: "Snatch",
		target: "Startstyrke · ben",
		cue: "Pres gulvet væk uden at løfte hoften tidligt",
		sets: "4",
		reps: "2",
		weight: "50"
	},
	{
		name: "Pause snatch",
		category: "Snatch",
		target: "Kontrol · position",
		cue: "Frys positionen og behold balancen midt på foden",
		sets: "5",
		reps: "2",
		weight: "50"
	},
	{
		name: "No-foot snatch",
		category: "Snatch",
		target: "Balance · vertikal kraft",
		cue: "Stræk lodret uden at hoppe frem",
		sets: "4",
		reps: "3",
		weight: "45"
	},
	{
		name: "No-hook snatch",
		category: "Snatch",
		target: "Afslappede arme · timing",
		cue: "Lad benene drive løftet",
		sets: "4",
		reps: "3",
		weight: "40"
	},
	{
		name: "Muscle snatch",
		category: "Snatch",
		target: "Turnover · overkrop",
		cue: "Hold stangen tæt og afslut med aktive skuldre",
		sets: "4",
		reps: "4",
		weight: "35"
	},
	{
		name: "Tall snatch",
		category: "Snatch",
		target: "Turnover · hastighed",
		cue: "Træk dig direkte under stangen",
		sets: "4",
		reps: "3",
		weight: "30"
	},
	{
		name: "Snatch from power position",
		category: "Snatch",
		target: "Kontakt · timing",
		cue: "Bevar trykket i hele foden før eksplosiv afslutning",
		sets: "5",
		reps: "2",
		weight: "45"
	},
	{
		name: "Snatch from knee",
		category: "Snatch",
		target: "Knæpassage · position",
		cue: "Hold stangen tæt gennem knæpassagen",
		sets: "4",
		reps: "3",
		weight: "50"
	},
	{
		name: "Snatch from blocks below knee",
		category: "Snatch",
		target: "Første træk · position",
		cue: "Start roligt og accelerér efter knæet",
		sets: "4",
		reps: "2",
		weight: "55"
	},
	{
		name: "Snatch from blocks above knee",
		category: "Snatch",
		target: "Andet træk · kraft",
		cue: "Hold brystet over stangen til kontakt",
		sets: "5",
		reps: "2",
		weight: "55"
	},
	{
		name: "Power snatch + overhead squat",
		category: "Snatch",
		target: "Modtagelse · mobilitet",
		cue: "Stabilisér før du går kontrolleret ned",
		sets: "4",
		reps: "1+2",
		weight: "45"
	},
	{
		name: "Snatch + overhead squat",
		category: "Snatch",
		target: "Stabilitet · teknik",
		cue: "Behold aktive skuldre mellem løftene",
		sets: "4",
		reps: "1+1",
		weight: "50"
	},
	{
		name: "Snatch pull + snatch",
		category: "Snatch",
		target: "Trækbane · overførsel",
		cue: "Gentag samme bane i begge bevægelser",
		sets: "4",
		reps: "1+1",
		weight: "50"
	},
	{
		name: "Snatch deadlift",
		category: "Træk",
		target: "Position · bagkæde",
		cue: "Hold brystet over stangen og spænd lats",
		sets: "4",
		reps: "4",
		weight: "90"
	},
	{
		name: "Snatch grip RDL",
		category: "Træk",
		target: "Baglår · ryg",
		cue: "Skub hoften tilbage med stangen tæt",
		sets: "4",
		reps: "6",
		weight: "70"
	},
	{
		name: "Snatch grip push press",
		category: "Snatch",
		target: "Overheadstyrke · timing",
		cue: "Afslut benene og pres stangen lodret",
		sets: "4",
		reps: "5",
		weight: "45"
	},
	{
		name: "Overhead squat",
		category: "Snatch",
		target: "Mobilitet · stabilitet",
		cue: "Pres op i stangen og hold hele foden i gulvet",
		sets: "4",
		reps: "5",
		weight: "45"
	},
	{
		name: "High hang clean",
		category: "Clean",
		target: "Timing · hurtighed",
		cue: "Bliv høj og mød stangen hurtigt",
		sets: "5",
		reps: "2",
		weight: "65"
	},
	{
		name: "Low hang clean",
		category: "Clean",
		target: "Position · kraft",
		cue: "Hold spændingen under knæet",
		sets: "4",
		reps: "3",
		weight: "70"
	},
	{
		name: "Block clean",
		category: "Clean",
		target: "Eksplosivitet · turnover",
		cue: "Skab balance før den eksplosive afslutning",
		sets: "5",
		reps: "2",
		weight: "75"
	},
	{
		name: "Deficit clean",
		category: "Clean",
		target: "Startstyrke · ben",
		cue: "Pres jævnt gennem gulvet",
		sets: "4",
		reps: "2",
		weight: "70"
	},
	{
		name: "Pause clean",
		category: "Clean",
		target: "Kontrol · position",
		cue: "Bevar spændingen i pausen",
		sets: "5",
		reps: "2",
		weight: "70"
	},
	{
		name: "No-foot clean",
		category: "Clean",
		target: "Balance · vertikal kraft",
		cue: "Stræk lodret og land samme sted",
		sets: "4",
		reps: "3",
		weight: "65"
	},
	{
		name: "No-hook clean",
		category: "Clean",
		target: "Timing · afslappede arme",
		cue: "Hold armene lange gennem trækket",
		sets: "4",
		reps: "3",
		weight: "60"
	},
	{
		name: "Muscle clean",
		category: "Clean",
		target: "Turnover · albuer",
		cue: "Før albuerne hurtigt rundt om stangen",
		sets: "4",
		reps: "4",
		weight: "45"
	},
	{
		name: "Tall clean",
		category: "Clean",
		target: "Turnover · modtagelse",
		cue: "Træk kroppen hurtigt ned",
		sets: "4",
		reps: "3",
		weight: "40"
	},
	{
		name: "Clean from power position",
		category: "Clean",
		target: "Kontakt · timing",
		cue: "Hold balancen og afslut med benene",
		sets: "5",
		reps: "2",
		weight: "65"
	},
	{
		name: "Clean from knee",
		category: "Clean",
		target: "Knæpassage · position",
		cue: "Bevar skuldrene over stangen",
		sets: "4",
		reps: "3",
		weight: "70"
	},
	{
		name: "Clean from blocks below knee",
		category: "Clean",
		target: "Første træk · styrke",
		cue: "Pres roligt til stangen passerer knæet",
		sets: "4",
		reps: "2",
		weight: "75"
	},
	{
		name: "Clean from blocks above knee",
		category: "Clean",
		target: "Andet træk · kraft",
		cue: "Hold stangen tæt ind i kontakten",
		sets: "5",
		reps: "2",
		weight: "75"
	},
	{
		name: "Power clean + front squat",
		category: "Clean",
		target: "Modtagelse · benstyrke",
		cue: "Stabilisér før den kontrollerede squat",
		sets: "4",
		reps: "1+2",
		weight: "70"
	},
	{
		name: "Clean + front squat",
		category: "Clean",
		target: "Benstyrke · position",
		cue: "Hold albuerne højt mellem bevægelserne",
		sets: "4",
		reps: "1+1",
		weight: "75"
	},
	{
		name: "Clean deadlift",
		category: "Træk",
		target: "Position · bagkæde",
		cue: "Pres gulvet væk med brystet over stangen",
		sets: "4",
		reps: "4",
		weight: "120"
	},
	{
		name: "Clean grip RDL",
		category: "Træk",
		target: "Baglår · ryg",
		cue: "Hold lats spændte og hoften tilbage",
		sets: "4",
		reps: "6",
		weight: "90"
	},
	{
		name: "Split jerk",
		category: "Jerk",
		target: "Fodarbejde · lockout",
		cue: "Flyt fødderne hurtigt og land stabilt",
		sets: "5",
		reps: "2",
		weight: "75"
	},
	{
		name: "Power jerk",
		category: "Jerk",
		target: "Ben-drive · modtagelse",
		cue: "Pres dig hurtigt ned under stangen",
		sets: "5",
		reps: "2",
		weight: "70"
	},
	{
		name: "Squat jerk",
		category: "Jerk",
		target: "Mobilitet · modtagelse",
		cue: "Hold dip lodret og modtag aktivt",
		sets: "4",
		reps: "2",
		weight: "55"
	},
	{
		name: "Push press",
		category: "Jerk",
		target: "Ben-drive · skuldre",
		cue: "Afslut benene før armene",
		sets: "4",
		reps: "5",
		weight: "60"
	},
	{
		name: "Behind-the-neck push press",
		category: "Jerk",
		target: "Overheadstyrke · lodret bane",
		cue: "Hold hovedet neutralt og pres lige op",
		sets: "4",
		reps: "5",
		weight: "65"
	},
	{
		name: "Behind-the-neck split jerk",
		category: "Jerk",
		target: "Fodarbejde · sikkerhed",
		cue: "Fokusér på hurtig og balanceret landing",
		sets: "5",
		reps: "2",
		weight: "70"
	},
	{
		name: "Jerk from rack",
		category: "Jerk",
		target: "Teknik · belastning",
		cue: "Find balancen før hvert dip",
		sets: "5",
		reps: "2",
		weight: "80"
	},
	{
		name: "Jerk from blocks",
		category: "Jerk",
		target: "Ben-drive · gentagelser",
		cue: "Nulstil positionen mellem løftene",
		sets: "5",
		reps: "2",
		weight: "80"
	},
	{
		name: "Pause jerk",
		category: "Jerk",
		target: "Dipkontrol · timing",
		cue: "Hold trykket midt på foden i pausen",
		sets: "5",
		reps: "2",
		weight: "70"
	},
	{
		name: "Tall jerk",
		category: "Jerk",
		target: "Fodarbejde · lockout",
		cue: "Flyt fødderne uden ekstra dip",
		sets: "4",
		reps: "3",
		weight: "40"
	},
	{
		name: "Jerk balance",
		category: "Jerk",
		target: "Forreste fod · modtagelse",
		cue: "Træd frem og lås stangen samtidig",
		sets: "4",
		reps: "3",
		weight: "45"
	},
	{
		name: "Press in split",
		category: "Jerk",
		target: "Stabilitet · lockout",
		cue: "Hold hofterne under skuldrene",
		sets: "4",
		reps: "5",
		weight: "35"
	},
	{
		name: "Dip squat",
		category: "Jerk",
		target: "Dipstyrke · position",
		cue: "Bevar lodret torso og fuld fodkontakt",
		sets: "4",
		reps: "5",
		weight: "100"
	},
	{
		name: "Jerk dip + drive",
		category: "Jerk",
		target: "Ben-drive · rytme",
		cue: "Skift hurtigt retning uden at miste balancen",
		sets: "4",
		reps: "3",
		weight: "85"
	},
	{
		name: "Clean & push jerk",
		category: "Jerk",
		target: "Helkrop · teknik",
		cue: "Stabilisér clean før et lodret dip",
		sets: "5",
		reps: "1+1",
		weight: "75"
	},
	{
		name: "Pause front squat",
		category: "Squat",
		target: "Bundstyrke · position",
		cue: "Bevar spændingen og albuerne højt",
		sets: "4",
		reps: "3",
		weight: "85"
	},
	{
		name: "Tempo front squat",
		category: "Squat",
		target: "Kontrol · benstyrke",
		cue: "Brug tre sekunder ned og rejs dig aggressivt",
		sets: "4",
		reps: "4",
		weight: "75"
	},
	{
		name: "Pin front squat",
		category: "Squat",
		target: "Startstyrke · core",
		cue: "Start spændt fra en helt stille position",
		sets: "5",
		reps: "3",
		weight: "80"
	},
	{
		name: "Front squat + jerk",
		category: "Squat",
		target: "Ben · overførsel",
		cue: "Brug en stabil squat til at sætte jerken op",
		sets: "4",
		reps: "2+1",
		weight: "75"
	},
	{
		name: "Pause back squat",
		category: "Squat",
		target: "Bundstyrke · kontrol",
		cue: "Hold spændingen gennem hele pausen",
		sets: "4",
		reps: "4",
		weight: "95"
	},
	{
		name: "Tempo back squat",
		category: "Squat",
		target: "Kontrol · muskelstyrke",
		cue: "Kontrollér vejen ned og behold balancen",
		sets: "4",
		reps: "5",
		weight: "90"
	},
	{
		name: "High-bar back squat",
		category: "Squat",
		target: "Benstyrke · oprejst position",
		cue: "Hold knæene fremme og brystet højt",
		sets: "5",
		reps: "5",
		weight: "105"
	},
	{
		name: "Low-bar back squat",
		category: "Squat",
		target: "Bagkæde · maksimal styrke",
		cue: "Skab en stabil hylde og pres gennem hoften",
		sets: "5",
		reps: "5",
		weight: "120"
	},
	{
		name: "Box squat",
		category: "Squat",
		target: "Bagkæde · kontrol",
		cue: "Sæt dig kontrolleret og behold spændingen",
		sets: "4",
		reps: "5",
		weight: "100"
	},
	{
		name: "Anderson squat",
		category: "Squat",
		target: "Startstyrke · ben",
		cue: "Byg spænding før stangen forlader pins",
		sets: "5",
		reps: "3",
		weight: "90"
	},
	{
		name: "Split squat",
		category: "Squat",
		target: "Ensidig benstyrke · balance",
		cue: "Hold forreste fod stabil og torso høj",
		sets: "4",
		reps: "6",
		weight: "40"
	},
	{
		name: "Bulgarian split squat",
		category: "Squat",
		target: "Ensidig styrke · stabilitet",
		cue: "Sænk bageste knæ kontrolleret",
		sets: "4",
		reps: "8 pr. ben",
		weight: "35"
	},
	{
		name: "Snatch high pull",
		category: "Træk",
		target: "Kraft · albueføring",
		cue: "Afslut benene før albuerne går op",
		sets: "4",
		reps: "4",
		weight: "75"
	},
	{
		name: "Clean high pull",
		category: "Træk",
		target: "Kraft · afslutning",
		cue: "Hold stangen tæt og afslut lodret",
		sets: "4",
		reps: "4",
		weight: "100"
	},
	{
		name: "Snatch pull from blocks",
		category: "Træk",
		target: "Andet træk · belastning",
		cue: "Start balanceret og accelerér gennem kontakten",
		sets: "4",
		reps: "3",
		weight: "85"
	},
	{
		name: "Clean pull from blocks",
		category: "Træk",
		target: "Andet træk · kraft",
		cue: "Hold skuldrene over stangen længst muligt",
		sets: "4",
		reps: "3",
		weight: "115"
	},
	{
		name: "Snatch pull with pause",
		category: "Træk",
		target: "Position · kontrol",
		cue: "Bevar spændingen i pausen ved knæet",
		sets: "4",
		reps: "3",
		weight: "80"
	},
	{
		name: "Clean pull with pause",
		category: "Træk",
		target: "Position · benstyrke",
		cue: "Hold hele foden i gulvet under pausen",
		sets: "4",
		reps: "3",
		weight: "110"
	},
	{
		name: "Snatch deficit pull",
		category: "Træk",
		target: "Startstyrke · position",
		cue: "Pres jævnt uden at ændre rygvinklen",
		sets: "4",
		reps: "3",
		weight: "75"
	},
	{
		name: "Clean deficit pull",
		category: "Træk",
		target: "Startstyrke · ben",
		cue: "Hold brystet over stangen fra gulvet",
		sets: "4",
		reps: "3",
		weight: "105"
	},
	{
		name: "Bænkpres",
		category: "Assistance",
		target: "Bryst · triceps",
		cue: "Hold skulderbladene stabile mod bænken",
		sets: "4",
		reps: "6",
		weight: "70"
	},
	{
		name: "Pendlay row",
		category: "Assistance",
		target: "Øvre ryg · trækstyrke",
		cue: "Hold ryggen fast og træk mod nederste ribben",
		sets: "4",
		reps: "6",
		weight: "70"
	},
	{
		name: "Pull-up",
		category: "Assistance",
		target: "Ryg · greb",
		cue: "Start med aktive skuldre og undgå kip",
		sets: "4",
		reps: "6",
		weight: "0"
	},
	{
		name: "Romanian deadlift",
		category: "Assistance",
		target: "Baglår · bagkæde",
		cue: "Skub hoften tilbage med neutral ryg",
		sets: "4",
		reps: "8",
		weight: "90"
	},
	{
		name: "Plank",
		category: "Assistance",
		target: "Core · stabilitet",
		cue: "Spænd balder og hold ribben nede",
		sets: "4",
		reps: "30",
		weight: "0"
	},
	{
		name: "Lat pulldown",
		category: "Assistance",
		target: "Ryg · trækstyrke",
		cue: "Hold ribben nede og før albuerne mod siden",
		sets: "4",
		reps: "8",
		weight: "45"
	},
	{
		name: "Seated cable row",
		category: "Assistance",
		target: "Øvre ryg · holdning",
		cue: "Saml skulderbladene uden at læne dig tilbage",
		sets: "4",
		reps: "10",
		weight: "40"
	},
	{
		name: "Push-up",
		category: "Assistance",
		target: "Bryst · skulderkontrol",
		cue: "Bevar en lang kropslinje og lad skulderbladene bevæge sig",
		sets: "4",
		reps: "10",
		weight: "0"
	},
	{
		name: "Half-kneeling landmine press",
		category: "Assistance",
		target: "Skulder · core",
		cue: "Hold ribben nede og pres skråt frem",
		sets: "3",
		reps: "8",
		weight: "25"
	},
	{
		name: "Pallof press",
		category: "Assistance",
		target: "Core · antirotation",
		cue: "Hold bryst og hofter lige frem",
		sets: "3",
		reps: "10",
		weight: "12"
	},
	{
		name: "Dead bug",
		category: "Assistance",
		target: "Core · kontrol",
		cue: "Hold lænden roligt mod gulvet",
		sets: "3",
		reps: "10",
		weight: "0"
	},
	{
		name: "Side plank",
		category: "Assistance",
		target: "Core · sidestabilitet",
		cue: "Hold kroppen lang fra hoved til fod",
		sets: "3",
		reps: "30 sek",
		weight: "0"
	},
	{
		name: "Copenhagen plank",
		category: "Assistance",
		target: "Hofte · core",
		cue: "Hold bækkenet højt og stabilt",
		sets: "3",
		reps: "20 sek",
		weight: "0"
	},
	{
		name: "Bird dog",
		category: "Assistance",
		target: "Core · krydsstabilitet",
		cue: "Undgå rotation mens arm og ben strækkes",
		sets: "3",
		reps: "10",
		weight: "0"
	},
	{
		name: "Box jump",
		category: "Assistance",
		target: "Ben · eksplosivitet",
		cue: "Land blødt og stop før springhøjden falder",
		sets: "5",
		reps: "3",
		weight: "0"
	},
	{
		name: "Medicine ball slam",
		category: "Assistance",
		target: "Helkrop · power",
		cue: "Skab kraft fra hele kroppen og kast hurtigt",
		sets: "5",
		reps: "5",
		weight: "6"
	},
	{
		name: "Band external rotation",
		category: "Assistance",
		target: "Rotatorcuff · skulderkontrol",
		cue: "Hold albuen tæt og brug let modstand",
		sets: "3",
		reps: "12",
		weight: "5"
	},
	{
		name: "Calf raise",
		category: "Assistance",
		target: "Læg · ankelstyrke",
		cue: "Arbejd gennem fuldt bevægeudslag",
		sets: "3",
		reps: "12",
		weight: "30"
	},
	{
		name: "Single-leg Romanian deadlift",
		category: "Assistance",
		target: "Bagkæde · hoftestabilitet",
		cue: "Hold bækkenet lige og bevæg dig fra hoften",
		sets: "3",
		reps: "8",
		weight: "20"
	},
	{
		name: "Dødløft",
		category: "Assistance",
		target: "Bagkæde · maksimal styrke",
		cue: "Spænd op før stangen forlader gulvet, og hold den tæt",
		sets: "4",
		reps: "5",
		weight: "100"
	},
	{
		name: "Dips",
		category: "Assistance",
		target: "Bryst · triceps · skulderstabilitet",
		cue: "Hold skuldrene nede og arbejd i et kontrolleret bevægeudslag",
		sets: "4",
		reps: "8",
		weight: "0"
	},
	{
		name: "Hip thrust",
		category: "Assistance",
		target: "Balder · hofteekstension",
		cue: "Hold ribbenene nede og afslut med fuld hoftestræk",
		sets: "4",
		reps: "8",
		weight: "80"
	},
	{
		name: "Dumbbell shoulder press",
		category: "Assistance",
		target: "Skuldre · triceps",
		cue: "Pres håndvægtene op uden at overstrække lænden",
		sets: "3",
		reps: "8",
		weight: "20"
	},
	{
		name: "Farmer's walk",
		category: "Assistance",
		target: "Greb · core · holdning",
		cue: "Gå roligt med høj kropsholdning og stabile skuldre",
		sets: "4",
		reps: "30 m",
		weight: "30"
	},
	{
		name: "Face pull",
		category: "Assistance",
		target: "Øvre ryg · bagskulder",
		cue: "Træk mod ansigtet og afslut med skulderbladene samlet",
		sets: "3",
		reps: "12",
		weight: "15"
	},
	{
		name: "Straight-arm pulldown",
		category: "Svømmestyrke",
		target: "Lats · trækkets afslutning",
		cue: "Hold armene lange og før hænderne mod lårene",
		sets: "3",
		reps: "10",
		weight: "25"
	},
	{
		name: "Single-arm cable pulldown",
		category: "Svømmestyrke",
		target: "Lats · ensidig trækkraft",
		cue: "Træk albuen ned uden at rotere overkroppen",
		sets: "3",
		reps: "10",
		weight: "20"
	},
	{
		name: "Swim bench freestyle pull",
		category: "Svømmestyrke",
		target: "Crawl · trækkraft på land",
		cue: "Efterlign et højt albuegreb med rolig kontrol",
		sets: "4",
		reps: "8",
		weight: "10"
	},
	{
		name: "Swim bench butterfly pull",
		category: "Svømmestyrke",
		target: "Butterfly · symmetrisk trækkraft",
		cue: "Før begge arme gennem samme bane uden at løfte skuldrene",
		sets: "4",
		reps: "8",
		weight: "10"
	},
	{
		name: "Band freestyle stroke",
		category: "Svømmestyrke",
		target: "Crawl · rytme · skulderudholdenhed",
		cue: "Hold kroppen stabil og før én arm ad gangen",
		sets: "3",
		reps: "12",
		weight: "5"
	},
	{
		name: "Band butterfly stroke",
		category: "Svømmestyrke",
		target: "Butterfly · rytme · lats",
		cue: "Træk begge arme samtidigt med bløde albuer",
		sets: "3",
		reps: "12",
		weight: "5"
	},
	{
		name: "Band breaststroke pull",
		category: "Svømmestyrke",
		target: "Brystsvømning · indadføring",
		cue: "Hold albuerne høje og saml hænderne kontrolleret",
		sets: "3",
		reps: "12",
		weight: "5"
	},
	{
		name: "Band backstroke pull",
		category: "Svømmestyrke",
		target: "Rygcrawl · bagskulder · lats",
		cue: "Før armen gennem trækket uden at dreje brystet",
		sets: "3",
		reps: "12",
		weight: "5"
	},
	{
		name: "Streamline lat pulldown",
		category: "Svømmestyrke",
		target: "Streamline · lats · core",
		cue: "Start med armene samlet over hovedet og hold ribbenene nede",
		sets: "3",
		reps: "10",
		weight: "25"
	},
	{
		name: "Streamline overhead hold",
		category: "Svømmestyrke",
		target: "Streamline · skulderstabilitet",
		cue: "Pres armene sammen og hold en lang kropslinje",
		sets: "3",
		reps: "30 sek",
		weight: "5"
	},
	{
		name: "Prone swimmer",
		category: "Svømmestyrke",
		target: "Skuldre · øvre ryg · bevægelighed",
		cue: "Før armene roligt fra streamline til hofterne",
		sets: "3",
		reps: "8",
		weight: "0"
	},
	{
		name: "Prone Y-T-W",
		category: "Svømmestyrke",
		target: "Skulderblade · rotatorcuff",
		cue: "Løft armene let uden at spænde i nakken",
		sets: "3",
		reps: "6+6+6",
		weight: "2"
	},
	{
		name: "Serratus wall slide",
		category: "Svømmestyrke",
		target: "Serratus · skulderkontrol",
		cue: "Pres underarmene mod væggen og glid kontrolleret op",
		sets: "3",
		reps: "10",
		weight: "0"
	},
	{
		name: "Scapular pull-up",
		category: "Svømmestyrke",
		target: "Skulderblade · aktivt hæng",
		cue: "Hold armene lange og sænk skuldrene væk fra ørerne",
		sets: "3",
		reps: "8",
		weight: "0"
	},
	{
		name: "Scapular push-up",
		category: "Svømmestyrke",
		target: "Serratus · skulderblade",
		cue: "Hold albuerne strakte og bevæg kun skulderbladene",
		sets: "3",
		reps: "12",
		weight: "0"
	},
	{
		name: "Cable internal rotation",
		category: "Svømmestyrke",
		target: "Rotatorcuff · indadrotation",
		cue: "Hold albuen tæt ind til siden og brug let belastning",
		sets: "3",
		reps: "12",
		weight: "5"
	},
	{
		name: "Cable external rotation",
		category: "Svømmestyrke",
		target: "Rotatorcuff · udadrotation",
		cue: "Bevar albuen i samme position gennem hele bevægelsen",
		sets: "3",
		reps: "12",
		weight: "5"
	},
	{
		name: "Wall angel",
		category: "Svømmestyrke",
		target: "Brystryg · skulderbevægelighed",
		cue: "Hold ribbenene nede og armene tæt på væggen",
		sets: "3",
		reps: "10",
		weight: "0"
	},
	{
		name: "Overhead medicine ball throw",
		category: "Svømmestyrke",
		target: "Start · vending · eksplosivitet",
		cue: "Skab kraft fra ben og core før armene afslutter",
		sets: "5",
		reps: "4",
		weight: "4"
	},
	{
		name: "Rotational medicine ball throw",
		category: "Svømmestyrke",
		target: "Rotation · core · kraftoverførsel",
		cue: "Drej fra hofterne og hold knæene stabile",
		sets: "4",
		reps: "5",
		weight: "4"
	},
	{
		name: "Tall-kneeling cable chop",
		category: "Svømmestyrke",
		target: "Core · diagonal kraft",
		cue: "Hold hofterne stabile mens hænderne føres ned over kroppen",
		sets: "3",
		reps: "10",
		weight: "15"
	},
	{
		name: "Tall-kneeling cable lift",
		category: "Svømmestyrke",
		target: "Core · skulderkontrol",
		cue: "Før hænderne diagonalt op uden at svaje i lænden",
		sets: "3",
		reps: "10",
		weight: "12"
	},
	{
		name: "Single-arm row with rotation",
		category: "Svømmestyrke",
		target: "Træk · kropsrotation",
		cue: "Træk albuen tilbage og rotér kontrolleret gennem brystryggen",
		sets: "3",
		reps: "8",
		weight: "20"
	},
	{
		name: "Isometric catch hold",
		category: "Svømmestyrke",
		target: "Greb i vandet · skulderudholdenhed",
		cue: "Hold høj albue mod elastikkens træk uden at løfte skulderen",
		sets: "4",
		reps: "20 sek",
		weight: "5"
	},
	{
		name: "Goblet squat",
		category: "Assistance",
		target: "Ben · core · teknik",
		cue: "Hold vægten tæt ved brystet og knæene stabile",
		sets: "4",
		reps: "8",
		weight: "24"
	},
	{
		name: "Trap bar deadlift",
		category: "Assistance",
		target: "Ben · bagkæde · greb",
		cue: "Pres gulvet væk og afslut med hofterne",
		sets: "4",
		reps: "5",
		weight: "100"
	},
	{
		name: "Step-up",
		category: "Assistance",
		target: "Ensidig benstyrke · stabilitet",
		cue: "Pres gennem hele foden og undgå afsæt fra bagbenet",
		sets: "3",
		reps: "8",
		weight: "20"
	},
	{
		name: "Reverse lunge",
		category: "Assistance",
		target: "Ben · balance · hoftekontrol",
		cue: "Træd roligt tilbage og hold forreste knæ stabilt",
		sets: "3",
		reps: "8",
		weight: "20"
	},
	{
		name: "Lateral lunge",
		category: "Assistance",
		target: "Hofte · inderlår · sidekraft",
		cue: "Sæt hoften tilbage over det bøjede ben",
		sets: "3",
		reps: "8",
		weight: "16"
	},
	{
		name: "Glute bridge",
		category: "Assistance",
		target: "Balder · hofteekstension",
		cue: "Pres gennem hælene og hold ribbenene nede",
		sets: "3",
		reps: "12",
		weight: "20"
	},
	{
		name: "Nordic hamstring curl",
		category: "Assistance",
		target: "Baglår · excentrisk styrke",
		cue: "Sænk kroppen langsomt med hoften strakt",
		sets: "3",
		reps: "5",
		weight: "0"
	},
	{
		name: "Lying leg curl",
		category: "Assistance",
		target: "Baglår · knækontrol",
		cue: "Hold hoften i bænken og sænk vægten kontrolleret",
		sets: "3",
		reps: "10",
		weight: "30"
	},
	{
		name: "Leg press",
		category: "Assistance",
		target: "Ben · generel styrke",
		cue: "Hold ryggen stabil og arbejd gennem et smertefrit bevægeudslag",
		sets: "4",
		reps: "8",
		weight: "120"
	},
	{
		name: "Chest-supported dumbbell row",
		category: "Assistance",
		target: "Øvre ryg · lats",
		cue: "Hold brystet mod bænken og træk albuerne tilbage",
		sets: "4",
		reps: "8",
		weight: "20"
	},
	{
		name: "Incline dumbbell bench press",
		category: "Assistance",
		target: "Bryst · skuldre · triceps",
		cue: "Hold skulderbladene stabile og sænk håndvægtene roligt",
		sets: "4",
		reps: "8",
		weight: "20"
	},
	{
		name: "Cable chest press",
		category: "Assistance",
		target: "Bryst · serratus · core",
		cue: "Pres frem uden at rotere kroppen",
		sets: "3",
		reps: "10",
		weight: "20"
	},
	{
		name: "Landmine row",
		category: "Assistance",
		target: "Ryg · greb · bagkæde",
		cue: "Hold ryggen stabil og træk vægten mod brystet",
		sets: "4",
		reps: "8",
		weight: "40"
	},
	{
		name: "Suitcase carry",
		category: "Assistance",
		target: "Core · greb · sidestabilitet",
		cue: "Gå højt uden at læne dig mod vægten",
		sets: "4",
		reps: "30 m",
		weight: "24"
	},
	{
		name: "Hollow body hold",
		category: "Assistance",
		target: "Core · kropslinje",
		cue: "Hold lænden mod gulvet og kroppen lang",
		sets: "3",
		reps: "30 sek",
		weight: "0"
	},
	{
		name: "Ab wheel rollout",
		category: "Assistance",
		target: "Core · anti-ekstension",
		cue: "Hold bækkenet stabilt og rul kun så langt du kan kontrollere",
		sets: "3",
		reps: "8",
		weight: "0"
	},
	{
		name: "Crawl catch-up",
		category: "Svømning",
		target: "Crawl · timing",
		cue: "Lad hænderne mødes foran kroppen før næste armtag",
		sets: "4",
		reps: "25 m",
		weight: "0",
		format: "distance"
	},
	{
		name: "Crawl med knyttede næver",
		category: "Svømning",
		target: "Crawl · vandføling",
		cue: "Hold høj albue og mærk trykket på underarmen",
		sets: "4",
		reps: "25 m",
		weight: "0",
		format: "distance"
	},
	{
		name: "Crawl fingertip drag",
		category: "Svømning",
		target: "Crawl · afslappet fremføring",
		cue: "Lad fingerspidserne strejfe vandet med høj albue",
		sets: "4",
		reps: "25 m",
		weight: "0",
		format: "distance"
	},
	{
		name: "Enarmscrawl",
		category: "Svømning",
		target: "Crawl · rotation",
		cue: "Hold den passive arm fremme og roter fra hoften",
		sets: "4",
		reps: "25 m",
		weight: "0",
		format: "distance"
	},
	{
		name: "6-1-6 sideskift",
		category: "Svømning",
		target: "Crawl · balance",
		cue: "Seks benspark på siden, ét armtag og roligt sideskift",
		sets: "4",
		reps: "25 m",
		weight: "0",
		format: "distance"
	},
	{
		name: "Sculling foran",
		category: "Svømning",
		target: "Vandføling · indgreb",
		cue: "Små bevægelser med albuerne højt og tryk på håndfladen",
		sets: "4",
		reps: "25 m",
		weight: "0",
		format: "distance"
	},
	{
		name: "Sculling midt",
		category: "Svømning",
		target: "Vandføling · trækfase",
		cue: "Hold overarmene stabile og arbejd med underarmene",
		sets: "4",
		reps: "25 m",
		weight: "0",
		format: "distance"
	},
	{
		name: "Benspark med plade",
		category: "Svømning",
		target: "Ben · udholdenhed",
		cue: "Små spark fra hoften og afslappede ankler",
		sets: "6",
		reps: "25 m",
		weight: "0",
		format: "distance"
	},
	{
		name: "Sidekick",
		category: "Svømning",
		target: "Kropslinje · balance",
		cue: "Hold kroppen lang og det nederste øre tæt ved armen",
		sets: "4",
		reps: "25 m",
		weight: "0",
		format: "distance"
	},
	{
		name: "Streamline-benspark på ryggen",
		category: "Svømning",
		target: "Streamline · ben",
		cue: "Klem armene om ørerne og hold hoften højt",
		sets: "4",
		reps: "25 m",
		weight: "0",
		format: "distance"
	},
	{
		name: "Delfinbenspark på ryggen",
		category: "Svømning",
		target: "Undervandsfase · core",
		cue: "Skab bølgen fra brystkassen og hold knæene samlet",
		sets: "6",
		reps: "15 m",
		weight: "0",
		format: "distance"
	},
	{
		name: "Brystsvømning med glidepause",
		category: "Svømning",
		target: "Bryst · timing",
		cue: "Afslut hvert spark i en lang, rolig streamline",
		sets: "4",
		reps: "25 m",
		weight: "0",
		format: "distance"
	},
	{
		name: "Brystbenspark med plade",
		category: "Svømning",
		target: "Bryst · benspark",
		cue: "Før hælene roligt op og accelerér fødderne bagud",
		sets: "4",
		reps: "25 m",
		weight: "0",
		format: "distance"
	},
	{
		name: "Brystarme med pull buoy",
		category: "Svømning",
		target: "Bryst · armtag",
		cue: "Hold trækket kompakt og før hænderne hurtigt frem",
		sets: "4",
		reps: "25 m",
		weight: "0",
		format: "distance"
	},
	{
		name: "Enarmsrygcrawl",
		category: "Svømning",
		target: "Rygcrawl · rotation",
		cue: "Roter kroppen samlet og hold hovedet roligt",
		sets: "4",
		reps: "25 m",
		weight: "0",
		format: "distance"
	},
	{
		name: "Rygcrawl 6-kick switch",
		category: "Svømning",
		target: "Rygcrawl · balance",
		cue: "Seks benspark på siden og et kontrolleret armtag",
		sets: "4",
		reps: "25 m",
		weight: "0",
		format: "distance"
	},
	{
		name: "Butterfly 3-3-3",
		category: "Svømning",
		target: "Butterfly · rytme",
		cue: "Tre tag med hver arm og tre hele tag med samme rytme",
		sets: "4",
		reps: "25 m",
		weight: "0",
		format: "distance"
	},
	{
		name: "Enarmsbutterfly",
		category: "Svømning",
		target: "Butterfly · timing",
		cue: "Bevar to benspark pr. cyklus og en lav fremføring",
		sets: "4",
		reps: "25 m",
		weight: "0",
		format: "distance"
	},
	{
		name: "Crawl med pull buoy",
		category: "Svømning",
		target: "Crawl · armtag",
		cue: "Hold benene rolige og fasthold et tidligt indgreb",
		sets: "6",
		reps: "50 m",
		weight: "0",
		format: "distance"
	},
	{
		name: "Teknikcrawl med paddles",
		category: "Svømning",
		target: "Crawl · greb",
		cue: "Svøm kontrolleret og stop hvis grebet eller skulderen svigter",
		sets: "4",
		reps: "50 m",
		weight: "0",
		format: "distance"
	},
	{
		name: "Indsvømning",
		category: "Svømning",
		target: "Opvarmning · rytme",
		cue: "Start roligt og øg bevægeudslaget gradvist",
		sets: "4",
		reps: "100 m",
		weight: "0",
		format: "distance"
	},
	{
		name: "Aerob crawl",
		category: "Svømning",
		target: "Udholdenhed · pacing",
		cue: "Hold et tempo du kan gentage med samme teknik",
		sets: "6",
		reps: "200 m",
		weight: "0",
		format: "distance"
	},
	{
		name: "Tærskel crawl",
		category: "Svømning",
		target: "Tærskel · fartkontrol",
		cue: "Svøm kontrolleret hårdt med ensartede splittider",
		sets: "8",
		reps: "100 m",
		weight: "0",
		format: "distance"
	},
	{
		name: "Race pace",
		category: "Svømning",
		target: "Konkurrencefart · rytme",
		cue: "Prioritér præcis fart og teknik frem for ekstra gentagelser",
		sets: "8",
		reps: "50 m",
		weight: "0",
		format: "distance"
	},
	{
		name: "Sprint fra afsæt",
		category: "Svømning",
		target: "Acceleration · topfart",
		cue: "Eksplodér fra væggen og stop før teknikken falder",
		sets: "8",
		reps: "25 m",
		weight: "0",
		format: "distance"
	},
	{
		name: "Startspring og undervand",
		category: "Svømning",
		target: "Start · breakout",
		cue: "Gentag samme opsætning og hold en stram streamline",
		sets: "8",
		reps: "15 m",
		weight: "0",
		format: "distance"
	},
	{
		name: "Vendingstræning",
		category: "Svømning",
		target: "Vending · acceleration",
		cue: "Gå hurtigt ind, roter kompakt og skub i en fast linje",
		sets: "8",
		reps: "15 m",
		weight: "0",
		format: "distance"
	},
	{
		name: "Udsvømning",
		category: "Svømning",
		target: "Restitution · bevægelse",
		cue: "Sænk tempoet og find en rolig vejrtrækning",
		sets: "4",
		reps: "100 m",
		weight: "0",
		format: "distance"
	}
];
var catalogHighlights = [
	{
		name: "2500 m temposvømning",
		category: "Svømning",
		target: "Tempo · udholdenhed",
		cue: "Hold jævne splittider og stabil teknik",
		sets: "1",
		reps: "2500 m",
		weight: "0",
		format: "distance",
		sports: ["long_distance", "middle_distance"],
		difficulty: "Øvet",
		visibility: "coach_only",
		focus: "Tempo"
	},
	{
		name: "3000 m intervalløb",
		category: "Løb",
		target: "10 km-fart · intervaller",
		cue: "Hold den aftalte fart med kontrollerede pauser",
		sets: "6",
		reps: "500 m",
		weight: "0",
		format: "distance",
		sports: ["running"],
		difficulty: "Øvet",
		visibility: "coach_only",
		focus: "10 km-fart"
	},
	{
		name: "Suicide runs",
		category: "Fodbold",
		target: "Kampkondition · retningsskift",
		cue: "Brems kontrolleret og accelerér med god position",
		sets: "6",
		reps: "120 m",
		weight: "0",
		format: "distance",
		sports: [
			"football",
			"american_football",
			"handball"
		],
		difficulty: "Avanceret",
		visibility: "coach_only",
		focus: "Gentagen sprint"
	},
	{
		name: "Brick-interval",
		category: "Triathlon",
		target: "Skift · udholdenhed",
		cue: "Bevar teknik gennem skiftet mellem discipliner",
		sets: "4",
		reps: "1000 m",
		weight: "0",
		format: "distance",
		sports: ["triathlon", "ironman"],
		difficulty: "Øvet",
		visibility: "coach_only",
		focus: "Skift"
	},
	{
		name: "Cykelinterval",
		category: "Cykling",
		target: "Tærskel · kadence",
		cue: "Hold stabil kadence og den aftalte pulszone",
		sets: "5",
		reps: "2000 m",
		weight: "0",
		format: "distance",
		sports: ["cycling"],
		difficulty: "Øvet",
		visibility: "coach_only",
		focus: "Tærskel"
	},
	{
		name: "10-yard sprint",
		category: "Amerikansk fodbold",
		target: "Acceleration · første skridt",
		cue: "Start stabilt og accelerér gennem hele distancen",
		sets: "8",
		reps: "10 m",
		weight: "0",
		format: "distance",
		sports: ["american_football", "athletics"],
		difficulty: "Øvet",
		visibility: "coach_only",
		focus: "Acceleration"
	}
];
var curatedSportExercises = [
	{
		name: "Roligt kontinuerligt løb",
		category: "Løb",
		target: "Aerob base · løbeøkonomi",
		cue: "Hold et roligt tempo, hvor vejrtrækningen er kontrolleret",
		sets: "1",
		reps: "5000 m",
		weight: "0",
		format: "distance",
		sports: [
			"running",
			"triathlon",
			"ironman",
			"athletics",
			"football",
			"handball",
			"american_football",
			"hyrox"
		],
		difficulty: "Begynder",
		visibility: "coach_only",
		focus: "Aerob base"
	},
	{
		name: "Progressivt 5 km-løb",
		category: "Løb",
		target: "Pacing · 10 km-form",
		cue: "Start roligt og øg farten gradvist uden at sprinte til sidst",
		sets: "1",
		reps: "5000 m",
		weight: "0",
		format: "distance",
		sports: [
			"running",
			"triathlon",
			"ironman",
			"athletics"
		],
		difficulty: "Øvet",
		visibility: "coach_only",
		focus: "Pacing"
	},
	{
		name: "Tærskelintervaller 4 × 1000 m",
		category: "Løb",
		target: "Tærskel · fartudholdenhed",
		cue: "Løb ensartede intervaller med kontrolleret hård indsats",
		sets: "4",
		reps: "1000 m",
		weight: "0",
		format: "distance",
		sports: [
			"running",
			"triathlon",
			"ironman",
			"athletics",
			"hyrox"
		],
		difficulty: "Øvet",
		visibility: "coach_only",
		focus: "Tærskel"
	},
	{
		name: "10 km-tempo 6 × 800 m",
		category: "Løb",
		target: "10 km-fart · rytme",
		cue: "Hold målfarten og afslut hvert interval med samme teknik",
		sets: "6",
		reps: "800 m",
		weight: "0",
		format: "distance",
		sports: [
			"running",
			"triathlon",
			"athletics"
		],
		difficulty: "Avanceret",
		visibility: "coach_only",
		focus: "10 km-fart"
	},
	{
		name: "Bakkeintervaller 8 × 200 m",
		category: "Løb",
		target: "Løbestyrke · acceleration",
		cue: "Løb med korte skridt, høj hofte og kontrolleret returpause",
		sets: "8",
		reps: "200 m",
		weight: "0",
		format: "distance",
		sports: [
			"running",
			"triathlon",
			"athletics",
			"football",
			"handball",
			"american_football",
			"hyrox"
		],
		difficulty: "Øvet",
		visibility: "coach_only",
		focus: "Løbestyrke"
	},
	{
		name: "Restitutionsløb 3 km",
		category: "Løb",
		target: "Restitution · bevægelse",
		cue: "Hold pulsen lav og stop, hvis benene føles dårligere undervejs",
		sets: "1",
		reps: "3000 m",
		weight: "0",
		format: "distance",
		sports: [
			"running",
			"triathlon",
			"ironman",
			"football",
			"handball",
			"american_football",
			"hyrox"
		],
		difficulty: "Begynder",
		visibility: "coach_only",
		focus: "Restitution"
	},
	{
		name: "Repeated sprint 6 × 30 m",
		category: "Holdsport",
		target: "Gentagen acceleration · kampfart",
		cue: "Accelerér skarpt og bevar samme kvalitet på alle gentagelser",
		sets: "6",
		reps: "30 m",
		weight: "0",
		format: "distance",
		sports: [
			"football",
			"handball",
			"american_football"
		],
		difficulty: "Øvet",
		visibility: "coach_only",
		focus: "Gentagen sprint"
	},
	{
		name: "5-10-5 shuttle run",
		category: "Holdsport",
		target: "Retningsskift · acceleration",
		cue: "Sænk tyngdepunktet før vendingen og accelerér ud af første skridt",
		sets: "6",
		reps: "20 m",
		weight: "0",
		format: "distance",
		sports: [
			"football",
			"handball",
			"american_football",
			"athletics"
		],
		difficulty: "Øvet",
		visibility: "coach_only",
		focus: "Retningsskift"
	},
	{
		name: "Kampintervaller 12 × 100 m",
		category: "Holdsport",
		target: "Kampkondition · gentagen fart",
		cue: "Hold en fart, der kan gentages uden markant fald i løbeteknik",
		sets: "12",
		reps: "100 m",
		weight: "0",
		format: "distance",
		sports: [
			"football",
			"handball",
			"american_football"
		],
		difficulty: "Avanceret",
		visibility: "coach_only",
		focus: "Kampkondition"
	},
	{
		name: "Sprintacceleration 8 × 20 m",
		category: "Holdsport",
		target: "Første skridt · topfart",
		cue: "Brug fuld pause og stop, når accelerationen bliver langsommere",
		sets: "8",
		reps: "20 m",
		weight: "0",
		format: "distance",
		sports: [
			"football",
			"handball",
			"american_football",
			"athletics"
		],
		difficulty: "Øvet",
		visibility: "coach_only",
		focus: "Acceleration"
	},
	{
		name: "Retningsskift 6 × 40 m",
		category: "Holdsport",
		target: "Bremsning · re-acceleration",
		cue: "Brems over flere skridt og hold knæet stabilt gennem vendingen",
		sets: "6",
		reps: "40 m",
		weight: "0",
		format: "distance",
		sports: [
			"football",
			"handball",
			"american_football"
		],
		difficulty: "Øvet",
		visibility: "coach_only",
		focus: "Retningsskift"
	},
	{
		name: "Tempo shuttle 10 × 60 m",
		category: "Holdsport",
		target: "Aerob kampkapacitet · pacing",
		cue: "Løb kontrolleret og ram samme tid på alle gentagelser",
		sets: "10",
		reps: "60 m",
		weight: "0",
		format: "distance",
		sports: [
			"football",
			"handball",
			"american_football"
		],
		difficulty: "Begynder",
		visibility: "coach_only",
		focus: "Kampkapacitet"
	},
	{
		name: "Aerob cykling 20 km",
		category: "Cykling",
		target: "Aerob base · trådøkonomi",
		cue: "Hold stabil kadence og puls i den aftalte zone",
		sets: "1",
		reps: "20000 m",
		weight: "0",
		format: "distance",
		sports: [
			"cycling",
			"triathlon",
			"ironman"
		],
		difficulty: "Begynder",
		visibility: "coach_only",
		focus: "Aerob base"
	},
	{
		name: "Tærskelblokke på cykel",
		category: "Cykling",
		target: "Tærskel · vedvarende effekt",
		cue: "Hold samme kadence og indsats gennem alle blokke",
		sets: "5",
		reps: "3000 m",
		weight: "0",
		format: "distance",
		sports: [
			"cycling",
			"triathlon",
			"ironman"
		],
		difficulty: "Øvet",
		visibility: "coach_only",
		focus: "Tærskel"
	},
	{
		name: "Korte cykelsprinter",
		category: "Cykling",
		target: "Topkraft · acceleration",
		cue: "Brug fuld kontrol i opbygningen og stop før effekten falder",
		sets: "8",
		reps: "250 m",
		weight: "0",
		format: "distance",
		sports: ["cycling", "triathlon"],
		difficulty: "Avanceret",
		visibility: "coach_only",
		focus: "Sprintkraft"
	},
	{
		name: "Bakkeintervaller på cykel",
		category: "Cykling",
		target: "Benstyrke · tærskel",
		cue: "Hold overkroppen rolig og træd jævnt gennem hele bakken",
		sets: "6",
		reps: "1500 m",
		weight: "0",
		format: "distance",
		sports: [
			"cycling",
			"triathlon",
			"ironman"
		],
		difficulty: "Øvet",
		visibility: "coach_only",
		focus: "Benudholdenhed"
	},
	{
		name: "Kadenceintervaller",
		category: "Cykling",
		target: "Trådøkonomi · teknik",
		cue: "Øg kadencen uden at miste kontrol over hofter og overkrop",
		sets: "6",
		reps: "1000 m",
		weight: "0",
		format: "distance",
		sports: [
			"cycling",
			"triathlon",
			"ironman"
		],
		difficulty: "Begynder",
		visibility: "coach_only",
		focus: "Kadence"
	},
	{
		name: "Restitutionscykling 10 km",
		category: "Cykling",
		target: "Restitution · cirkulation",
		cue: "Kør let med lav modstand og rolig vejrtrækning",
		sets: "1",
		reps: "10000 m",
		weight: "0",
		format: "distance",
		sports: [
			"cycling",
			"triathlon",
			"ironman"
		],
		difficulty: "Begynder",
		visibility: "coach_only",
		focus: "Restitution"
	},
	{
		name: "Cykel-løb brick",
		category: "Triathlon",
		target: "Skifteevne · løberytme",
		cue: "Skift hurtigt og find en stabil løberytme uden at åbne for hårdt",
		sets: "3",
		reps: "2000 m",
		weight: "0",
		format: "distance",
		sports: ["triathlon", "ironman"],
		difficulty: "Øvet",
		visibility: "coach_only",
		focus: "Skift"
	},
	{
		name: "Lang brick-session",
		category: "Triathlon",
		target: "Udholdenhed · raceforberedelse",
		cue: "Prioritér jævn energi og disciplineret intensitet gennem hele passet",
		sets: "2",
		reps: "10000 m",
		weight: "0",
		format: "distance",
		sports: ["triathlon", "ironman"],
		difficulty: "Avanceret",
		visibility: "coach_only",
		focus: "Raceforberedelse"
	},
	{
		name: "SkiErg 6 × 500 m",
		category: "Skisport",
		target: "Stavkraft · kondition",
		cue: "Hold hoften aktiv og gentag samme træklængde",
		sets: "6",
		reps: "500 m",
		weight: "0",
		format: "distance",
		sports: [
			"skiing",
			"hyrox",
			"crossfit"
		],
		difficulty: "Øvet",
		visibility: "coach_only",
		focus: "Stavkraft"
	},
	{
		name: "Dobbeltstav 5 × 1000 m",
		category: "Skisport",
		target: "Styrkeudholdenhed · rytme",
		cue: "Skab tryk fra core og hofte uden at forkorte stavtaget",
		sets: "5",
		reps: "1000 m",
		weight: "0",
		format: "distance",
		sports: ["skiing"],
		difficulty: "Avanceret",
		visibility: "coach_only",
		focus: "Styrkeudholdenhed"
	},
	{
		name: "Romaskine 6 × 500 m",
		category: "Kondition",
		target: "Helkropskapacitet · pacing",
		cue: "Hold samme split og rytme gennem alle intervaller",
		sets: "6",
		reps: "500 m",
		weight: "0",
		format: "distance",
		sports: [
			"hyrox",
			"crossfit",
			"triathlon"
		],
		difficulty: "Øvet",
		visibility: "coach_only",
		focus: "Kapacitet"
	},
	{
		name: "Hyrox løbeinterval 8 × 1000 m",
		category: "Hyrox",
		target: "Løbsøkonomi · konkurrencefart",
		cue: "Hold den planlagte Hyrox-fart og stabil teknik efter stationerne",
		sets: "8",
		reps: "1000 m",
		weight: "0",
		format: "distance",
		sports: ["hyrox"],
		difficulty: "Avanceret",
		visibility: "coach_only",
		focus: "Løbsøkonomi"
	},
	{
		name: "Sled push",
		category: "Hyrox",
		target: "Ben · stationsstyrke",
		cue: "Hold korte skridt, spændt core og konstant tryk i slæden",
		sets: "4",
		reps: "20 m",
		weight: "100",
		sports: ["hyrox", "american_football"],
		difficulty: "Øvet",
		visibility: "athlete",
		focus: "Stationsstyrke"
	},
	{
		name: "Sled pull",
		category: "Hyrox",
		target: "Ryg · greb · stationsstyrke",
		cue: "Hold rebbanen rolig og træk med stabile hofter",
		sets: "4",
		reps: "20 m",
		weight: "75",
		sports: ["hyrox", "american_football"],
		difficulty: "Øvet",
		visibility: "athlete",
		focus: "Stationsstyrke"
	},
	{
		name: "Farmers carry",
		category: "Hyrox",
		target: "Greb · core · gangstyrke",
		cue: "Gå højt med korte kontrollerede skridt og stabile skuldre",
		sets: "4",
		reps: "50 m",
		weight: "48",
		sports: ["hyrox", "crossfit"],
		difficulty: "Øvet",
		visibility: "athlete",
		focus: "Carry"
	},
	{
		name: "Sandbag walking lunges",
		category: "Hyrox",
		target: "Ben · ensidig styrkeudholdenhed",
		cue: "Hold knæet stabilt og gentag samme skridtlængde",
		sets: "4",
		reps: "20 skridt",
		weight: "20",
		sports: ["hyrox", "crossfit"],
		difficulty: "Øvet",
		visibility: "athlete",
		focus: "Styrkeudholdenhed"
	},
	{
		name: "Wall balls",
		category: "Hyrox",
		target: "Ben · pres · arbejdskapacitet",
		cue: "Brug en ensartet squatdybde og kast til samme mål hver gang",
		sets: "4",
		reps: "20",
		weight: "6",
		sports: ["hyrox", "crossfit"],
		difficulty: "Øvet",
		visibility: "athlete",
		focus: "Arbejdskapacitet"
	},
	{
		name: "Burpee broad jumps",
		category: "Hyrox",
		target: "Helkrop · fremdrift",
		cue: "Find en rytme, du kan gentage uden at miste landingskontrol",
		sets: "4",
		reps: "10",
		weight: "0",
		sports: ["hyrox", "crossfit"],
		difficulty: "Avanceret",
		visibility: "athlete",
		focus: "Arbejdskapacitet"
	},
	{
		name: "Kettlebell swing",
		category: "CrossFit",
		target: "Hofteekstension · power",
		cue: "Skab kraft fra hoften og hold armene afslappede",
		sets: "4",
		reps: "12",
		weight: "24",
		sports: ["crossfit", "hyrox"],
		difficulty: "Øvet",
		visibility: "athlete",
		focus: "Power"
	},
	{
		name: "Dumbbell thruster",
		category: "CrossFit",
		target: "Ben · pres · kapacitet",
		cue: "Brug benenes fremdrift og hold håndvægtene i en stabil bane",
		sets: "4",
		reps: "10",
		weight: "15",
		sports: ["crossfit", "hyrox"],
		difficulty: "Øvet",
		visibility: "athlete",
		focus: "Mixed modal"
	},
	{
		name: "Toes-to-bar",
		category: "CrossFit",
		target: "Core · gymnastisk træk",
		cue: "Start med aktive skuldre og kontroller svinget",
		sets: "4",
		reps: "8",
		weight: "0",
		sports: ["crossfit"],
		difficulty: "Avanceret",
		visibility: "athlete",
		focus: "Gymnastik"
	},
	{
		name: "Handstand push-up",
		category: "CrossFit",
		target: "Skuldre · gymnastisk pres",
		cue: "Hold en stabil kropslinje og arbejd i et kontrolleret bevægeudslag",
		sets: "4",
		reps: "6",
		weight: "0",
		sports: ["crossfit"],
		difficulty: "Avanceret",
		visibility: "athlete",
		focus: "Gymnastik"
	},
	{
		name: "Jerk-fodarbejde uden vægt",
		category: "Vægtløftning",
		target: "Fodarbejde · timing",
		cue: "Flyt fødderne hurtigt til en stabil splitposition og nulstil roligt",
		sets: "5",
		reps: "3",
		weight: "0",
		sports: ["weightlifting"],
		difficulty: "Begynder",
		visibility: "athlete",
		focus: "Teknik"
	},
	{
		name: "Lateral skater jump",
		category: "Skisport",
		target: "Sidekraft · enbensbalance",
		cue: "Land stabilt på ét ben før næste afsæt",
		sets: "4",
		reps: "6 pr. side",
		weight: "0",
		sports: [
			"skiing",
			"athletics",
			"football",
			"handball"
		],
		difficulty: "Øvet",
		visibility: "athlete",
		focus: "Sidekraft"
	},
	{
		name: "Cable rotation",
		category: "Golf",
		target: "Rotation · core",
		cue: "Roter gennem brystryg og hofte uden at miste fodtrykket",
		sets: "3",
		reps: "8 pr. side",
		weight: "15",
		sports: ["golf"],
		difficulty: "Øvet",
		visibility: "athlete",
		focus: "Rotation"
	},
	{
		name: "Hip airplane",
		category: "Golf",
		target: "Hoftekontrol · balance",
		cue: "Hold standbenet stabilt og roter bækkenet langsomt",
		sets: "3",
		reps: "6 pr. side",
		weight: "0",
		sports: [
			"golf",
			"running",
			"triathlon"
		],
		difficulty: "Øvet",
		visibility: "athlete",
		focus: "Hoftekontrol"
	},
	{
		name: "Landmine rotation",
		category: "Golf",
		target: "Rotation · kraftoverførsel",
		cue: "Flyt kraften fra ben og hofte gennem en stabil core",
		sets: "4",
		reps: "6 pr. side",
		weight: "20",
		sports: [
			"golf",
			"athletics",
			"handball"
		],
		difficulty: "Øvet",
		visibility: "athlete",
		focus: "Rotation"
	},
	{
		name: "Pogo jumps",
		category: "Atletik",
		target: "Ankelstivhed · reaktiv styrke",
		cue: "Hold kontakttiden kort og land på samme sted",
		sets: "4",
		reps: "12",
		weight: "0",
		sports: [
			"athletics",
			"running",
			"football",
			"handball"
		],
		difficulty: "Øvet",
		visibility: "athlete",
		focus: "Reaktiv styrke"
	}
];
var broadLandSports = [
	"weightlifting",
	"long_distance",
	"middle_distance",
	"sprint",
	"recreational",
	"athletics",
	"golf",
	"running",
	"powerlifting",
	"skiing",
	"triathlon",
	"ironman",
	"hyrox",
	"crossfit",
	"cycling",
	"american_football",
	"football",
	"handball"
];
var supplementalFocusExercises = [
	{
		name: "Depth jump",
		category: "Eksplosivitet",
		target: "Reaktiv styrke · landing",
		cue: "Træd ned, land kort og spring straks op med stabil knælinje",
		sets: "4",
		reps: "4",
		weight: "0",
		sports: broadLandSports,
		difficulty: "Avanceret",
		visibility: "athlete",
		focus: "Reaktiv styrke"
	},
	{
		name: "Broad jump",
		category: "Eksplosivitet",
		target: "Horisontal power · landing",
		cue: "Skab kraft gennem hoften og land balanceret på begge fødder",
		sets: "5",
		reps: "3",
		weight: "0",
		sports: broadLandSports,
		difficulty: "Øvet",
		visibility: "athlete",
		focus: "Horisontal power"
	},
	{
		name: "Jump squat",
		category: "Eksplosivitet",
		target: "Ben · eksplosivitet",
		cue: "Brug let belastning, spring maksimalt og land roligt før næste gentagelse",
		sets: "4",
		reps: "5",
		weight: "20",
		sports: broadLandSports,
		difficulty: "Øvet",
		visibility: "athlete",
		focus: "Eksplosivitet"
	},
	{
		name: "Plyometric push-up",
		category: "Eksplosivitet",
		target: "Bryst · eksplosivt pres",
		cue: "Pres hurtigt fra gulvet og land med bløde albuer",
		sets: "4",
		reps: "5",
		weight: "0",
		sports: broadLandSports,
		difficulty: "Avanceret",
		visibility: "athlete",
		focus: "Overkropspower"
	},
	{
		name: "Medicine ball chest pass",
		category: "Eksplosivitet",
		target: "Bryst · kastekraft",
		cue: "Kast eksplosivt fra en stabil kropsposition og nulstil mellem kast",
		sets: "5",
		reps: "5",
		weight: "5",
		sports: broadLandSports,
		difficulty: "Begynder",
		visibility: "athlete",
		focus: "Kastekraft"
	},
	{
		name: "Medicine ball scoop toss",
		category: "Eksplosivitet",
		target: "Hofte · rotationskraft",
		cue: "Start kraften fra ben og hofte og afslut kastet uden at overrotere",
		sets: "4",
		reps: "5 pr. side",
		weight: "5",
		sports: broadLandSports,
		difficulty: "Øvet",
		visibility: "athlete",
		focus: "Rotationspower"
	},
	{
		name: "Banded pull-apart",
		category: "Elastik",
		target: "Øvre ryg · skulderkontrol",
		cue: "Hold ribbenene nede og træk elastikken fra hinanden uden at løfte skuldrene",
		sets: "3",
		reps: "15",
		weight: "0",
		sports: broadLandSports,
		difficulty: "Begynder",
		visibility: "athlete",
		focus: "Skulderkontrol"
	},
	{
		name: "Banded face pull",
		category: "Elastik",
		target: "Øvre ryg · bagskulder",
		cue: "Træk mod øjenhøjde og afslut med underarmene lodrette",
		sets: "3",
		reps: "12",
		weight: "0",
		sports: broadLandSports,
		difficulty: "Begynder",
		visibility: "athlete",
		focus: "Skulderrobusthed"
	},
	{
		name: "Banded lateral walk",
		category: "Elastik",
		target: "Hofte · knækontrol",
		cue: "Hold konstant spænding i elastikken og bækkenet i ro",
		sets: "3",
		reps: "10 pr. side",
		weight: "0",
		sports: broadLandSports,
		difficulty: "Begynder",
		visibility: "athlete",
		focus: "Hoftekontrol"
	},
	{
		name: "Banded good morning",
		category: "Elastik",
		target: "Bagkæde · hoftehængsel",
		cue: "Skub hoften tilbage og bevar en lang neutral ryg",
		sets: "3",
		reps: "12",
		weight: "0",
		sports: broadLandSports,
		difficulty: "Begynder",
		visibility: "athlete",
		focus: "Bagkæde"
	},
	{
		name: "Banded hip-flexion march",
		category: "Elastik",
		target: "Hoftebøjer · løbestabilitet",
		cue: "Løft ét knæ uden at læne kroppen eller miste bækkenkontrol",
		sets: "3",
		reps: "10 pr. side",
		weight: "0",
		sports: broadLandSports,
		difficulty: "Øvet",
		visibility: "athlete",
		focus: "Hoftekontrol"
	},
	{
		name: "Banded Pallof press",
		category: "Elastik",
		target: "Core · antirotation",
		cue: "Pres hænderne frem og modstå elastikkens rotation",
		sets: "3",
		reps: "10 pr. side",
		weight: "0",
		sports: broadLandSports,
		difficulty: "Begynder",
		visibility: "athlete",
		focus: "Antirotation"
	},
	{
		name: "Single-arm dumbbell bench press",
		category: "Unilateral",
		target: "Bryst · ensidig corekontrol",
		cue: "Hold bækken og ribben lige, mens én arm presser",
		sets: "4",
		reps: "8 pr. side",
		weight: "20",
		sports: broadLandSports,
		difficulty: "Øvet",
		visibility: "athlete",
		focus: "Ensidigt pres"
	},
	{
		name: "Single-arm dumbbell overhead press",
		category: "Unilateral",
		target: "Skulder · ensidig stabilitet",
		cue: "Pres lodret uden at læne overkroppen til siden",
		sets: "3",
		reps: "8 pr. side",
		weight: "15",
		sports: broadLandSports,
		difficulty: "Øvet",
		visibility: "athlete",
		focus: "Ensidigt pres"
	},
	{
		name: "Single-arm cable row",
		category: "Unilateral",
		target: "Ryg · ensidig trækkraft",
		cue: "Træk albuen tilbage uden at rotere kroppen",
		sets: "4",
		reps: "8 pr. side",
		weight: "25",
		sports: broadLandSports,
		difficulty: "Begynder",
		visibility: "athlete",
		focus: "Ensidigt træk"
	},
	{
		name: "Single-leg squat to box",
		category: "Unilateral",
		target: "Ben · balance · knækontrol",
		cue: "Sæt dig kontrolleret til boksen og pres op gennem hele foden",
		sets: "3",
		reps: "6 pr. side",
		weight: "0",
		sports: broadLandSports,
		difficulty: "Øvet",
		visibility: "athlete",
		focus: "Ensidig benstyrke"
	},
	{
		name: "Single-leg calf raise",
		category: "Unilateral",
		target: "Læg · ankelkontrol",
		cue: "Arbejd gennem fuldt bevægeudslag uden at rulle ud over foden",
		sets: "3",
		reps: "12 pr. side",
		weight: "10",
		sports: broadLandSports,
		difficulty: "Begynder",
		visibility: "athlete",
		focus: "Ensidig lægstyrke"
	},
	{
		name: "Single-arm farmer carry",
		category: "Unilateral",
		target: "Greb · lateral core",
		cue: "Gå højt uden at læne dig mod vægten",
		sets: "4",
		reps: "30 m pr. side",
		weight: "24",
		sports: broadLandSports,
		difficulty: "Øvet",
		visibility: "athlete",
		focus: "Ensidig carry"
	},
	{
		name: "A-skip",
		category: "Koordination",
		target: "Løberytme · fodisæt",
		cue: "Hold en høj kropsposition og ram jorden aktivt under hoften",
		sets: "4",
		reps: "20 m",
		weight: "0",
		sports: broadLandSports,
		difficulty: "Begynder",
		visibility: "athlete",
		focus: "Løbekoordination"
	},
	{
		name: "Lateral ladder drill",
		category: "Koordination",
		target: "Fodarbejde · rytme",
		cue: "Arbejd let på fødderne og øg først farten, når mønsteret er sikkert",
		sets: "4",
		reps: "2 gennemløb",
		weight: "0",
		sports: broadLandSports,
		difficulty: "Begynder",
		visibility: "athlete",
		focus: "Fodarbejde"
	},
	{
		name: "Carioca drill",
		category: "Koordination",
		target: "Hoftekoordination · sidebevægelse",
		cue: "Roter gennem hoften med rolig overkrop og jævn rytme",
		sets: "4",
		reps: "20 m pr. side",
		weight: "0",
		sports: broadLandSports,
		difficulty: "Øvet",
		visibility: "athlete",
		focus: "Koordination"
	},
	{
		name: "Cross-crawl",
		category: "Koordination",
		target: "Krydskoordination · core",
		cue: "Bevæg modsatte arm og ben langsomt uden at miste kropslinjen",
		sets: "3",
		reps: "10 pr. side",
		weight: "0",
		sports: broadLandSports,
		difficulty: "Begynder",
		visibility: "athlete",
		focus: "Krydskoordination"
	},
	{
		name: "Single-leg balance reach",
		category: "Koordination",
		target: "Balance · ankel · hofte",
		cue: "Hold standbenet stabilt og nå kontrolleret i flere retninger",
		sets: "3",
		reps: "5 pr. side",
		weight: "0",
		sports: broadLandSports,
		difficulty: "Begynder",
		visibility: "athlete",
		focus: "Balance"
	},
	{
		name: "Stir-the-pot",
		category: "Core",
		target: "Core · anti-ekstension",
		cue: "Hold kroppen stabil og tegn små cirkler med underarmene",
		sets: "3",
		reps: "8 hver vej",
		weight: "0",
		sports: broadLandSports,
		difficulty: "Avanceret",
		visibility: "athlete",
		focus: "Corekontrol"
	},
	{
		name: "Bear crawl",
		category: "Core",
		target: "Core · skulderstabilitet · koordination",
		cue: "Hold knæene tæt over gulvet og bevæg modsatte hånd og fod sammen",
		sets: "4",
		reps: "20 m",
		weight: "0",
		sports: broadLandSports,
		difficulty: "Øvet",
		visibility: "athlete",
		focus: "Corekoordination"
	},
	{
		name: "Body saw",
		category: "Core",
		target: "Core · anti-ekstension",
		cue: "Bevar bækkenet neutralt, mens kroppen glider kontrolleret frem og tilbage",
		sets: "3",
		reps: "10",
		weight: "0",
		sports: broadLandSports,
		difficulty: "Øvet",
		visibility: "athlete",
		focus: "Corekontrol"
	},
	{
		name: "Half-kneeling anti-rotation hold",
		category: "Core",
		target: "Antirotation · hoftekontrol",
		cue: "Hold bryst og bækken lige frem mod kabeltrækket",
		sets: "3",
		reps: "20 sek pr. side",
		weight: "12",
		sports: broadLandSports,
		difficulty: "Begynder",
		visibility: "athlete",
		focus: "Antirotation"
	},
	{
		name: "Cable dead bug",
		category: "Core",
		target: "Core · krydsstabilitet",
		cue: "Hold lænden stabil, mens modsatte arm og ben strækkes",
		sets: "3",
		reps: "8 pr. side",
		weight: "10",
		sports: broadLandSports,
		difficulty: "Øvet",
		visibility: "athlete",
		focus: "Corekontrol"
	}
];
var inferredTags = (exercise) => {
	const text = `${exercise.name} ${exercise.category} ${exercise.target} ${exercise.focus ?? ""}`.toLocaleLowerCase("da-DK");
	const tags = [];
	if (/eksplos|power|spring|jump|kast|throw|slam|sprint|acceleration|reaktiv|snatch|clean|jerk/.test(text)) tags.push("Eksplosivitet");
	if (/band|elastik/.test(text)) tags.push("Elastik");
	if (/single|enarm|enben|ensidig|split|lunge|step-up|pr\. side|pr\. ben/.test(text)) tags.push("Unilateral");
	if (/koordination|balance|fodarbejde|timing|ladder|a-skip|carioca|cross-crawl|skater|agility|retningsskift/.test(text)) tags.push("Koordination");
	if (/core|plank|pallof|dead bug|bird dog|hollow|ab wheel|carry|rotation|stabilitet|anti-ekstension|antirotation/.test(text)) tags.push("Core");
	return tags;
};
var normalizeExercise = (exercise) => ({
	...exercise,
	reps: clarifyUnilateralReps(exercise.name, exercise.reps),
	sports: exercise.sports ?? (exercise.category === "Svømning" || exercise.category === "Svømmestyrke" ? [
		"long_distance",
		"middle_distance",
		"sprint",
		"triathlon",
		"ironman"
	] : ["weightlifting", "recreational"]),
	difficulty: exercise.difficulty ?? "Øvet",
	visibility: exercise.visibility ?? (exercise.category === "Svømning" ? "coach_only" : "athlete"),
	focus: exercise.focus ?? exercise.target.split("·")[0].trim(),
	tags: Array.from(new Set([...exercise.tags ?? [], ...inferredTags(exercise)]))
});
var exerciseLibrary = [
	...exerciseLibrarySource,
	...catalogHighlights,
	...curatedSportExercises,
	...supplementalFocusExercises
].map(normalizeExercise);
//#endregion
//#region app/program-data.ts
var weekProgressions = [
	{
		week: 1,
		phase: "Fundament",
		loadFactor: 1,
		setDelta: 0,
		repDelta: 0,
		distanceFactor: 1,
		intensity: "Moderat",
		rirTarget: "3–4 RIR",
		heartRateTarget: "Pulszone 2–3",
		summary: "Find sikre startvægte og ensartet teknik."
	},
	{
		week: 2,
		phase: "Fundament",
		loadFactor: 1.025,
		setDelta: 0,
		repDelta: 0,
		distanceFactor: 1.05,
		intensity: "Moderat+",
		rirTarget: "3 RIR",
		heartRateTarget: "Pulszone 2–3",
		summary: "Lidt mere belastning uden at miste kvalitet."
	},
	{
		week: 3,
		phase: "Akkumulering",
		loadFactor: 1.05,
		setDelta: 1,
		repDelta: 0,
		distanceFactor: 1.1,
		intensity: "Moderat · mere volumen",
		rirTarget: "2–3 RIR",
		heartRateTarget: "Pulszone 2–4",
		summary: "Ugens højeste arbejdsmængde bygger kapacitet."
	},
	{
		week: 4,
		phase: "Deload",
		loadFactor: .9,
		setDelta: -1,
		repDelta: 0,
		distanceFactor: .7,
		intensity: "Let",
		rirTarget: "4–6 RIR",
		heartRateTarget: "Pulszone 1–2",
		summary: "Volumen og belastning sænkes for at absorbere arbejdet."
	},
	{
		week: 5,
		phase: "Opbygning",
		loadFactor: 1.05,
		setDelta: 0,
		repDelta: 0,
		distanceFactor: 1.08,
		intensity: "Moderat+",
		rirTarget: "2–3 RIR",
		heartRateTarget: "Pulszone 2–3",
		summary: "Ny blok starter over det første fundament."
	},
	{
		week: 6,
		phase: "Opbygning",
		loadFactor: 1.075,
		setDelta: 1,
		repDelta: 0,
		distanceFactor: 1.15,
		intensity: "Moderat/hård · mere volumen",
		rirTarget: "2 RIR",
		heartRateTarget: "Pulszone 2–4",
		summary: "Mere samlet arbejde før intensiteten stiger."
	},
	{
		week: 7,
		phase: "Intensivering",
		loadFactor: 1.1,
		setDelta: 0,
		repDelta: -1,
		distanceFactor: 1.08,
		intensity: "Hård · kontrolleret",
		rirTarget: "1–3 RIR",
		heartRateTarget: "Pulszone 3–4",
		summary: "Højere belastning og færre gentagelser pr. sæt."
	},
	{
		week: 8,
		phase: "Deload",
		loadFactor: .95,
		setDelta: -1,
		repDelta: 0,
		distanceFactor: .75,
		intensity: "Let",
		rirTarget: "4–6 RIR",
		heartRateTarget: "Pulszone 1–2",
		summary: "Trætheden sænkes før den specifikke blok."
	},
	{
		week: 9,
		phase: "Intensivering",
		loadFactor: 1.1,
		setDelta: -1,
		repDelta: -1,
		distanceFactor: 1,
		intensity: "Hård · lavere volumen",
		rirTarget: "1–3 RIR",
		heartRateTarget: "Pulszone 3–4",
		summary: "Mere specifik intensitet med færre arbejdssæt."
	},
	{
		week: 10,
		phase: "Intensivering",
		loadFactor: 1.125,
		setDelta: -1,
		repDelta: -1,
		distanceFactor: 1.05,
		intensity: "Hård",
		rirTarget: "1–2 RIR",
		heartRateTarget: "Pulszone 3–4",
		summary: "Belastningen stiger, mens volumen holdes kontrolleret."
	},
	{
		week: 11,
		phase: "Topning",
		loadFactor: 1.15,
		setDelta: -1,
		repDelta: -2,
		distanceFactor: .9,
		intensity: "Høj kvalitet",
		rirTarget: "1–2 RIR",
		heartRateTarget: "Pulszone 4",
		summary: "De tungeste eller hurtigste kvalitetsarbejder i forløbet."
	},
	{
		week: 12,
		phase: "Realisering",
		loadFactor: 1.075,
		setDelta: -2,
		repDelta: -2,
		distanceFactor: .6,
		intensity: "Lav volumen · friskhed",
		rirTarget: "2–4 RIR",
		heartRateTarget: "Pulszone 2–3",
		summary: "Volumen falder markant, så udviklingen kan vurderes frisk."
	}
];
var getWeekProgression = (week) => weekProgressions[Math.min(11, Math.max(0, week - 1))];
var roundedLoad = (weight) => {
	const increment = weight < 40 ? .5 : 2.5;
	return Math.round(weight / increment) * increment;
};
var adjustStrengthReps = (reps, delta) => {
	if (delta === 0 || reps.includes("+") || /\b(?:m|min|sek|runde)\b/i.test(reps)) return reps;
	const match = reps.match(/^(\d+)(.*)$/);
	if (!match) return reps;
	return `${Math.max(1, Number(match[1]) + delta)}${match[2]}`;
};
var progressExercisePrescription = (exercise, week) => {
	const progression = getWeekProgression(week);
	const sets = Math.max(1, exercise.sets + progression.setDelta);
	if (exercise.tracking === "distance") {
		const distanceMatch = exercise.plannedReps.match(/^(\d+(?:\.\d+)?)\s*m$/i);
		const baseMeters = Number(distanceMatch?.[1] ?? 0);
		const increment = baseMeters < 25 ? 5 : 25;
		const meters = baseMeters > 0 ? Math.max(increment, Math.round(baseMeters * progression.distanceFactor / increment) * increment) : 0;
		const plannedReps = meters > 0 ? `${meters} m` : exercise.plannedReps;
		return {
			...exercise,
			sets,
			plannedReps,
			effortTarget: progression.heartRateTarget,
			detail: `${sets} × ${plannedReps} · ${progression.heartRateTarget.toLocaleLowerCase("da-DK")}`
		};
	}
	const numericWeight = Number.parseFloat(exercise.defaultWeight);
	const defaultWeight = Number.isFinite(numericWeight) && numericWeight > 0 ? String(roundedLoad(numericWeight * progression.loadFactor)) : exercise.defaultWeight;
	const plannedReps = adjustStrengthReps(exercise.plannedReps, progression.repDelta);
	return {
		...exercise,
		sets,
		plannedReps,
		defaultWeight,
		restSeconds: (exercise.restSeconds ?? 75) + (week >= 7 && week !== 8 && week !== 12 ? 15 : 0),
		effortTarget: progression.rirTarget,
		detail: `${sets} × ${plannedReps} · ${defaultWeight} kg · ${progression.rirTarget}`
	};
};
var exercise = (name, sets, plannedReps, defaultWeight, focus) => {
	const clearReps = clarifyUnilateralReps(name, plannedReps);
	return {
		name,
		sets,
		plannedReps: clearReps,
		defaultWeight,
		focus,
		effortMetric: "rir",
		effortTarget: "2–4 RIR",
		detail: `${sets} × ${clearReps} · ${defaultWeight} kg`
	};
};
var recoveryExercise = (name, sets, plannedReps, defaultWeight, focus) => ({
	...exercise(name, sets, plannedReps, defaultWeight, focus),
	effortTarget: "4–6 RIR"
});
var recoveryCardio = (name, plannedReps, focus) => ({
	name,
	sets: 1,
	plannedReps,
	defaultWeight: "0",
	focus,
	tracking: "distance",
	restSeconds: 0,
	effortMetric: "heart_rate_zone",
	effortTarget: "Pulszone 1–2",
	detail: `${plannedReps} · pulszone 1–2`
});
var originalTwoWeekPlan = [
	{
		programId: "w1-competition-focus",
		week: 1,
		day: "MANDAG",
		date: "3. AUG",
		status: "today",
		title: "Competition focus",
		focus: "Teknisk kvalitet under moderat belastning",
		duration: 80,
		exercises: [
			exercise("Snatch", 6, "2", "70", "Rolig fra gulv, aggressiv under stangen"),
			exercise("Clean & Jerk", 5, "1+1", "95", "Stabil modtagelse"),
			exercise("Front squat", 4, "3", "105", "Kontrolleret excentrisk")
		]
	},
	{
		programId: "w1-active-recovery",
		week: 1,
		day: "TIRSDAG",
		date: "4. AUG",
		status: "recovery",
		title: "Aktiv restitution",
		focus: "Bevægelse, mobilitet og rolig coretræning",
		duration: 35,
		exercises: [
			recoveryCardio("Cykel", "15 min", "Rolig intensitet og næseåndedræt"),
			recoveryExercise("Hofte- og ankelmobilitet", 3, "1 runde", "0", "Roligt bevægeudslag uden smerte"),
			recoveryExercise("Dead bug", 3, "8", "0", "Hold lænden i gulvet")
		]
	},
	{
		programId: "w1-snatch-technique",
		week: 1,
		day: "ONSDAG",
		date: "5. AUG",
		status: "planned",
		title: "Snatch technique",
		focus: "Timing fra hæng og stabil overheadposition",
		duration: 70,
		exercises: [
			exercise("Power snatch", 5, "2", "60", "Tæt stangbane og hurtige fødder"),
			exercise("Hang snatch", 4, "3", "55", "Pres gulvet væk fra knæet"),
			exercise("Snatch pull", 3, "3", "85", "Afslut trækket lodret"),
			exercise("Overhead squat", 2, "5", "50", "Aktive skuldre gennem hele løftet")
		]
	},
	{
		programId: null,
		week: 1,
		day: "TORSDAG",
		date: "6. AUG",
		status: "rest",
		title: "Hviledag",
		focus: "Søvn, mad og let bevægelse efter behov",
		duration: 0,
		exercises: []
	},
	{
		programId: "w1-clean-jerk-power",
		week: 1,
		day: "FREDAG",
		date: "7. AUG",
		status: "planned",
		title: "Clean & jerk power",
		focus: "Stabil modtagelse og kraftfuldt ben-drive",
		duration: 85,
		exercises: [
			exercise("Clean & Jerk", 5, "1+1", "97.5", "Samme opsætning i alle forsøg"),
			exercise("Clean pull", 4, "3", "120", "Hold balancen midt på foden"),
			exercise("Front squat", 4, "3", "107.5", "Høj albueposition"),
			exercise("Push jerk", 3, "3", "80", "Kort dip og aktiv låsning")
		]
	},
	{
		programId: "w1-strength-base",
		week: 1,
		day: "LØRDAG",
		date: "8. AUG",
		status: "planned",
		title: "Strength base",
		focus: "Benstyrke, bagkæde og overheadkapacitet",
		duration: 75,
		exercises: [
			exercise("Back squat", 5, "5", "120", "Ens tempo og stabil bundposition"),
			exercise("Strict press", 4, "6", "45", "Spændt mave og lige stangbane"),
			exercise("Romanian deadlift", 3, "8", "85", "Hofte tilbage og lang ryg"),
			exercise("Plank", 2, "30 sek", "0", "Hold en rolig vejrtrækning")
		]
	},
	{
		programId: null,
		week: 1,
		day: "SØNDAG",
		date: "9. AUG",
		status: "rest",
		title: "Hviledag",
		focus: "Fuld restitution før næste træningsuge",
		duration: 0,
		exercises: []
	},
	{
		programId: "w2-speed-position",
		week: 2,
		day: "MANDAG",
		date: "10. AUG",
		status: "planned",
		title: "Speed & position",
		focus: "Hurtighed under stangen fra sikre positioner",
		duration: 75,
		exercises: [
			exercise("Tall snatch", 4, "3", "35", "Træk kroppen aktivt under stangen"),
			exercise("Block snatch", 5, "2", "62.5", "Hold brystet over stangen"),
			exercise("Snatch balance", 4, "2", "60", "Lås aktivt i modtagelsen"),
			exercise("Back squat", 4, "4", "125", "Kontrolleret ned, kraftfuldt op")
		]
	},
	{
		programId: "w2-recovery-flow",
		week: 2,
		day: "TIRSDAG",
		date: "11. AUG",
		status: "recovery",
		title: "Recovery flow",
		focus: "Cirkulation, mobilitet og let stabilitet",
		duration: 30,
		exercises: [
			recoveryCardio("Roning", "12 min", "Jævnt tempo uden at presse pulsen"),
			recoveryExercise("Cossack squat", 3, "6", "0", "Kontrolleret sideforskydning"),
			recoveryExercise("Side plank", 3, "25 sek", "0", "Lang og stabil kropslinje")
		]
	},
	{
		programId: "w2-clean-complex",
		week: 2,
		day: "ONSDAG",
		date: "12. AUG",
		status: "planned",
		title: "Clean complex",
		focus: "Sammenhæng mellem træk, vending og squat",
		duration: 80,
		exercises: [
			exercise("Hang clean", 4, "2", "80", "Færdiggør benstrækket"),
			exercise("Clean + Front squat", 5, "1+2", "90", "Stabil vendingsposition"),
			exercise("Clean deadlift", 4, "3", "115", "Skuldre og hofter stiger sammen"),
			exercise("Push press", 3, "5", "65", "Ben-drive før armene")
		]
	},
	{
		programId: null,
		week: 2,
		day: "TORSDAG",
		date: "13. AUG",
		status: "rest",
		title: "Hviledag",
		focus: "Prioritér søvn og regelmæssige måltider",
		duration: 0,
		exercises: []
	},
	{
		programId: "w2-heavy-quality",
		week: 2,
		day: "FREDAG",
		date: "14. AUG",
		status: "planned",
		title: "Heavy quality",
		focus: "Få tunge løft med høj teknisk kvalitet",
		duration: 90,
		exercises: [
			exercise("Snatch", 5, "1", "75", "Kun velkontrollerede forsøg"),
			exercise("Clean & Jerk", 5, "1+1", "102.5", "Rolig clean og beslutsomt jerk"),
			exercise("Front squat", 4, "2", "115", "Bevar høj position")
		]
	},
	{
		programId: "w2-strength-support",
		week: 2,
		day: "LØRDAG",
		date: "15. AUG",
		status: "planned",
		title: "Strength support",
		focus: "Robust bagkæde, trækstyrke og skulderkontrol",
		duration: 70,
		exercises: [
			exercise("Snatch-grip deadlift", 4, "5", "105", "Hold stangen tæt"),
			exercise("Bulgarian split squat", 3, "8 pr. ben", "24", "Stabilt knæ over fod"),
			exercise("Pendlay row", 4, "6", "65", "Start hvert løft fra gulvet"),
			exercise("Overhead carry", 3, "25 m", "20", "Ribben ned og aktiv skulder")
		]
	},
	{
		programId: "w2-test-review",
		week: 2,
		day: "SØNDAG",
		date: "16. AUG",
		status: "recovery",
		title: "Test review",
		focus: "Let bevægelse og afsluttende evaluering",
		duration: 25,
		exercises: [
			recoveryCardio("Cykel", "10 min", "Meget roligt tempo"),
			recoveryExercise("World's greatest stretch", 3, "5", "0", "Roligt bevægeudslag"),
			recoveryExercise("Bird dog", 3, "8", "0", "Undgå rotation i bækkenet")
		]
	}
];
var dateForWeekday = (week, weekday) => {
	const date = new Date(Date.UTC(2026, 7, 3 + (week - 1) * 7 + weekday));
	return `${date.getUTCDate()}. ${new Intl.DateTimeFormat("da-DK", {
		month: "short",
		timeZone: "UTC"
	}).format(date).replace(".", "").toLocaleUpperCase("da-DK")}`;
};
var extendPlanToTwelveWeeks = (basePlan) => Array.from({ length: 12 }, (_, weekIndex) => {
	const week = weekIndex + 1;
	const sourceWeek = (week - 1) % 2 + 1;
	const progression = getWeekProgression(week);
	return basePlan.filter((day) => day.week === sourceWeek).map((day, weekday) => {
		const exercises = day.status === "recovery" ? day.exercises : day.exercises.map((exercise) => progressExercisePrescription(exercise, week));
		const distanceMeters = exercises.some((exercise) => exercise.tracking === "distance") ? exercises.reduce((total, exercise) => total + (exercise.tracking === "distance" ? exercise.sets * (Number.parseFloat(exercise.plannedReps) || 0) : 0), 0) : day.distanceMeters;
		return {
			...day,
			week,
			date: dateForWeekday(week, weekday),
			status: week === 1 && weekday === 0 ? "today" : day.status === "today" ? "planned" : day.status,
			programId: !day.programId || week <= 2 ? day.programId : `${day.programId}-w${week}`,
			focus: day.status === "rest" ? day.focus : `${progression.phase} · ${day.focus}`,
			intensity: day.status === "rest" ? day.intensity : progression.intensity,
			phase: progression.phase,
			progressionNote: progression.summary,
			exercises,
			distanceMeters
		};
	});
}).flat();
var twoWeekPlan = extendPlanToTwelveWeeks(originalTwoWeekPlan);
twoWeekPlan[0];
function countProgramSets(day) {
	return day.exercises.reduce((total, item) => total + item.sets, 0);
}
//#endregion
//#region app/sport-catalog.ts
var sportProfiles = [
	{
		id: "weightlifting",
		label: "Vægtløftning",
		short: "VL",
		description: "Teknik, eksplosivitet og styrke i de olympiske løft.",
		tracksLoad: true,
		tracksDistance: false
	},
	{
		id: "long_distance",
		label: "Langdistance svømning",
		short: "SVØM L",
		description: "Landstyrke til stabil teknik og lange distancer.",
		tracksLoad: true,
		tracksDistance: true
	},
	{
		id: "middle_distance",
		label: "Mellemdistance svømning",
		short: "SVØM M",
		description: "Landstyrke, power og kapacitet til gentagen fart.",
		tracksLoad: true,
		tracksDistance: true
	},
	{
		id: "sprint",
		label: "Sprintsvømning",
		short: "SVØM S",
		description: "Eksplosiv landstyrke til start, vending og topfart.",
		tracksLoad: true,
		tracksDistance: true
	},
	{
		id: "recreational",
		label: "Motionist",
		short: "MOTION",
		description: "En enkel og progressiv introduktion til styrketræning.",
		tracksLoad: true,
		tracksDistance: false
	},
	{
		id: "athletics",
		label: "Atletik",
		short: "ATLETIK",
		description: "Styrke, acceleration, spring og robusthed til atletik.",
		tracksLoad: true,
		tracksDistance: true
	},
	{
		id: "golf",
		label: "Golf",
		short: "GOLF",
		description: "Rotation, stabilitet og kraftoverførsel til golf.",
		tracksLoad: true,
		tracksDistance: false
	},
	{
		id: "running",
		label: "Løb",
		short: "LØB",
		description: "Landstyrke og kapacitet til hurtigere og mere robust løb.",
		tracksLoad: true,
		tracksDistance: true
	},
	{
		id: "powerlifting",
		label: "Powerlifting",
		short: "PL",
		description: "Progression i squat, bænkpres og dødløft.",
		tracksLoad: true,
		tracksDistance: false
	},
	{
		id: "skiing",
		label: "Skisport",
		short: "SKI",
		description: "Benstyrke, balance og udholdenhed til skisport.",
		tracksLoad: true,
		tracksDistance: true
	},
	{
		id: "triathlon",
		label: "Triathlon",
		short: "TRI",
		description: "Supplerende styrke på tværs af svømning, cykling og løb.",
		tracksLoad: true,
		tracksDistance: true
	},
	{
		id: "ironman",
		label: "Ironman",
		short: "IRON",
		description: "Robusthed og styrkeudholdenhed til lange konkurrencer.",
		tracksLoad: true,
		tracksDistance: true
	},
	{
		id: "hyrox",
		label: "Hyrox",
		short: "HYROX",
		description: "Løbsøkonomi, stationsstyrke og arbejdskapacitet.",
		tracksLoad: true,
		tracksDistance: true
	},
	{
		id: "crossfit",
		label: "CrossFit",
		short: "CF",
		description: "Alsidig styrke, teknik og kondition til mixed modal træning.",
		tracksLoad: true,
		tracksDistance: true
	},
	{
		id: "cycling",
		label: "Cykling",
		short: "CYKEL",
		description: "Styrke og stabilitet til bedre kraft og position på cyklen.",
		tracksLoad: true,
		tracksDistance: true
	},
	{
		id: "american_football",
		label: "Amerikansk fodbold",
		short: "AF",
		description: "Acceleration, retningsskift og kontaktrobusthed.",
		tracksLoad: true,
		tracksDistance: true
	},
	{
		id: "football",
		label: "Fodbold",
		short: "FODBOLD",
		description: "Kondition, acceleration og robusthed gennem hele kampen.",
		tracksLoad: true,
		tracksDistance: true
	},
	{
		id: "handball",
		label: "Håndbold",
		short: "HÅNDBOLD",
		description: "Springkraft, retningsskift og skulderrobusthed.",
		tracksLoad: true,
		tracksDistance: true
	}
];
var trainingProfileOptions = sportProfiles.map(({ id, label, short, description }) => ({
	id,
	label,
	short,
	description
}));
sportProfiles.filter((profile) => [
	"long_distance",
	"middle_distance",
	"sprint"
].includes(profile.id));
var trainingProfileLabel = (profile) => sportProfiles.find((option) => option.id === profile)?.label ?? "Ikke valgt";
//#endregion
//#region app/sport-program-blueprints.ts
var names = (value) => value.split("|");
var session = (title, objective, duration, main, assistance, sportSpecific) => ({
	title,
	objective,
	duration,
	main: names(main),
	assistance: names(assistance),
	sportSpecific: names(sportSpecific)
});
var sportProgramBlueprints = {
	weightlifting: {
		principle: "Konkurrenceløft trænes friskt; styrke og træk understøtter positionerne uden at overdøve teknikken.",
		sessions: [
			session("Snatch · teknik & hastighed", "Stabil startposition, tæt stangbane og hurtig modtagelse", 75, "Snatch|Power snatch|Hang snatch|Block snatch|Pause snatch|Snatch + overhead squat", "Snatch pull|Snatch deadlift|Snatch grip RDL|Overhead squat|Pendlay row|Pull-up", "Snatch balance|Tall snatch|No-foot snatch|Muscle snatch|Power snatch + overhead squat|Jerk-fodarbejde uden vægt"),
			session("Clean & jerk · kraft & timing", "Sammenhæng mellem vending, ben-drive og stabil lockout", 80, "Clean & Jerk|Power clean|Hang clean|Block clean|Clean & push jerk|Clean + front squat", "Clean pull|Clean deadlift|Front squat|Push press|Strict press|Pull-up", "Split jerk|Push jerk|Jerk from rack|Jerk balance|Pause jerk|Tall jerk"),
			session("Squat & trækkraft", "Benstyrke, positionsstyrke og robust overheadkapacitet", 70, "Front squat|Back squat|Pause front squat|Pause back squat|Clean deadlift|Snatch deadlift", "Romanian deadlift|Pendlay row|Strict press|Pull-up|Bulgarian split squat|Snatch grip RDL", "Snatch pull|Clean pull|Overhead squat|Jerk dip + drive|Snatch balance|Press in split")
		]
	},
	long_distance: {
		principle: "Lav træthed pr. sæt, høj skulderkvalitet og styrkeudholdenhed, der kan overføres til lange distancer.",
		sessions: [
			session("Trækkraft & skulderrobusthed", "Vedvarende lat-kraft og kontrolleret skulderbladsmekanik", 55, "Pull-up|Lat pulldown|Chest-supported dumbbell row|Single-arm cable pulldown|Seated cable row|Straight-arm pulldown", "Face pull|Prone Y-T-W|Serratus wall slide|Cable external rotation|Scapular pull-up|Band external rotation", "Swim bench freestyle pull|Band freestyle stroke|Isometric catch hold|Streamline lat pulldown|Prone swimmer|Single-arm row with rotation"),
			session("Benstyrke & kropslinje", "Ensidig benstyrke og stabil hofte til afsæt og strømlinet position", 55, "Trap bar deadlift|Front squat|Goblet squat|Romanian deadlift|Bulgarian split squat|Step-up", "Single-leg Romanian deadlift|Hip thrust|Copenhagen plank|Calf raise|Pallof press|Dead bug", "Streamline overhead hold|Banded hip-flexion march|Single-leg balance reach|Tall-kneeling cable lift|Band freestyle stroke|Prone swimmer"),
			session("Core & styrkeudholdenhed", "Antirotation, skulderudholdenhed og gentagelig kraft uden unødig muskelømhed", 50, "Half-kneeling landmine press|Single-arm cable row|Incline dumbbell bench press|Landmine row|Cable chest press|Goblet squat", "Pallof press|Side plank|Dead bug|Suitcase carry|Banded pull-apart|Scapular push-up", "Straight-arm pulldown|Isometric catch hold|Band freestyle stroke|Streamline overhead hold|Tall-kneeling cable chop|Single-arm row with rotation")
		]
	},
	middle_distance: {
		principle: "Styrke og power skal kunne gentages ved høj fart, mens skulderen forbliver stabil gennem hele trækket.",
		sessions: [
			session("Trækkraft & race-power", "Kraftfuldt træk og høj kvalitet i svømmespecifikke bevægelser", 60, "Pull-up|Lat pulldown|Chest-supported dumbbell row|Single-arm cable pulldown|Pendlay row|Straight-arm pulldown", "Face pull|Cable external rotation|Prone Y-T-W|Scapular pull-up|Pallof press|Dead bug", "Swim bench freestyle pull|Swim bench butterfly pull|Overhead medicine ball throw|Band freestyle stroke|Isometric catch hold|Single-arm row with rotation"),
			session("Underkropspower & afsæt", "Eksplosiv hofte- og benkraft til start, vending og acceleration", 60, "Trap bar deadlift|Front squat|Back squat|Romanian deadlift|Bulgarian split squat|Hip thrust", "Step-up|Single-leg Romanian deadlift|Copenhagen plank|Calf raise|Lateral lunge|Suitcase carry", "Box jump|Broad jump|Medicine ball slam|Overhead medicine ball throw|Streamline overhead hold|Banded hip-flexion march"),
			session("Skulderkapacitet & core", "Gentagelig overkropskraft med kontrolleret rotation og kropslinje", 55, "Half-kneeling landmine press|Incline dumbbell bench press|Landmine row|Single-arm cable row|Dips|Push-up", "Serratus wall slide|Scapular push-up|Band external rotation|Side plank|Pallof press|Dead bug", "Rotational medicine ball throw|Swim bench butterfly pull|Band butterfly stroke|Tall-kneeling cable chop|Streamline overhead hold|Isometric catch hold")
		]
	},
	sprint: {
		principle: "Få eksplosive gentagelser, fulde pauser og høj bevægelseshastighed prioriteres over udmattelse.",
		sessions: [
			session("Startstyrke & benpower", "Maksimal kraftudvikling til startblok, afsæt og undervandsfase", 60, "Trap bar deadlift|Front squat|Back squat|Hip thrust|Bulgarian split squat|Romanian deadlift", "Step-up|Single-leg Romanian deadlift|Copenhagen plank|Calf raise|Suitcase carry|Pallof press", "Box jump|Broad jump|Depth jump|Jump squat|Overhead medicine ball throw|Streamline overhead hold"),
			session("Eksplosivt træk & pres", "Høj overkropskraft med stabil skulder og hurtig kraftoverførsel", 60, "Pull-up|Pendlay row|Lat pulldown|Dips|Half-kneeling landmine press|Incline dumbbell bench press", "Face pull|Prone Y-T-W|Cable external rotation|Scapular pull-up|Serratus wall slide|Dead bug", "Swim bench freestyle pull|Swim bench butterfly pull|Plyometric push-up|Medicine ball chest pass|Band butterfly stroke|Isometric catch hold"),
			session("Rotation, vending & robusthed", "Eksplosiv helkropskraft og kontrol omkring core og skulder", 55, "Landmine row|Single-arm cable row|Push press|Goblet squat|Cable chest press|Romanian deadlift", "Pallof press|Side plank|Banded pull-apart|Scapular push-up|Single-leg balance reach|Suitcase carry", "Rotational medicine ball throw|Medicine ball scoop toss|Medicine ball slam|Single-arm row with rotation|Streamline overhead hold|Tall-kneeling cable chop")
		]
	},
	recreational: {
		principle: "Enkle bevægelser, tydelig progression og god teknik skaber kontinuitet før høj belastning.",
		sessions: [
			session("Squat, pres & træk", "Tryg helkropsstyrke i de grundlæggende bevægemønstre", 45, "Goblet squat|Leg press|Front squat|Push-up|Incline dumbbell bench press|Seated cable row", "Lat pulldown|Glute bridge|Dead bug|Calf raise|Face pull|Banded pull-apart", "Medicine ball chest pass|A-skip|Cross-crawl|Single-leg balance reach|Bear crawl|Banded lateral walk"),
			session("Hofte, ryg & ensidig kontrol", "Bagkæde, balance og styrke fra side til side", 45, "Trap bar deadlift|Romanian deadlift|Hip thrust|Step-up|Reverse lunge|Chest-supported dumbbell row", "Single-leg Romanian deadlift|Pallof press|Side plank|Suitcase carry|Band external rotation|Calf raise", "Broad jump|Banded hip-flexion march|Single-leg balance reach|Cross-crawl|Bear crawl|Lateral ladder drill"),
			session("Helkrop & bevægelseskvalitet", "Gentagelige løft og koordination med overskud", 50, "Leg press|Goblet squat|Half-kneeling landmine press|Lat pulldown|Cable chest press|Landmine row", "Glute bridge|Bird dog|Dead bug|Face pull|Banded lateral walk|Suitcase carry", "Medicine ball slam|A-skip|Bear crawl|Cross-crawl|Single-leg balance reach|Broad jump")
		]
	},
	athletics: {
		principle: "Maksimal kraft, elastisk power og sprintmekanik udvikles friskt med fulde pauser.",
		sessions: [
			session("Acceleration & maksimal kraft", "Horisontal kraft og stærke positioner i de første skridt", 65, "Trap bar deadlift|Front squat|Back squat|Romanian deadlift|Hip thrust|Bulgarian split squat", "Nordic hamstring curl|Step-up|Calf raise|Copenhagen plank|Pendlay row|Pallof press", "Broad jump|A-skip|Medicine ball scoop toss|Banded hip-flexion march|Pogo jumps|Sled push"),
			session("Spring & reaktiv power", "Kort kontakttid, elastisk styrke og kontrollerede landinger", 60, "Front squat|Trap bar deadlift|Push press|Bulgarian split squat|Romanian deadlift|Hip thrust", "Single-leg Romanian deadlift|Calf raise|Copenhagen plank|Lateral lunge|Suitcase carry|Dead bug", "Depth jump|Pogo jumps|Box jump|Lateral skater jump|Jump squat|Medicine ball chest pass"),
			session("Kast, ensidig styrke & robusthed", "Rotationskraft, unilateral kontrol og vævskapacitet", 60, "Push press|Half-kneeling landmine press|Pull-up|Pendlay row|Front squat|Romanian deadlift", "Nordic hamstring curl|Single-leg calf raise|Face pull|Pallof press|Side plank|Step-up", "Rotational medicine ball throw|Medicine ball scoop toss|Overhead medicine ball throw|Carioca drill|Lateral ladder drill|Single-leg balance reach")
		]
	},
	golf: {
		principle: "Kraften bygges fra jorden gennem hofte og thorax, mens lænd og skulder holdes robuste.",
		sessions: [
			session("Underkropskraft & hoftekontrol", "Stabilt fodtryk og ensidig hoftekraft gennem hele svinget", 55, "Trap bar deadlift|Front squat|Goblet squat|Bulgarian split squat|Romanian deadlift|Hip thrust", "Single-leg Romanian deadlift|Reverse lunge|Suitcase carry|Side plank|Bird dog|Face pull", "Hip airplane|Single-leg balance reach|Cable rotation|Medicine ball scoop toss|Half-kneeling anti-rotation hold|Landmine rotation"),
			session("Rotationspower & slagkraft", "Hurtig kraftoverførsel fra ben til overkrop uden tab af balance", 55, "Half-kneeling landmine press|Landmine row|Cable chest press|Push press|Goblet squat|Romanian deadlift", "Pallof press|Tall-kneeling cable chop|Tall-kneeling cable lift|Face pull|Dead bug|Split squat", "Rotational medicine ball throw|Medicine ball scoop toss|Landmine rotation|Cable rotation|Medicine ball slam|Hip airplane"),
			session("Ryg, core & holdbarhed", "Thorakal kontrol, antirotation og kapacitet til mange slag", 50, "Chest-supported dumbbell row|Single-arm cable row|Half-kneeling landmine press|Split squat|Hip thrust|Cable chest press", "Face pull|Band external rotation|Bird dog|Side plank|Suitcase carry|Dead bug", "Tall-kneeling cable chop|Tall-kneeling cable lift|Half-kneeling anti-rotation hold|Cable rotation|Hip airplane|Single-leg balance reach")
		]
	},
	running: {
		principle: "Høj kraft med lav volumen, stærke lægge og ensidig kontrol forbedrer løbeøkonomi uden unødig træthed.",
		sessions: [
			session("Maksimal benstyrke", "Høj kraft pr. skridt med lav samlet styrketræningsvolumen", 55, "Trap bar deadlift|Front squat|Back squat|Romanian deadlift|Hip thrust|Bulgarian split squat", "Nordic hamstring curl|Calf raise|Step-up|Copenhagen plank|Pallof press|Chest-supported dumbbell row", "A-skip|Banded hip-flexion march|Pogo jumps|Single-leg calf raise|Single-leg balance reach|Broad jump"),
			session("Elastisk styrke & lægkapacitet", "Kort jordkontakt og robusthed i fod, ankel og læg", 50, "Bulgarian split squat|Step-up|Romanian deadlift|Goblet squat|Single-leg Romanian deadlift|Hip thrust", "Calf raise|Nordic hamstring curl|Copenhagen plank|Banded lateral walk|Dead bug|Suitcase carry", "Pogo jumps|A-skip|Lateral skater jump|Single-leg calf raise|Banded hip-flexion march|Broad jump"),
			session("Unilateral robusthed & core", "Stabil kraftoverførsel gennem hofte, knæ og bækken", 50, "Step-up|Reverse lunge|Bulgarian split squat|Single-leg Romanian deadlift|Goblet squat|Trap bar deadlift", "Copenhagen plank|Pallof press|Side plank|Calf raise|Nordic hamstring curl|Chest-supported dumbbell row", "Single-leg balance reach|Banded lateral walk|Banded hip-flexion march|A-skip|Carioca drill|Lateral skater jump")
		]
	},
	powerlifting: {
		principle: "Konkurrenceløftene får førsteprioritet; variationer løser svage positioner, og assistance doseres efter restitution.",
		sessions: [
			session("Squat & bænk · volumen", "Teknisk ensartede konkurrenceløft og opbygning af arbejdsvolumen", 80, "Back squat|Pause back squat|Tempo back squat|Bænkpres|Incline dumbbell bench press|Front squat", "Romanian deadlift|Pendlay row|Bulgarian split squat|Face pull|Ab wheel rollout|Lat pulldown", "Back squat|Bænkpres|Pause back squat|Tempo back squat|Front squat|Dips"),
			session("Bænkpres & overkrop", "Presstyrke, øvre ryg og stabil konkurrenceopsætning", 70, "Bænkpres|Incline dumbbell bench press|Dips|Strict press|Close-grip bench press|Spoto press", "Pendlay row|Pull-up|Lat pulldown|Face pull|Chest-supported dumbbell row|Ab wheel rollout", "Bænkpres|Dips|Incline dumbbell bench press|Pause back squat|Tempo back squat|Front squat"),
			session("Dødløft & tung squat", "Startstyrke fra gulvet, bagkæde og tunge konkurrencerelevante løft", 80, "Dødløft|Romanian deadlift|Back squat|Pause back squat|Front squat|Trap bar deadlift", "Pendlay row|Hip thrust|Pull-up|Lat pulldown|Bulgarian split squat|Ab wheel rollout", "Dødløft|Back squat|Pause back squat|Tempo back squat|Romanian deadlift|Bænkpres")
		]
	},
	skiing: {
		principle: "Eccentrisk benstyrke, enbensbalance og stavkraft bygges uden at fjerne kvalitet fra udholdenhedspassene.",
		sessions: [
			session("Benstyrke & excentrisk kontrol", "Stærke lår og hofter til lange nedkørsler og gentagne afsæt", 60, "Front squat|Back squat|Trap bar deadlift|Romanian deadlift|Bulgarian split squat|Leg press", "Nordic hamstring curl|Calf raise|Step-up|Copenhagen plank|Hip thrust|Pallof press", "Lateral skater jump|Jump squat|Banded lateral walk|Single-leg balance reach|Lateral lunge|Pogo jumps"),
			session("Enbensbalance & sidekraft", "Stabil knælinje og kraft i skøjt og sving", 55, "Bulgarian split squat|Step-up|Single-leg Romanian deadlift|Reverse lunge|Lateral lunge|Goblet squat", "Calf raise|Copenhagen plank|Suitcase carry|Pallof press|Nordic hamstring curl|Dead bug", "Lateral skater jump|Single-leg balance reach|Banded lateral walk|Jump squat|Carioca drill|Hip airplane"),
			session("Stavkraft & core", "Stærkt træk, hoftedrive og vedvarende corekontrol", 55, "Pull-up|Lat pulldown|Pendlay row|Chest-supported dumbbell row|Push press|Landmine row", "Straight-arm pulldown|Pallof press|Side plank|Dead bug|Suitcase carry|Face pull", "Medicine ball slam|Overhead medicine ball throw|Tall-kneeling cable chop|Banded hip-flexion march|Bear crawl|Single-arm farmer carry")
		]
	},
	triathlon: {
		principle: "Styrken skal forbedre økonomi i alle tre discipliner med lille restitutionsomkostning.",
		sessions: [
			session("Benstyrke & løbeøkonomi", "Høj kraft pr. pedaltråd og løbeskridt med lav volumen", 55, "Trap bar deadlift|Front squat|Romanian deadlift|Bulgarian split squat|Hip thrust|Step-up", "Calf raise|Nordic hamstring curl|Copenhagen plank|Pallof press|Single-leg Romanian deadlift|Dead bug", "A-skip|Pogo jumps|Banded hip-flexion march|Single-leg calf raise|Banded lateral walk|Single-leg balance reach"),
			session("Svømmetrækkraft & skulder", "Effektivt træk og robust skulder uden overflødig hypertrofi", 50, "Pull-up|Lat pulldown|Chest-supported dumbbell row|Straight-arm pulldown|Single-arm cable pulldown|Landmine row", "Face pull|Prone Y-T-W|Serratus wall slide|Pallof press|Dead bug|Band external rotation", "Swim bench freestyle pull|Band freestyle stroke|Streamline lat pulldown|Isometric catch hold|Prone swimmer|Scapular pull-up"),
			session("Unilateral robusthed & position", "Hofte-, læg- og corekontrol gennem lange træningsuger", 50, "Step-up|Single-leg Romanian deadlift|Reverse lunge|Goblet squat|Half-kneeling landmine press|Chest-supported dumbbell row", "Copenhagen plank|Single-leg calf raise|Pallof press|Suitcase carry|Banded lateral walk|Dead bug", "Hip airplane|Banded hip-flexion march|A-skip|Straight-arm pulldown|Band freestyle stroke|Single-leg balance reach")
		]
	},
	ironman: {
		principle: "Robusthed og bevægelsesøkonomi prioriteres; styrketræningen må aldrig kompromittere de lange nøglepas.",
		sessions: [
			session("Helkropsstyrke · lav træthed", "Vedligehold kraft og muskelkapacitet gennem høj udholdenhedsvolumen", 50, "Trap bar deadlift|Front squat|Romanian deadlift|Goblet squat|Pull-up|Chest-supported dumbbell row", "Step-up|Calf raise|Pallof press|Face pull|Dead bug|Hip thrust", "Banded hip-flexion march|Straight-arm pulldown|Band freestyle stroke|Single-leg calf raise|Banded lateral walk|Hip airplane"),
			session("Ensidig udholdenhed & core", "Stabile hofter, knæ og bækken når trætheden stiger", 45, "Step-up|Reverse lunge|Single-leg Romanian deadlift|Bulgarian split squat|Half-kneeling landmine press|Landmine row", "Copenhagen plank|Side plank|Single-leg calf raise|Suitcase carry|Dead bug|Face pull", "Banded lateral walk|Banded hip-flexion march|Single-leg balance reach|Hip airplane|Pallof press|Band freestyle stroke"),
			session("Skulder, ryg & kropslinje", "Bevar svømmetrækkraft og aero-position gennem lange blokke", 45, "Lat pulldown|Chest-supported dumbbell row|Straight-arm pulldown|Single-arm cable row|Half-kneeling landmine press|Goblet squat", "Prone Y-T-W|Serratus wall slide|Band external rotation|Pallof press|Dead bug|Bird dog", "Band freestyle stroke|Isometric catch hold|Streamline overhead hold|Banded hip-flexion march|Hip airplane|Single-leg calf raise")
		]
	},
	hyrox: {
		principle: "Løbeøkonomi, stationsstyrke og transitionskapacitet trænes særskilt, før de kombineres under træthed.",
		sessions: [
			session("Maksimal styrke & løbeøkonomi", "Stærke ben og bagkæde med lav nok volumen til kvalitetsløb", 65, "Trap bar deadlift|Front squat|Back squat|Romanian deadlift|Bulgarian split squat|Hip thrust", "Nordic hamstring curl|Calf raise|Copenhagen plank|Pull-up|Pallof press|Chest-supported dumbbell row", "Sled push|Sled pull|A-skip|Pogo jumps|Banded hip-flexion march|Single-leg calf raise"),
			session("Stationskraft & teknik", "Effektiv bevægelse i slæde, carry, lunges og wall balls", 65, "Front squat|Trap bar deadlift|Push press|Goblet squat|Romanian deadlift|Pull-up", "Suitcase carry|Step-up|Copenhagen plank|Face pull|Dead bug|Calf raise", "Sled push|Sled pull|Farmers carry|Sandbag walking lunges|Wall balls|Burpee broad jumps"),
			session("Styrkeudholdenhed & robusthed", "Gentagelig helkropskraft uden teknisk kollaps", 60, "Goblet squat|Dumbbell shoulder press|Landmine row|Romanian deadlift|Step-up|Half-kneeling landmine press", "Nordic hamstring curl|Pallof press|Face pull|Calf raise|Side plank|Single-leg Romanian deadlift", "Kettlebell swing|Dumbbell thruster|Wall balls|Farmers carry|Burpee broad jumps|Sandbag walking lunges")
		]
	},
	crossfit: {
		principle: "Teknik og maksimal styrke udvikles før intensitet; mixed-modal arbejde må ikke skjule svage bevægelser.",
		sessions: [
			session("Olympiske løft & squat", "Teknisk power i vægtløftning og stærke modtagepositioner", 70, "Snatch|Power snatch|Clean & Jerk|Power clean|Front squat|Back squat", "Snatch pull|Clean pull|Romanian deadlift|Pendlay row|Pull-up|Overhead squat", "Hang snatch|Hang clean|Push jerk|Kettlebell swing|Box jump|Jerk-fodarbejde uden vægt"),
			session("Pres, træk & gymnastik", "Strikt styrke som base for sikker gymnastisk volumen", 65, "Strict press|Push press|Pull-up|Dips|Bænkpres|Pendlay row", "Face pull|Lat pulldown|Pallof press|Dead bug|Chest-supported dumbbell row|Half-kneeling landmine press", "Toes-to-bar|Handstand push-up|Plyometric push-up|Medicine ball chest pass|Bear crawl|Hollow body hold"),
			session("Bagkæde & mixed-modal støtte", "Hoftepower, carry og styrkeudholdenhed med bevaret teknik", 65, "Dødløft|Romanian deadlift|Trap bar deadlift|Front squat|Push press|Pull-up", "Bulgarian split squat|Copenhagen plank|Face pull|Suitcase carry|Ab wheel rollout|Calf raise", "Kettlebell swing|Dumbbell thruster|Wall balls|Farmers carry|Burpee broad jumps|Sandbag walking lunges")
		]
	},
	cycling: {
		principle: "Maksimal benstyrke, bækkenkontrol og stabil aero-position udvikles uden unødig ømhed.",
		sessions: [
			session("Maksimal benstyrke", "Mere kraft pr. pedaltråd med kontrolleret styrkevolumen", 60, "Front squat|Back squat|Trap bar deadlift|Romanian deadlift|Leg press|Hip thrust", "Nordic hamstring curl|Calf raise|Copenhagen plank|Pallof press|Chest-supported dumbbell row|Dead bug", "Single-leg squat to box|Banded hip-flexion march|Single-leg calf raise|Banded lateral walk|Hip airplane|Single-leg balance reach"),
			session("Unilateral kraft & knækontrol", "Udjævn kraftforskelle og stabiliser hofte og knæ", 55, "Bulgarian split squat|Step-up|Single-leg Romanian deadlift|Reverse lunge|Goblet squat|Hip thrust", "Calf raise|Copenhagen plank|Suitcase carry|Pallof press|Nordic hamstring curl|Face pull", "Single-leg squat to box|Banded lateral walk|Banded hip-flexion march|Hip airplane|Single-leg calf raise|Single-leg balance reach"),
			session("Core, ryg & position", "Bevar bækken- og skulderposition gennem lange perioder på cyklen", 50, "Chest-supported dumbbell row|Half-kneeling landmine press|Lat pulldown|Landmine row|Goblet squat|Romanian deadlift", "Pallof press|Dead bug|Bird dog|Side plank|Face pull|Suitcase carry", "Banded hip-flexion march|Hip airplane|Banded lateral walk|Single-leg balance reach|Copenhagen plank|Single-leg calf raise")
		]
	},
	american_football: {
		principle: "Acceleration, positionsspecifik kraft og kontaktrobusthed bygges med fulde pauser og høj kvalitet.",
		sessions: [
			session("Acceleration & underkropskraft", "Eksplosivt første skridt og høj horisontal kraft", 70, "Trap bar deadlift|Front squat|Back squat|Hip thrust|Romanian deadlift|Bulgarian split squat", "Nordic hamstring curl|Calf raise|Copenhagen plank|Step-up|Pendlay row|Pallof press", "Sled push|Broad jump|10-yard sprint|Medicine ball scoop toss|A-skip|Pogo jumps"),
			session("Overkropskraft & kontakt", "Stærkt pres, træk, greb og stabil skulder i kontakt", 65, "Bænkpres|Push press|Pull-up|Pendlay row|Dips|Incline dumbbell bench press", "Face pull|Farmer's walk|Half-kneeling landmine press|Pallof press|Landmine row|Band external rotation", "Sled pull|Plyometric push-up|Medicine ball chest pass|Farmers carry|Bear crawl|Single-arm farmer carry"),
			session("Retningsskift & ensidig styrke", "Bremsning, lateral kraft og stabil re-acceleration", 65, "Bulgarian split squat|Step-up|Front squat|Romanian deadlift|Lateral lunge|Hip thrust", "Nordic hamstring curl|Copenhagen plank|Calf raise|Suitcase carry|Face pull|Dead bug", "Lateral skater jump|Depth jump|Lateral ladder drill|Carioca drill|Broad jump|Single-leg balance reach")
		]
	},
	football: {
		principle: "Styrkeprogrammet understøtter acceleration og kampkapacitet med særlig beskyttelse af baglår, lyske og læg.",
		sessions: [
			session("Benstyrke & baglårsrobusthed", "Høj underkropskraft og stærke baglår gennem hele kampen", 60, "Trap bar deadlift|Front squat|Back squat|Romanian deadlift|Hip thrust|Bulgarian split squat", "Nordic hamstring curl|Copenhagen plank|Calf raise|Step-up|Pallof press|Chest-supported dumbbell row", "A-skip|Pogo jumps|Broad jump|Banded hip-flexion march|Single-leg calf raise|Banded lateral walk"),
			session("Acceleration & reaktiv power", "Første skridt, kort jordkontakt og kontrollerede landinger", 55, "Front squat|Trap bar deadlift|Bulgarian split squat|Push press|Hip thrust|Romanian deadlift", "Nordic hamstring curl|Calf raise|Copenhagen plank|Face pull|Dead bug|Step-up", "Depth jump|Lateral skater jump|Pogo jumps|Broad jump|A-skip|Lateral ladder drill"),
			session("Retningsskift & unilateral kontrol", "Bremsestyrke, sidekraft og stabilitet i hofte og lyske", 55, "Bulgarian split squat|Step-up|Lateral lunge|Single-leg Romanian deadlift|Reverse lunge|Goblet squat", "Copenhagen plank|Nordic hamstring curl|Single-leg calf raise|Pallof press|Suitcase carry|Face pull", "Carioca drill|Lateral ladder drill|Lateral skater jump|Single-leg balance reach|Banded lateral walk|Pogo jumps")
		]
	},
	handball: {
		principle: "Springkraft, bremsestyrke og kastets kraftkæde trænes sammen med konsekvent skulderrobusthed.",
		sessions: [
			session("Springkraft & benstyrke", "Høj vertikal kraft og kontrolleret landing i gentagne spring", 60, "Front squat|Back squat|Trap bar deadlift|Bulgarian split squat|Hip thrust|Romanian deadlift", "Nordic hamstring curl|Copenhagen plank|Calf raise|Step-up|Pallof press|Face pull", "Box jump|Depth jump|Pogo jumps|Lateral skater jump|Jump squat|Broad jump"),
			session("Kastestyrke & skulderrobusthed", "Kraft fra ben og rotation gennem en stabil skulder", 60, "Push press|Half-kneeling landmine press|Pull-up|Pendlay row|Incline dumbbell bench press|Landmine row|Bænkpres|Dips|Cable chest press|Push-up|Single-arm dumbbell bench press", "Face pull|Band external rotation|Cable external rotation|Pallof press|Serratus wall slide|Dead bug", "Overhead medicine ball throw|Rotational medicine ball throw|Medicine ball chest pass|Medicine ball scoop toss|Landmine rotation|Plyometric push-up"),
			session("Retningsskift & ensidig kontrol", "Bremsning, lateral acceleration og robusthed i knæ og lyske", 55, "Bulgarian split squat|Step-up|Lateral lunge|Single-leg Romanian deadlift|Front squat|Hip thrust", "Copenhagen plank|Nordic hamstring curl|Calf raise|Suitcase carry|Face pull|Pallof press", "Lateral skater jump|Carioca drill|Lateral ladder drill|Single-leg balance reach|Pogo jumps|Banded lateral walk")
		]
	}
};
var conditioning = (title, objective, keywords, zone) => ({
	title,
	objective,
	keywords: names(keywords),
	zone
});
var conditioningBlueprints = {
	long_distance: [
		conditioning("Teknik & aerob base", "Stabil teknik ved lav metabolisk belastning", "teknik|aerob|indsvømning|crawl|sculling", "Pulszone 2"),
		conditioning("Tærskel & tempo", "Jævne splittider tæt på bæredygtig tærskel", "tærskel|tempo|2500", "Pulszone 3–4"),
		conditioning("Lang specifik udholdenhed", "Pacing og teknisk holdbarhed over længere serier", "aerob crawl|pull buoy|udholdenhed|lang", "Pulszone 2–3")
	],
	middle_distance: [
		conditioning("Aerob støtte & teknik", "Bevar effektiv mekanik mellem fartpassene", "aerob|teknik|crawl|sculling", "Pulszone 2–3"),
		conditioning("Tærskelkapacitet", "Gentag høj fart med kontrollerede pauser", "tærskel|interval|3000", "Pulszone 3–4"),
		conditioning("Race pace & afslutning", "Præcis konkurrencefart uden teknisk fald", "race pace|sprint|vending", "Pulszone 4–5")
	],
	sprint: [
		conditioning("Start, vending & undervand", "Eksplosive færdigheder med fuld kvalitet", "start|vending|undervand", "Pulszone 2–4"),
		conditioning("Topfart", "Maksimal fart med lange pauser", "sprint|race pace|acceleration", "Pulszone 4–5"),
		conditioning("Speed endurance", "Bevar fart gennem hele konkurrencedistancen", "race pace|tærskel|butterfly", "Pulszone 4–5")
	],
	athletics: [
		conditioning("Acceleration", "Første skridt og horisontal kraft", "acceleration|10-yard|20 m|bakke", "Pulszone 3–5"),
		conditioning("Fart & retningsskift", "Høj løbehastighed med fuld bevægelseskvalitet", "sprint|shuttle|retningsskift", "Pulszone 4–5"),
		conditioning("Tempo & kapacitet", "Aerob støtte uden at sløve power", "tempo|roligt|restitution", "Pulszone 2–3")
	],
	running: [
		conditioning("Rolig base & teknik", "Byg volumen med stabil løbeøkonomi", "roligt|aerob|restitution", "Pulszone 2"),
		conditioning("Tærskel", "Flyt den bæredygtige fart med kontrollerede intervaller", "tærskel|bakke|3000", "Pulszone 3–4"),
		conditioning("10 km-fart", "Præcis målfart og pacing", "10 km|progressivt|interval", "Pulszone 4")
	],
	skiing: [
		conditioning("Aerob skikapacitet", "Teknisk rytme og langvarigt arbejde", "ski|dobbeltstav|aerob", "Pulszone 2–3"),
		conditioning("Tærskel & stavkraft", "Vedvarende effekt gennem core og overkrop", "skierg|dobbeltstav|tærskel", "Pulszone 3–4"),
		conditioning("Konkurrenceintervaller", "Gentag høj fart med stabil teknik", "interval|500 m|1000 m", "Pulszone 4–5")
	],
	triathlon: [
		conditioning("Svømning", "Teknik og aerob vandkapacitet", "crawl|svøm|sculling|pull buoy", "Pulszone 2–3"),
		conditioning("Cykling", "Kadence, tærskel og trådøkonomi", "cykel|kadence|bakke", "Pulszone 2–4"),
		conditioning("Løb & brick", "Stabil løberytme efter cykling", "brick|løb|tærskel|10 km", "Pulszone 3–4")
	],
	ironman: [
		conditioning("Lang aerob base", "Bæredygtig intensitet og energiøkonomi", "aerob|lang|roligt", "Pulszone 2"),
		conditioning("Race pace & brick", "Ernæring, pacing og disciplineret skifte", "brick|race|tærskel", "Pulszone 2–3"),
		conditioning("Teknik & restitution", "Bevar bevægelseskvalitet under høj samlet volumen", "restitution|kadence|teknik|crawl", "Pulszone 1–2")
	],
	hyrox: [
		conditioning("Løbeøkonomi", "Stabil konkurrencefart mellem stationerne", "hyrox løb|løbeinterval|roligt", "Pulszone 3–4"),
		conditioning("SkiErg & roning", "Kontrollerede splits og effektiv helkropsrytme", "skierg|romaskine", "Pulszone 3–4"),
		conditioning("Kompromitteret løb", "Genfind rytmen efter høj lokal belastning", "bakke|tærskel|restitution", "Pulszone 3–4")
	],
	crossfit: [
		conditioning("Roning", "Jævn pacing og effektiv trækrytme", "romaskine|roning", "Pulszone 3–4"),
		conditioning("SkiErg", "Hofte- og stavkraft med kontrolleret split", "skierg|ski", "Pulszone 3–4"),
		conditioning("Aerob engine", "Sammenhængende arbejde uden teknisk kollaps", "roligt|aerob|interval", "Pulszone 2–4")
	],
	cycling: [
		conditioning("Aerob base & kadence", "Stabilt tråd og lav metabolisk pris", "aerob|kadence|restitution", "Pulszone 2"),
		conditioning("Tærskel & bakke", "Vedvarende effekt med rolig overkrop", "tærskel|bakke", "Pulszone 3–4"),
		conditioning("Sprintkraft", "Høj topkraft med fuld pause", "sprint|250 m", "Pulszone 4–5")
	],
	american_football: [
		conditioning("10-yard acceleration", "Eksplosivt første skridt med fuld pause", "10-yard|acceleration|20 m", "Pulszone 3–5"),
		conditioning("Retningsskift", "Bremsning og re-acceleration i kamprelevante vinkler", "5-10-5|retningsskift|shuttle", "Pulszone 4–5"),
		conditioning("Gentagen sprint", "Bevar sprintkvalitet gennem gentagne plays", "repeated|kamp|tempo", "Pulszone 3–5")
	],
	football: [
		conditioning("Acceleration & retningsskift", "Korte kamprelevante aktioner med høj kvalitet", "acceleration|retningsskift|5-10-5", "Pulszone 3–5"),
		conditioning("Gentagen sprint", "Gentag høj fart med begrænset farttab", "repeated|suicide|kampintervaller", "Pulszone 4–5"),
		conditioning("Aerob kampkapacitet", "Restituer hurtigere mellem intense aktioner", "tempo|roligt|restitution", "Pulszone 2–3")
	],
	handball: [
		conditioning("Acceleration & bremsning", "Korte fremadrettede og laterale aktioner", "acceleration|retningsskift|5-10-5", "Pulszone 3–5"),
		conditioning("Gentagen sprint", "Bevar kvalitet gennem gentagne kontrafaser", "repeated|suicide|kampintervaller", "Pulszone 4–5"),
		conditioning("Aerob restitution", "Bedre restitution mellem dueller og spring", "tempo|roligt|restitution", "Pulszone 2–3")
	]
};
//#endregion
//#region app/program-catalog.ts
var profileFocus = {
	weightlifting: [
		"konkurrenceløft",
		"teknik",
		"maksimal styrke",
		"power"
	],
	long_distance: [
		"styrkeudholdenhed",
		"skulderrobusthed",
		"kropslinje",
		"2500 m temposvømning"
	],
	middle_distance: [
		"race pace",
		"power",
		"tærskel",
		"3000 m vandinterval"
	],
	sprint: [
		"start og vending",
		"topfart",
		"eksplosiv styrke",
		"sprintserier i vand"
	],
	recreational: [
		"helkropsstyrke",
		"bevægelseskvalitet",
		"vaner",
		"grundform"
	],
	athletics: [
		"acceleration",
		"springkraft",
		"kastestyrke",
		"robusthed"
	],
	golf: [
		"rotation",
		"hoftekontrol",
		"slagkraft",
		"rygstabilitet"
	],
	running: [
		"hurtigere 10 km",
		"løbeøkonomi",
		"tærskel",
		"3000 m intervalløb"
	],
	powerlifting: [
		"squat",
		"bænkpres",
		"dødløft",
		"konkurrenceform"
	],
	skiing: [
		"benudholdenhed",
		"balance",
		"stavkraft",
		"aerob kapacitet"
	],
	triathlon: [
		"disciplinbalance",
		"styrkeudholdenhed",
		"skiftezonen",
		"aerob base"
	],
	ironman: [
		"lang udholdenhed",
		"energiøkonomi",
		"robusthed",
		"raceforberedelse"
	],
	hyrox: [
		"stationsstyrke",
		"løbsøkonomi",
		"sled power",
		"arbejdskapacitet"
	],
	crossfit: [
		"mixed modal",
		"gymnastik",
		"vægtløftning",
		"engine"
	],
	cycling: [
		"trådøkonomi",
		"tærskel",
		"sprintkraft",
		"position"
	],
	american_football: [
		"10-yard acceleration",
		"kontaktstyrke",
		"retningsskift",
		"positionskraft"
	],
	football: [
		"kampkondition",
		"acceleration",
		"suicide runs",
		"retningsskift"
	],
	handball: [
		"springkraft",
		"kastestyrke",
		"retningsskift",
		"skulderrobusthed"
	]
};
var directCoachOnly = (_profile, focus) => /løb|interval|suicide|vand|race pace|tærskel|aerob base|lang udholdenhed|kampkondition|2500 m|3000 m|sprintserier/i.test(focus);
var programTemplates = Array.from({ length: 500 }, (_, index) => {
	const sport = sportProfiles[index % sportProfiles.length];
	const focus = profileFocus[sport.id][Math.floor(index / sportProfiles.length) % profileFocus[sport.id].length];
	const difficulty = [
		"Begynder",
		"Øvet",
		"Avanceret"
	][Math.floor(index / (sportProfiles.length * 4)) % 3];
	const cycle = Math.floor(index / sportProfiles.length) + 1;
	return {
		id: `base-template-${sport.id}-${String(cycle).padStart(2, "0")}`,
		sportId: sport.id,
		title: `${sport.label}: ${focus} · forløb ${cycle}`,
		goal: `Forbedr ${focus} gennem en tydelig 12-ugers progression`,
		focus,
		difficulty,
		durationWeeks: 12,
		sessionsPerWeek: difficulty === "Begynder" ? 2 : 3,
		visibility: directCoachOnly(sport.id, focus) ? "coach_only" : "athlete"
	};
});
var withSessionTheme = (title, theme) => `${title.slice(0, Math.max(1, 77 - theme.length)).trimEnd()} · ${theme}`;
var exerciseSearchText = (exercise) => `${exercise.name} ${exercise.target} ${exercise.focus ?? ""}`.toLocaleLowerCase("da-DK");
var generalStrengthNames = [
	"Front squat",
	"Back squat",
	"Dødløft",
	"Bænkpres",
	"Strict press",
	"Romanian deadlift",
	"Pendlay row",
	"Pull-up",
	"Bulgarian split squat",
	"Dips",
	"Hip thrust",
	"Farmer's walk",
	"Goblet squat",
	"Trap bar deadlift",
	"Step-up",
	"Reverse lunge",
	"Lateral lunge",
	"Nordic hamstring curl",
	"Calf raise",
	"Single-leg Romanian deadlift",
	"Chest-supported dumbbell row",
	"Incline dumbbell bench press",
	"Half-kneeling landmine press",
	"Landmine row",
	"Cable chest press",
	"Push-up",
	"Lat pulldown",
	"Seated cable row",
	"Dumbbell shoulder press",
	"Face pull",
	"Band external rotation",
	"Box jump",
	"Medicine ball slam",
	"Pallof press",
	"Side plank",
	"Copenhagen plank",
	"Dead bug",
	"Bird dog",
	"Suitcase carry",
	"Hollow body hold",
	"Ab wheel rollout"
];
var swimStrengthNames = [
	"Straight-arm pulldown",
	"Single-arm cable pulldown",
	"Swim bench freestyle pull",
	"Swim bench butterfly pull",
	"Band freestyle stroke",
	"Band butterfly stroke",
	"Band breaststroke pull",
	"Band backstroke pull",
	"Streamline lat pulldown",
	"Streamline overhead hold",
	"Prone swimmer",
	"Prone Y-T-W",
	"Serratus wall slide",
	"Scapular pull-up",
	"Scapular push-up",
	"Cable internal rotation",
	"Cable external rotation",
	"Overhead medicine ball throw",
	"Rotational medicine ball throw",
	"Tall-kneeling cable chop",
	"Tall-kneeling cable lift",
	"Single-arm row with rotation",
	"Isometric catch hold"
];
var enduranceStrengthNames = [
	"Trap bar deadlift",
	"Bulgarian split squat",
	"Single-leg Romanian deadlift",
	"Step-up",
	"Reverse lunge",
	"Lateral lunge",
	"Nordic hamstring curl",
	"Calf raise",
	"Hip thrust",
	"Goblet squat",
	"Copenhagen plank",
	"Side plank",
	"Pallof press",
	"Suitcase carry",
	"Chest-supported dumbbell row",
	"Half-kneeling landmine press",
	"Box jump",
	"Medicine ball slam"
];
var fieldStrengthNames = [
	"Trap bar deadlift",
	"Front squat",
	"Bulgarian split squat",
	"Nordic hamstring curl",
	"Box jump",
	"Medicine ball slam",
	"Push press",
	"Bænkpres",
	"Pull-up",
	"Pendlay row",
	"Copenhagen plank",
	"Farmer's walk",
	"Reverse lunge",
	"Lateral lunge",
	"Hip thrust",
	"Face pull"
];
var golfStrengthNames = [
	"Rotational medicine ball throw",
	"Tall-kneeling cable chop",
	"Tall-kneeling cable lift",
	"Pallof press",
	"Half-kneeling landmine press",
	"Single-leg Romanian deadlift",
	"Split squat",
	"Suitcase carry",
	"Medicine ball slam",
	"Cable chest press",
	"Landmine row",
	"Chest-supported dumbbell row",
	"Reverse lunge",
	"Side plank",
	"Bird dog",
	"Hip thrust",
	"Face pull",
	"Band external rotation",
	"Dead bug"
];
var powerliftingStrengthNames = [
	"Back squat",
	"Bænkpres",
	"Dødløft",
	"Pause back squat",
	"Tempo back squat",
	"Front squat",
	"Romanian deadlift",
	"Pendlay row",
	"Pull-up",
	"Dips",
	"Bulgarian split squat",
	"Hip thrust",
	"Face pull",
	"Lat pulldown",
	"Incline dumbbell bench press",
	"Ab wheel rollout"
];
var weightliftingStrengthNames = [
	"Snatch",
	"Power snatch",
	"Hang snatch",
	"Clean & Jerk",
	"Power clean",
	"Hang clean",
	"Split jerk",
	"Push jerk",
	"Front squat",
	"Back squat",
	"Snatch pull",
	"Clean pull",
	"Romanian deadlift",
	"Strict press",
	"Pendlay row",
	"Pull-up",
	"Bulgarian split squat",
	"Overhead squat"
];
var profileStrengthNames = {
	weightlifting: weightliftingStrengthNames,
	long_distance: swimStrengthNames,
	middle_distance: swimStrengthNames,
	sprint: swimStrengthNames,
	recreational: generalStrengthNames,
	athletics: fieldStrengthNames,
	golf: golfStrengthNames,
	running: enduranceStrengthNames,
	powerlifting: powerliftingStrengthNames,
	skiing: enduranceStrengthNames,
	triathlon: [...swimStrengthNames, ...enduranceStrengthNames],
	ironman: [...enduranceStrengthNames, ...swimStrengthNames],
	hyrox: [...fieldStrengthNames, ...enduranceStrengthNames],
	crossfit: [...weightliftingStrengthNames, ...fieldStrengthNames],
	cycling: enduranceStrengthNames,
	american_football: fieldStrengthNames,
	football: fieldStrengthNames,
	handball: fieldStrengthNames
};
var profileSportSpecificNames = {
	weightlifting: [
		"Snatch",
		"Power snatch",
		"Hang snatch",
		"Clean & Jerk",
		"Power clean",
		"Hang clean",
		"Split jerk",
		"Push jerk",
		"Snatch balance",
		"Jerk-fodarbejde uden vægt"
	],
	long_distance: [
		"Straight-arm pulldown",
		"Single-arm cable pulldown",
		"Swim bench freestyle pull",
		"Band freestyle stroke",
		"Streamline lat pulldown",
		"Prone swimmer",
		"Scapular pull-up",
		"Isometric catch hold"
	],
	middle_distance: [
		"Swim bench freestyle pull",
		"Swim bench butterfly pull",
		"Band freestyle stroke",
		"Streamline overhead hold",
		"Overhead medicine ball throw",
		"Rotational medicine ball throw",
		"Scapular push-up",
		"Single-arm row with rotation"
	],
	sprint: [
		"Overhead medicine ball throw",
		"Rotational medicine ball throw",
		"Streamline overhead hold",
		"Scapular push-up",
		"Single-arm row with rotation",
		"Band butterfly stroke",
		"Isometric catch hold",
		"Plyometric push-up"
	],
	recreational: [
		"Box jump",
		"Broad jump",
		"Medicine ball chest pass",
		"A-skip",
		"Bear crawl",
		"Cross-crawl",
		"Banded lateral walk",
		"Single-leg balance reach"
	],
	athletics: [
		"Depth jump",
		"Broad jump",
		"Pogo jumps",
		"A-skip",
		"Lateral skater jump",
		"Jump squat",
		"Medicine ball scoop toss",
		"Lateral ladder drill"
	],
	golf: [
		"Cable rotation",
		"Hip airplane",
		"Landmine rotation",
		"Rotational medicine ball throw",
		"Medicine ball scoop toss",
		"Tall-kneeling cable chop",
		"Tall-kneeling cable lift",
		"Half-kneeling anti-rotation hold"
	],
	running: [
		"A-skip",
		"Pogo jumps",
		"Banded hip-flexion march",
		"Single-leg calf raise",
		"Single-leg balance reach",
		"Banded lateral walk",
		"Step-up",
		"Lateral skater jump"
	],
	powerlifting: [
		"Back squat",
		"Bænkpres",
		"Dødløft",
		"Pause back squat",
		"Tempo back squat",
		"Front squat",
		"Romanian deadlift",
		"Incline dumbbell bench press",
		"Dips",
		"Hip thrust",
		"Pendlay row",
		"Pull-up",
		"Ab wheel rollout",
		"Lat pulldown"
	],
	skiing: [
		"Lateral skater jump",
		"Single-leg balance reach",
		"Banded lateral walk",
		"Jump squat",
		"Step-up",
		"Lateral lunge",
		"Suitcase carry",
		"Copenhagen plank"
	],
	triathlon: [
		"A-skip",
		"Pogo jumps",
		"Banded hip-flexion march",
		"Straight-arm pulldown",
		"Band freestyle stroke",
		"Single-leg calf raise",
		"Hip airplane",
		"Pallof press"
	],
	ironman: [
		"Banded hip-flexion march",
		"Straight-arm pulldown",
		"Band freestyle stroke",
		"Single-leg calf raise",
		"Hip airplane",
		"Banded lateral walk",
		"Pallof press",
		"Dead bug"
	],
	hyrox: [
		"Sled push",
		"Sled pull",
		"Farmers carry",
		"Sandbag walking lunges",
		"Wall balls",
		"Burpee broad jumps",
		"Kettlebell swing",
		"Dumbbell thruster"
	],
	crossfit: [
		"Snatch",
		"Clean & Jerk",
		"Power clean",
		"Push jerk",
		"Kettlebell swing",
		"Dumbbell thruster",
		"Toes-to-bar",
		"Handstand push-up",
		"Wall balls",
		"Burpee broad jumps"
	],
	cycling: [
		"Single-leg squat to box",
		"Banded lateral walk",
		"Single-leg calf raise",
		"Banded hip-flexion march",
		"Hip airplane",
		"Single-leg Romanian deadlift",
		"Copenhagen plank",
		"Pallof press"
	],
	american_football: [
		"Sled push",
		"Sled pull",
		"Broad jump",
		"Depth jump",
		"Plyometric push-up",
		"Medicine ball chest pass",
		"Lateral ladder drill",
		"Carioca drill"
	],
	football: [
		"Lateral skater jump",
		"Pogo jumps",
		"A-skip",
		"Lateral ladder drill",
		"Carioca drill",
		"Broad jump",
		"Depth jump",
		"Nordic hamstring curl"
	],
	handball: [
		"Lateral skater jump",
		"Landmine rotation",
		"Medicine ball chest pass",
		"Medicine ball scoop toss",
		"Overhead medicine ball throw",
		"Rotational medicine ball throw",
		"Pogo jumps",
		"Plyometric push-up",
		"Band external rotation"
	]
};
var isGeneratedCatalogVariant = (exercise) => exercise.name.split(" · ").length >= 3 && /\s\d+$/.test(exercise.name);
var exerciseMovementFamily = (name) => {
	const base = name.split(" · ")[0].trim().toLocaleLowerCase("da-DK");
	if (/medicine ball|medicinbold|throw|kast|slam/.test(base)) return "powerkast";
	if (/\b(?:jump|hop)\b|spring/.test(base)) return "spring";
	if (/single-leg romanian/.test(base)) return "ensidigt hoftedominant";
	if (/split squat|bulgarian|step-up|reverse lunge|lateral lunge/.test(base)) return "ensidigt knædominant";
	if (/front squat|back squat|goblet squat|leg press|box squat|anderson squat/.test(base)) return "bilateral squat";
	if (/nordic|leg curl/.test(base)) return "baglår knæfleksion";
	if (/deadlift|dødløft|romanian deadlift|hip thrust|glute bridge/.test(base)) return "bilateral hofteekstension";
	if (/bench|bænk|chest press|push-up|dips/.test(base)) return "horisontalt pres";
	if (/strict press|shoulder press|push press|landmine press/.test(base)) return "vertikalt pres";
	if (/row/.test(base)) return "horisontalt træk";
	if (/pulldown|pull-up/.test(base)) return "vertikalt træk";
	if (/face pull|external rotation|internal rotation|wall slide|wall angel|prone|scapular/.test(base)) return "skulderkontrol";
	if (/pallof|rotation|chop|cable lift/.test(base)) return "rotation og antirotation";
	if (/side plank|copenhagen/.test(base)) return "lateral core";
	if (/plank|dead bug|bird dog|hollow|ab wheel/.test(base)) return "anti-ekstension og corekontrol";
	if (/carry|walk/.test(base)) return "carry";
	if (/calf raise/.test(base)) return "lægstyrke";
	if (/snatch/.test(base)) return "snatch";
	if (/clean/.test(base)) return "clean";
	if (/jerk/.test(base)) return "jerk";
	return base;
};
var uniqueExercises = (exercises) => Array.from(new Map(exercises.map((exercise) => [exercise.name, exercise])).values());
var isMainExercise = (exercise) => /snatch|clean|jerk|front squat|back squat|goblet squat|trap bar deadlift|deadlift|dødløft|romanian deadlift|bench|bænk|strict press|push press|shoulder press|pull-up|row|hip thrust|dips|lat pulldown|leg press/i.test(exercise.name);
var distanceExerciseTheme = (exercise) => {
	const text = exerciseSearchText(exercise);
	if (/jump|throw|kast|slam|snatch|clean|jerk|power|single-leg|split squat|lunge|step-up/.test(text)) return 1;
	if (/plank|pallof|carry|walk|rotation|chop|lift|face pull|dead bug|bird dog|hollow|ab wheel|band|wall|scapular|prone|stabil|robust/.test(text)) return 2;
	return 0;
};
var rotatePool = (pool, offset) => {
	if (pool.length === 0) return [];
	const safeOffset = (offset % pool.length + pool.length) % pool.length;
	return [...pool.slice(safeOffset), ...pool.slice(0, safeOffset)];
};
var pickExercise = (pool, offset, usedNames, sessionFamilies, blockedNames) => {
	const available = rotatePool(pool, offset).filter((exercise) => !usedNames.has(exercise.name));
	const preferred = available.filter((exercise) => !blockedNames.has(exercise.name));
	return preferred.find((exercise) => !sessionFamilies.has(exerciseMovementFamily(exercise.name))) ?? preferred[0] ?? available.find((exercise) => !sessionFamilies.has(exerciseMovementFamily(exercise.name))) ?? available[0] ?? null;
};
var selectStrengthWeek = (profile, pool, difficulty, variant, week, blockedNames, activeSessionIndexes = [
	0,
	1,
	2
]) => {
	const byName = new Map(exerciseLibrary.map((exercise) => [exercise.name, exercise]));
	const blueprint = sportProgramBlueprints[profile];
	const sportSpecific = uniqueExercises(profileSportSpecificNames[profile].map((name) => byName.get(name)).filter((exercise) => Boolean(exercise) && exercise.visibility !== "coach_only"));
	const sportNames = new Set(sportSpecific.map((exercise) => exercise.name));
	const main = pool.filter((exercise) => isMainExercise(exercise) && !sportNames.has(exercise.name));
	const assistance = pool.filter((exercise) => !isMainExercise(exercise) && !sportNames.has(exercise.name));
	const counts = {
		main: difficulty === "Begynder" && ![
			"weightlifting",
			"powerlifting",
			"handball"
		].includes(profile) ? 1 : 2,
		assistance: 2,
		sport_specific: 1
	};
	const pools = {
		main: main.length > 0 ? main : pool.filter((exercise) => !sportNames.has(exercise.name)),
		assistance: assistance.length > 0 ? assistance : pool.filter((exercise) => !sportNames.has(exercise.name)),
		sport_specific: sportSpecific.length > 0 ? uniqueExercises([...sportSpecific, ...pool]) : pool
	};
	const usedNames = /* @__PURE__ */ new Set();
	const roleOrder = [
		"main",
		"assistance",
		"sport_specific"
	];
	return blueprint.sessions.map((sessionBlueprint, sessionIndex) => {
		if (!activeSessionIndexes.includes(sessionIndex)) return [];
		const selected = [];
		const sessionFamilies = /* @__PURE__ */ new Set();
		for (const role of roleOrder) {
			const count = counts[role];
			const priorityPool = uniqueExercises((role === "main" ? sessionBlueprint.main : role === "assistance" ? sessionBlueprint.assistance : sessionBlueprint.sportSpecific).map((name) => byName.get(name)).filter((exercise) => Boolean(exercise)));
			const weeklyStride = count * blueprint.sessions.length;
			for (let position = 0; position < count; position += 1) {
				const offset = variant * 7 + (week - 1) * weeklyStride + sessionIndex * count + position;
				const rotatedPriority = rotatePool(priorityPool, offset);
				const rotatedFallback = rotatePool(pools[role], offset);
				const exercise = pickExercise(uniqueExercises(week % 4 === 0 ? [...rotatedFallback, ...rotatedPriority] : [...rotatedPriority, ...rotatedFallback]), 0, usedNames, sessionFamilies, blockedNames);
				if (!exercise) continue;
				selected.push({
					exercise,
					role
				});
				usedNames.add(exercise.name);
				sessionFamilies.add(exerciseMovementFamily(exercise.name));
			}
		}
		return selected;
	});
};
var sportPool = (profile, tracking, difficulty, focus) => {
	const focusTerms = focus.toLocaleLowerCase("da-DK").split(/\s+|·/).filter((term) => term.length > 3);
	const candidates = exerciseLibrary.filter((exercise) => exercise.sports?.includes(profile) && (exercise.format ?? "load") === tracking && (tracking === "distance" ? exercise.visibility === "coach_only" : exercise.visibility !== "coach_only"));
	const priorityNames = tracking === "load" ? [...profileStrengthNames[profile], ...generalStrengthNames] : [];
	const byName = new Map(exerciseLibrary.map((exercise) => [exercise.name, exercise]));
	const curated = priorityNames.map((name) => byName.get(name)).filter((exercise) => Boolean(exercise));
	const pool = tracking === "load" ? uniqueExercises([...curated, ...candidates.filter((exercise) => !isGeneratedCatalogVariant(exercise))]) : candidates;
	const priority = new Map(priorityNames.map((name, index) => [name, priorityNames.length - index]));
	return pool.sort((left, right) => {
		const score = (exercise) => (exercise.difficulty === difficulty ? 3 : 0) + focusTerms.filter((term) => exerciseSearchText(exercise).includes(term)).length * 2;
		return score(right) - score(left) || (priority.get(right.name) ?? 0) - (priority.get(left.name) ?? 0) || left.name.localeCompare(right.name, "da");
	});
};
var selectDistanceWeek = (profile, pool, perSession, variant, weekIndex) => {
	if (pool.length === 0) return [];
	const blueprints = conditioningBlueprints[profile];
	const offset = (Math.max(0, variant - 1) + weekIndex * perSession * 3) % pool.length;
	const rotated = [...pool.slice(offset), ...pool.slice(0, offset)];
	const usedFamilies = /* @__PURE__ */ new Set();
	const usedNames = /* @__PURE__ */ new Set();
	return [
		0,
		1,
		2
	].map((sessionIndex) => {
		const keywords = blueprints?.[sessionIndex].keywords ?? [];
		const preferredPool = pool.filter((exercise) => {
			const text = exerciseSearchText(exercise);
			return keywords.some((keyword) => text.includes(keyword.toLocaleLowerCase("da-DK"))) || !blueprints && distanceExerciseTheme(exercise) === sessionIndex;
		});
		const preferredOffset = preferredPool.length === 0 ? 0 : (offset + sessionIndex * 3) % preferredPool.length;
		const preferred = [...preferredPool.slice(preferredOffset), ...preferredPool.slice(0, preferredOffset)];
		const fallback = rotated.filter((exercise) => distanceExerciseTheme(exercise) !== sessionIndex);
		const selected = [];
		for (const exercise of [...preferred, ...rotatePool(fallback, sessionIndex * perSession)]) {
			const family = exerciseMovementFamily(exercise.name);
			if (usedFamilies.has(family)) continue;
			selected.push(exercise);
			usedFamilies.add(family);
			usedNames.add(exercise.name);
			if (selected.length === perSession) break;
		}
		if (selected.length < perSession) for (const exercise of rotated) {
			if (usedNames.has(exercise.name)) continue;
			selected.push(exercise);
			usedNames.add(exercise.name);
			if (selected.length === perSession) break;
		}
		return selected;
	});
};
var roleLabel = {
	main: "Hovedøvelse",
	assistance: "Assistance",
	sport_specific: "Sportsrelevant"
};
var sessionExercise = (exercise, week, programRole = "sport_specific") => {
	const progressed = progressExercisePrescription({
		name: exercise.name,
		sets: Math.max(1, Number(exercise.sets) || 3),
		plannedReps: exercise.reps,
		defaultWeight: exercise.weight,
		focus: exercise.cue,
		tracking: exercise.format ?? "load",
		restSeconds: exercise.format === "distance" ? 45 : 75,
		effortMetric: exercise.format === "distance" ? "heart_rate_zone" : "rir",
		effortTarget: exercise.format === "distance" ? "Pulszone 2–3" : "3–4 RIR",
		detail: "",
		programRole
	}, week);
	return {
		...progressed,
		detail: `${roleLabel[programRole]} · ${progressed.detail}`
	};
};
var conditioningVolumeFactors = [
	.8,
	.9,
	1,
	.65,
	.9,
	1,
	1.08,
	.7,
	1,
	1.08,
	.85,
	.55
];
var conditioningExercise = (exercise, week, zone) => {
	const baseSets = Math.max(1, Number(exercise.sets) || 1);
	const baseDistance = Math.max(1, Number.parseFloat(exercise.reps) || 1);
	const factor = conditioningVolumeFactors[week - 1] ?? 1;
	const speedWork = /sprint|acceleration|start|vending|retningsskift|10-yard|5-10-5/i.test(exerciseSearchText(exercise));
	const sets = baseSets === 1 ? 1 : Math.max(2, Math.round(baseSets * (speedWork ? Math.min(1, factor) : factor)));
	const distanceIncrement = baseDistance >= 5e3 ? 500 : baseDistance >= 1e3 ? 250 : baseDistance >= 100 ? 25 : 5;
	const plannedReps = `${baseSets === 1 ? Math.max(distanceIncrement, Math.round(baseDistance * factor / distanceIncrement) * distanceIncrement) : baseDistance} m`;
	const restSeconds = speedWork ? 90 : /tærskel|race|interval/i.test(exerciseSearchText(exercise)) ? 60 : 30;
	return {
		name: exercise.name,
		sets,
		plannedReps,
		defaultWeight: "0",
		focus: exercise.cue,
		tracking: "distance",
		restSeconds,
		effortMetric: "heart_rate_zone",
		effortTarget: zone,
		detail: `Sportsrelevant · ${sets} × ${plannedReps} · ${zone.toLocaleLowerCase("da-DK")} · ${restSeconds} sek pause`,
		programRole: "sport_specific"
	};
};
var scheduledBlueprintIndexes = (weekIndex, sessionsPerWeek) => sessionsPerWeek === 2 ? [weekIndex % 3, (weekIndex + 1) % 3] : [
	0,
	1,
	2
];
var buildGenericTrainingPlan = (profile, variant = 0, difficulty = "Øvet", focus = "sportsrelevant styrke", sessionsPerWeek = 3) => {
	const recentWeekNames = [];
	const blueprint = sportProgramBlueprints[profile];
	return Array.from({ length: 12 }, (_, weekIndex) => {
		const week = weekIndex + 1;
		const progression = getWeekProgression(week);
		const previousWeek = recentWeekNames.at(-1);
		const twoWeeksAgo = recentWeekNames.at(-2);
		const blockedNames = previousWeek && twoWeeksAgo ? new Set([...previousWeek].filter((name) => twoWeeksAgo.has(name))) : /* @__PURE__ */ new Set();
		const blueprintIndexes = scheduledBlueprintIndexes(weekIndex, sessionsPerWeek);
		const weeklyExercises = selectStrengthWeek(profile, sportPool(profile, "load", difficulty, focus), difficulty, variant, week, blockedNames, blueprintIndexes);
		recentWeekNames.push(new Set(blueprintIndexes.flatMap((index) => weeklyExercises[index].map(({ exercise }) => exercise.name))));
		return blueprintIndexes.map((blueprintIndex, scheduledIndex) => {
			const day = sessionsPerWeek === 2 ? ["TIRSDAG", "LØRDAG"][scheduledIndex] : [
				"MANDAG",
				"ONSDAG",
				"LØRDAG"
			][scheduledIndex];
			const exercises = weeklyExercises[blueprintIndex].map(({ exercise, role }) => sessionExercise(exercise, week, role));
			const sessionBlueprint = blueprint.sessions[blueprintIndex];
			return {
				programId: `base-${profile}-w${week}-s${scheduledIndex + 1}`,
				week,
				day,
				date: `UGE ${week}`,
				status: week === 1 && scheduledIndex === 0 ? "today" : "planned",
				title: `${sportProfiles.find((sport) => sport.id === profile)?.label} · ${sessionBlueprint.title}`,
				focus: `${progression.phase} · ${sessionBlueprint.objective}`,
				duration: sessionBlueprint.duration,
				intensity: progression.intensity,
				phase: progression.phase,
				progressionNote: progression.summary,
				exercises
			};
		});
	}).flat();
};
var getProgramTemplate = (id) => programTemplates.find((template) => template.id === id);
var buildTemplatePlan = (id) => {
	const template = getProgramTemplate(id);
	if (!template) return [];
	const variant = Number.parseInt(template.id.split("-").at(-1) ?? "0", 10) || 0;
	if (template.visibility === "coach_only") {
		const pool = sportPool(template.sportId, "distance", template.difficulty, template.focus);
		const conditioningSessions = conditioningBlueprints[template.sportId];
		return Array.from({ length: 12 }, (_, weekIndex) => {
			const week = weekIndex + 1;
			const progression = getWeekProgression(week);
			const perSession = [
				"long_distance",
				"middle_distance",
				"sprint"
			].includes(template.sportId) ? 3 : template.sportId === "hyrox" ? 2 : 1;
			const weeklyExercises = selectDistanceWeek(template.sportId, pool, perSession, variant, weekIndex);
			return scheduledBlueprintIndexes(weekIndex, template.sessionsPerWeek).map((blueprintIndex, scheduledIndex) => {
				const conditioningSession = conditioningSessions?.[blueprintIndex];
				const zone = conditioningSession?.zone ?? (blueprintIndex === 0 ? "Pulszone 2" : blueprintIndex === 1 ? "Pulszone 3–4" : "Pulszone 4–5");
				const exercises = weeklyExercises[blueprintIndex].map((exercise) => conditioningExercise(exercise, week, zone));
				const distanceMeters = exercises.reduce((total, exercise) => total + exercise.sets * (Number.parseFloat(exercise.plannedReps) || 0), 0);
				const day = template.sessionsPerWeek === 2 ? ["TIRSDAG", "LØRDAG"][scheduledIndex] : [
					"MANDAG",
					"ONSDAG",
					"LØRDAG"
				][scheduledIndex];
				return {
					programId: `${template.id}-w${week}-s${scheduledIndex + 1}`,
					week,
					day,
					date: `UGE ${week}`,
					status: week === 1 && scheduledIndex === 0 ? "today" : "planned",
					title: withSessionTheme(template.title, conditioningSession?.title ?? `Kvalitetspas ${blueprintIndex + 1}`),
					focus: `${progression.phase} · ${conditioningSession?.objective ?? template.goal}`,
					duration: 45 + blueprintIndex * 10,
					intensity: zone,
					phase: progression.phase,
					progressionNote: progression.summary,
					distanceMeters,
					exercises
				};
			});
		}).flat();
	}
	return buildGenericTrainingPlan(template.sportId, variant, template.difficulty, template.focus, template.sessionsPerWeek).map((day) => ({
		...day,
		programId: `${template.id}-${day.programId?.split("-").slice(-2).join("-")}`,
		title: withSessionTheme(template.title, day.title.split(" · ").slice(-1)[0] ?? "Træning")
	}));
};
//#endregion
//#region app/strength-program-data.ts
var strength = (name, sets, reps, weight, restSeconds, focus) => {
	const clearReps = clarifyUnilateralReps(name, reps);
	return {
		name,
		sets,
		plannedReps: clearReps,
		defaultWeight: weight,
		focus,
		tracking: "load",
		effortMetric: "rir",
		effortTarget: "2–4 RIR",
		restSeconds,
		detail: `${sets} × ${clearReps} · ${weight} kg · ${restSeconds} sek pause`
	};
};
var calendar$1 = [
	{
		week: 1,
		day: "TIRSDAG",
		date: "11. AUG"
	},
	{
		week: 1,
		day: "ONSDAG",
		date: "12. AUG"
	},
	{
		week: 1,
		day: "TORSDAG",
		date: "13. AUG"
	},
	{
		week: 1,
		day: "FREDAG",
		date: "14. AUG"
	},
	{
		week: 1,
		day: "LØRDAG",
		date: "15. AUG"
	},
	{
		week: 1,
		day: "SØNDAG",
		date: "16. AUG"
	},
	{
		week: 1,
		day: "MANDAG",
		date: "17. AUG"
	},
	{
		week: 2,
		day: "TIRSDAG",
		date: "18. AUG"
	},
	{
		week: 2,
		day: "ONSDAG",
		date: "19. AUG"
	},
	{
		week: 2,
		day: "TORSDAG",
		date: "20. AUG"
	},
	{
		week: 2,
		day: "FREDAG",
		date: "21. AUG"
	},
	{
		week: 2,
		day: "LØRDAG",
		date: "22. AUG"
	},
	{
		week: 2,
		day: "SØNDAG",
		date: "23. AUG"
	},
	{
		week: 2,
		day: "MANDAG",
		date: "24. AUG"
	}
];
var trainingDays = new Set([
	0,
	2,
	4,
	7,
	9,
	11
]);
var makeStrengthPlan = (profile, sessions) => {
	let sessionIndex = 0;
	return calendar$1.map((date, dayIndex) => {
		if (!trainingDays.has(dayIndex)) return {
			...date,
			programId: null,
			status: "rest",
			title: "Ingen styrketræning",
			focus: profile === "recreational" ? "Restitution, gåtur eller let bevægelse efter behov" : "Svømmetræning og restitution efter trænerens plan",
			duration: 0,
			intensity: "Hvile",
			exercises: []
		};
		const session = sessions[sessionIndex];
		sessionIndex += 1;
		return {
			...date,
			...session,
			programId: `strength-${profile}-w${date.week}-s${sessionIndex}`,
			status: dayIndex === 0 ? "today" : "planned"
		};
	});
};
var longDistanceStrength = [
	{
		title: "Styrkeudholdenhed A",
		focus: "Trækstyrke, hoftestabilitet og robust kropslinje",
		duration: 55,
		intensity: "Moderat",
		exercises: [
			strength("Romanian deadlift", 3, "8", "60", 75, "Kontrolleret bagkæde"),
			strength("Pull-up", 3, "6", "0", 75, "Aktive skuldre"),
			strength("Split squat", 3, "8", "24", 60, "Stabilt knæ"),
			strength("Pallof press", 3, "10", "12", 45, "Modstå rotation"),
			strength("Band external rotation", 3, "12", "5", 30, "Rolig skulderkontrol")
		]
	},
	{
		title: "Skulder & core",
		focus: "Holdning og skulderkontrol til længere arbejde",
		duration: 50,
		intensity: "Let/moderat",
		exercises: [
			strength("Seated cable row", 4, "10", "35", 60, "Saml skulderbladene"),
			strength("Push-up", 3, "10", "0", 60, "Stabil kropslinje"),
			strength("Single-leg Romanian deadlift", 3, "8", "20", 60, "Kontroller hoften"),
			strength("Dead bug", 3, "10", "0", 30, "Rolig vejrtrækning"),
			strength("Side plank", 3, "30 sek", "0", 30, "Lang kropslinje")
		]
	},
	{
		title: "Ben & ryg",
		focus: "Udholdende kraft uden unødig træthed",
		duration: 60,
		intensity: "Moderat",
		exercises: [
			strength("Front squat", 4, "6", "55", 90, "Høj torso"),
			strength("Lat pulldown", 4, "10", "40", 60, "Træk med ryggen"),
			strength("Bulgarian split squat", 3, "8 pr. ben", "20", 60, "Jævn kontrol"),
			strength("Calf raise", 3, "12", "30", 45, "Fuld bevægelse"),
			strength("Plank", 3, "40 sek", "0", 30, "Stabil vejrtrækning")
		]
	},
	{
		title: "Styrkeudholdenhed B",
		focus: "Gentagelig kvalitet i hele kroppen",
		duration: 55,
		intensity: "Moderat",
		exercises: [
			strength("Romanian deadlift", 4, "8", "62.5", 75, "Lang ryg"),
			strength("Seated cable row", 4, "10", "37.5", 60, "Kontrolleret træk"),
			strength("Half-kneeling landmine press", 3, "8", "20", 60, "Ribben ned"),
			strength("Copenhagen plank", 3, "20 sek", "0", 30, "Stabil hofte"),
			strength("Band external rotation", 3, "12", "5", 30, "Let modstand")
		]
	},
	{
		title: "Ensidig kontrol",
		focus: "Stabilitet omkring hofte, knæ og skulder",
		duration: 50,
		intensity: "Let/moderat",
		exercises: [
			strength("Split squat", 4, "8", "26", 60, "Stabil fod"),
			strength("Pull-up", 4, "6", "0", 75, "Rolig sænkning"),
			strength("Push-up", 4, "10", "0", 60, "Fast core"),
			strength("Pallof press", 3, "12", "12", 45, "Ingen rotation"),
			strength("Bird dog", 3, "10", "0", 30, "Rolig kontrol")
		]
	},
	{
		title: "Kontrolleret afslutning",
		focus: "Sammenlign kvalitet og RIR med uge ét",
		duration: 55,
		intensity: "Moderat",
		exercises: [
			strength("Front squat", 3, "6", "57.5", 90, "Samme dybde"),
			strength("Lat pulldown", 3, "10", "42.5", 60, "Stabil skulder"),
			strength("Romanian deadlift", 3, "8", "65", 75, "Kontrolleret tempo"),
			strength("Dead bug", 3, "10", "0", 30, "Hold lænden"),
			strength("Side plank", 3, "35 sek", "0", 30, "Lang linje")
		]
	}
];
var middleDistanceStrength = [
	{
		title: "Helkropsstyrke A",
		focus: "Ben, træk og stabilitet til gentagen høj fart",
		duration: 60,
		intensity: "Moderat/hård",
		exercises: [
			strength("Front squat", 4, "5", "65", 105, "Eksplosiv op"),
			strength("Pull-up", 4, "5", "0", 90, "Aktive skuldre"),
			strength("Bench press", 3, "6", "50", 90, "Stabil skulder"),
			strength("Romanian deadlift", 3, "6", "70", 90, "Kraftfuld hofte"),
			strength("Pallof press", 3, "10", "14", 45, "Stabil torso")
		]
	},
	{
		title: "Power & skulder",
		focus: "Hurtig kraft med kontrolleret skulderarbejde",
		duration: 55,
		intensity: "Power",
		exercises: [
			strength("Box jump", 5, "3", "0", 90, "Maksimal kvalitet"),
			strength("Medicine ball slam", 4, "6", "6", 60, "Eksplosiv afslutning"),
			strength("Half-kneeling landmine press", 4, "6", "25", 75, "Stabil torso"),
			strength("Seated cable row", 4, "8", "42.5", 75, "Hurtigt ind, roligt ud"),
			strength("Band external rotation", 3, "12", "5", 30, "Skulderkontrol")
		]
	},
	{
		title: "Helkropsstyrke B",
		focus: "Ensidig styrke og robust bagkæde",
		duration: 60,
		intensity: "Moderat/hård",
		exercises: [
			strength("Back squat", 4, "5", "75", 105, "Stabil bund"),
			strength("Bulgarian split squat", 3, "6 pr. ben", "28", 75, "Kontrolleret knæ"),
			strength("Lat pulldown", 4, "8", "45", 75, "Fast greb"),
			strength("Push-up", 4, "8", "0", 60, "Eksplosiv op"),
			strength("Copenhagen plank", 3, "20 sek", "0", 30, "Stabil hofte")
		]
	},
	{
		title: "Power & træk",
		focus: "Overfør kraft hurtigt uden at jage udmattelse",
		duration: 55,
		intensity: "Power",
		exercises: [
			strength("Box jump", 5, "3", "0", 90, "Friske gentagelser"),
			strength("Medicine ball slam", 5, "5", "6", 60, "Maksimal hastighed"),
			strength("Pendlay row", 4, "6", "50", 90, "Eksplosivt træk"),
			strength("Half-kneeling landmine press", 3, "6", "27.5", 75, "Fast core"),
			strength("Dead bug", 3, "8", "0", 30, "Kontrol")
		]
	},
	{
		title: "Styrke omkring race pace",
		focus: "Lav volumen og høj kvalitet mellem fartpas",
		duration: 50,
		intensity: "Moderat",
		exercises: [
			strength("Front squat", 3, "4", "70", 105, "Kraftfuld op"),
			strength("Pull-up", 3, "5", "0", 90, "Ingen kip"),
			strength("Bench press", 3, "5", "52.5", 90, "Rolig sænkning"),
			strength("Single-leg Romanian deadlift", 3, "6", "24", 60, "Stabil hofte"),
			strength("Pallof press", 3, "10", "14", 45, "Fast torso")
		]
	},
	{
		title: "Kvalitetstest",
		focus: "Gentag uge ét med samme teknik og registrér RIR",
		duration: 55,
		intensity: "Moderat/hård",
		exercises: [
			strength("Back squat", 3, "5", "77.5", 105, "Ens gentagelser"),
			strength("Seated cable row", 3, "8", "45", 75, "Stabil ryg"),
			strength("Push-up", 3, "10", "0", 60, "Fast linje"),
			strength("Medicine ball slam", 4, "5", "6", 60, "Hurtige kast"),
			strength("Side plank", 3, "30 sek", "0", 30, "Stabil core")
		]
	}
];
var sprintStrength = [
	{
		title: "Maksimal styrke A",
		focus: "Høj kraft i ben og overkrop med fulde pauser",
		duration: 65,
		intensity: "Tung",
		exercises: [
			strength("Back squat", 5, "3", "90", 150, "Eksplosiv op"),
			strength("Bench press", 5, "3", "60", 135, "Stabil skulder"),
			strength("Pull-up", 4, "4", "0", 120, "Tilføj vægt hvis let"),
			strength("Romanian deadlift", 4, "5", "80", 120, "Kraftfuld hofte"),
			strength("Pallof press", 3, "8", "16", 45, "Fast torso")
		]
	},
	{
		title: "Eksplosiv power A",
		focus: "Maksimal bevægelseshastighed og lange pauser",
		duration: 55,
		intensity: "Power",
		exercises: [
			strength("Box jump", 6, "3", "0", 120, "Stop ved faldende højde"),
			strength("Medicine ball slam", 6, "4", "8", 75, "Maksimal hastighed"),
			strength("Push press", 5, "3", "40", 120, "Hurtigt ben-drive"),
			strength("Pendlay row", 4, "4", "55", 105, "Eksplosivt træk"),
			strength("Dead bug", 3, "8", "0", 30, "Stabil core")
		]
	},
	{
		title: "Maksimal styrke B",
		focus: "Ensidig benkraft og stærkt træk",
		duration: 65,
		intensity: "Tung",
		exercises: [
			strength("Front squat", 5, "3", "80", 150, "Høj torso"),
			strength("Bulgarian split squat", 4, "5 pr. ben", "34", 90, "Eksplosiv op"),
			strength("Lat pulldown", 5, "5", "55", 105, "Tungt kontrolleret træk"),
			strength("Half-kneeling landmine press", 4, "5", "32.5", 90, "Fast torso"),
			strength("Copenhagen plank", 3, "20 sek", "0", 30, "Stabil hofte")
		]
	},
	{
		title: "Eksplosiv power B",
		focus: "Reaktiv kraft uden ophobet træthed",
		duration: 55,
		intensity: "Power",
		exercises: [
			strength("Box jump", 6, "2", "0", 120, "Maksimal højde"),
			strength("Medicine ball slam", 6, "4", "8", 75, "Hurtig kraft"),
			strength("Push press", 5, "2", "45", 120, "Eksplosivt"),
			strength("Pull-up", 4, "4", "0", 105, "Hurtigt op"),
			strength("Band external rotation", 3, "10", "5", 30, "Let kontrol")
		]
	},
	{
		title: "Tung kvalitet",
		focus: "Få stærke gentagelser med fuld kontrol",
		duration: 60,
		intensity: "Tung",
		exercises: [
			strength("Back squat", 4, "3", "92.5", 150, "Ingen langsomme reps"),
			strength("Bench press", 4, "3", "62.5", 135, "Fast opsætning"),
			strength("Romanian deadlift", 3, "4", "85", 120, "Kraftfuld hofte"),
			strength("Seated cable row", 4, "5", "50", 90, "Stabil ryg"),
			strength("Side plank", 3, "25 sek", "0", 30, "Fast core")
		]
	},
	{
		title: "Power-test",
		focus: "Sammenlign fart og RIR med første uge",
		duration: 50,
		intensity: "Power",
		exercises: [
			strength("Box jump", 5, "3", "0", 120, "Samme højde hver gang"),
			strength("Medicine ball slam", 5, "4", "8", 75, "Maksimal fart"),
			strength("Push press", 4, "3", "45", 120, "Hurtig stang"),
			strength("Pull-up", 3, "4", "0", 105, "Ren teknik"),
			strength("Pallof press", 3, "8", "16", 45, "Stabil torso")
		]
	}
];
var recreationalStrength = [
	{
		title: "Helkrop A",
		focus: "Lær bevægelserne og afslut med overskud",
		duration: 45,
		intensity: "Let/moderat",
		exercises: [
			strength("Goblet squat", 3, "8", "16", 75, "Rolig ned, stabil op"),
			strength("Seated cable row", 3, "10", "30", 60, "Saml skulderbladene"),
			strength("Push-up", 3, "8", "0", 60, "Fast kropslinje"),
			strength("Romanian deadlift", 3, "8", "40", 75, "Skub hoften tilbage"),
			strength("Dead bug", 3, "8", "0", 30, "Rolig vejrtrækning")
		]
	},
	{
		title: "Helkrop B",
		focus: "Ben, pres og træk med kontrolleret teknik",
		duration: 45,
		intensity: "Moderat",
		exercises: [
			strength("Split squat", 3, "8", "12", 60, "Stabilt knæ"),
			strength("Lat pulldown", 3, "10", "35", 60, "Træk albuerne ned"),
			strength("Incline dumbbell bench press", 3, "8", "20", 75, "Rolig sænkning"),
			strength("Glute bridge", 3, "12", "0", 45, "Spænd balderne"),
			strength("Side plank", 3, "20 sek", "0", 30, "Lang kropslinje")
		]
	},
	{
		title: "Helkrop C",
		focus: "Gentagelig styrke og god bevægelseskvalitet",
		duration: 50,
		intensity: "Moderat",
		exercises: [
			strength("Leg press", 3, "10", "60", 75, "Kontrolleret dybde"),
			strength("Seated cable row", 3, "10", "32.5", 60, "Stabil overkrop"),
			strength("Half-kneeling landmine press", 3, "8", "15", 60, "Ribben ned"),
			strength("Romanian deadlift", 3, "8", "42.5", 75, "Lang ryg"),
			strength("Farmer's walk", 3, "30 m", "24", 45, "Gå højt og roligt")
		]
	},
	{
		title: "Helkrop A · progression",
		focus: "Lidt mere arbejde med samme tekniske ro",
		duration: 45,
		intensity: "Moderat",
		exercises: [
			strength("Goblet squat", 3, "10", "16", 75, "Samme dybde hver gang"),
			strength("Seated cable row", 3, "10", "32.5", 60, "Saml skulderbladene"),
			strength("Push-up", 3, "10", "0", 60, "Stop før teknikken falder"),
			strength("Romanian deadlift", 3, "8", "42.5", 75, "Kontrolleret bagkæde"),
			strength("Dead bug", 3, "10", "0", 30, "Hold lænden rolig")
		]
	},
	{
		title: "Helkrop B · progression",
		focus: "Byg sikker styrke uden at træne til udmattelse",
		duration: 45,
		intensity: "Moderat",
		exercises: [
			strength("Split squat", 3, "8", "14", 60, "Tryk gennem hele foden"),
			strength("Lat pulldown", 3, "10", "37.5", 60, "Rolig retur"),
			strength("Incline dumbbell bench press", 3, "8", "22", 75, "Stabile skuldre"),
			strength("Glute bridge", 3, "15", "0", 45, "Fuld hofte"),
			strength("Side plank", 3, "25 sek", "0", 30, "Rolig vejrtrækning")
		]
	},
	{
		title: "Rolig afslutning",
		focus: "Sammenlign teknik, energi og RIR med første uge",
		duration: 45,
		intensity: "Let/moderat",
		exercises: [
			strength("Leg press", 3, "10", "65", 75, "Jævn bevægelse"),
			strength("Seated cable row", 3, "10", "35", 60, "Kontrolleret træk"),
			strength("Half-kneeling landmine press", 3, "8", "17.5", 60, "Fast core"),
			strength("Romanian deadlift", 3, "8", "45", 75, "Stop med overskud"),
			strength("Farmer's walk", 3, "30 m", "26", 45, "Stabil holdning")
		]
	}
];
var swimmerStrengthPlans = {
	long_distance: extendPlanToTwelveWeeks(makeStrengthPlan("long_distance", longDistanceStrength)),
	middle_distance: extendPlanToTwelveWeeks(makeStrengthPlan("middle_distance", middleDistanceStrength)),
	sprint: extendPlanToTwelveWeeks(makeStrengthPlan("sprint", sprintStrength)),
	recreational: extendPlanToTwelveWeeks(makeStrengthPlan("recreational", recreationalStrength))
};
var getSwimmerStrengthPlan = (profile) => swimmerStrengthPlans[profile];
//#endregion
//#region app/swim-program-data.ts
var swim = (name, sets, meters, restSeconds, focus) => {
	const clearReps = clarifyUnilateralReps(name, `${meters} m`);
	return {
		name,
		sets,
		plannedReps: clearReps,
		defaultWeight: "0",
		focus,
		tracking: "distance",
		effortMetric: "heart_rate_zone",
		effortTarget: "Efter passets mål",
		restSeconds,
		detail: `${sets} × ${clearReps} · ${restSeconds} sek pause`
	};
};
var calendar = [
	{
		week: 1,
		day: "TIRSDAG",
		date: "11. AUG"
	},
	{
		week: 1,
		day: "ONSDAG",
		date: "12. AUG"
	},
	{
		week: 1,
		day: "TORSDAG",
		date: "13. AUG"
	},
	{
		week: 1,
		day: "FREDAG",
		date: "14. AUG"
	},
	{
		week: 1,
		day: "LØRDAG",
		date: "15. AUG"
	},
	{
		week: 1,
		day: "SØNDAG",
		date: "16. AUG"
	},
	{
		week: 1,
		day: "MANDAG",
		date: "17. AUG"
	},
	{
		week: 2,
		day: "TIRSDAG",
		date: "18. AUG"
	},
	{
		week: 2,
		day: "ONSDAG",
		date: "19. AUG"
	},
	{
		week: 2,
		day: "TORSDAG",
		date: "20. AUG"
	},
	{
		week: 2,
		day: "FREDAG",
		date: "21. AUG"
	},
	{
		week: 2,
		day: "LØRDAG",
		date: "22. AUG"
	},
	{
		week: 2,
		day: "SØNDAG",
		date: "23. AUG"
	},
	{
		week: 2,
		day: "MANDAG",
		date: "24. AUG"
	}
];
var restDays = new Set([
	3,
	6,
	10,
	13
]);
var makePlan = (profile, sessions) => {
	let sessionIndex = 0;
	return calendar.map((date, dayIndex) => {
		if (restDays.has(dayIndex)) return {
			...date,
			programId: null,
			status: "rest",
			title: "Hviledag",
			focus: "Restitution, søvn og let bevægelse efter behov",
			duration: 0,
			intensity: "Hvile",
			distanceMeters: 0,
			exercises: []
		};
		const session = sessions[sessionIndex];
		const currentIndex = sessionIndex;
		sessionIndex += 1;
		return {
			...date,
			...session,
			exercises: session.exercises.map((exercise) => ({
				...exercise,
				effortTarget: session.intensity === "Restitution" ? "Pulszone 1–2" : exercise.effortTarget
			})),
			programId: `${profile}-w${date.week}-s${currentIndex + 1}`,
			status: dayIndex === 0 ? "today" : session.intensity === "Restitution" ? "recovery" : "planned",
			distanceMeters: session.exercises.reduce((total, exercise) => total + exercise.sets * Number.parseFloat(exercise.plannedReps), 0)
		};
	});
};
var longDistanceSessions = [
	{
		title: "Aerob base",
		focus: "Rolig rytme og ensartede splittider",
		duration: 75,
		intensity: "Aerob",
		exercises: [
			swim("Indsvømning", 4, 100, 20, "Lang udånding og afslappet rytme"),
			swim("Crawl catch-up", 4, 50, 20, "Stabil kropslinje"),
			swim("Aerob crawl", 6, 300, 30, "Samme tempo fra start til slut"),
			swim("Udsvømning", 4, 50, 15, "Meget roligt")
		]
	},
	{
		title: "Teknik under distance",
		focus: "Bevar grebet når serien bliver længere",
		duration: 70,
		intensity: "Let/moderat",
		exercises: [
			swim("Crawl med knyttede næver", 4, 50, 20, "Mærk underarmens tryk"),
			swim("Sculling foran", 4, 50, 20, "Tidligt indgreb"),
			swim("Crawl med pull buoy", 5, 300, 30, "Langt og roligt træk"),
			swim("Sidekick", 4, 50, 20, "Høj hofte")
		]
	},
	{
		title: "Tærskelkontrol",
		focus: "Kontrolleret hårdt uden farttab",
		duration: 80,
		intensity: "Tærskel",
		exercises: [
			swim("Indsvømning", 4, 100, 20, "Byg tempo gradvist"),
			swim("Tærskel crawl", 8, 200, 25, "Stabile splittider"),
			swim("Teknikcrawl med paddles", 4, 100, 30, "Fast greb uden at forcere"),
			swim("Udsvømning", 4, 50, 15, "Sænk pulsen")
		]
	},
	{
		title: "Lang serie",
		focus: "Pacing og koncentration over tid",
		duration: 85,
		intensity: "Aerob",
		exercises: [
			swim("Indsvømning", 5, 100, 20, "Find rytmen"),
			swim("Aerob crawl", 4, 500, 40, "Negativ split"),
			swim("Benspark med plade", 6, 50, 25, "Små spark fra hoften"),
			swim("Crawl fingertip drag", 4, 50, 20, "Afslappet fremføring")
		]
	},
	{
		title: "Progressiv fart",
		focus: "Afslut stærkere end du starter",
		duration: 75,
		intensity: "Moderat/hård",
		exercises: [
			swim("Indsvømning", 4, 100, 20, "Rolig åbning"),
			swim("Aerob crawl", 6, 200, 25, "Hver anden hurtigere"),
			swim("Race pace", 8, 50, 30, "Kontrolleret fart"),
			swim("Udsvømning", 4, 50, 15, "Rolig teknik")
		]
	},
	{
		title: "Aktiv restitution",
		focus: "Vandføling og bevægelseskvalitet",
		duration: 45,
		intensity: "Restitution",
		exercises: [
			swim("Indsvømning", 4, 100, 20, "Meget roligt"),
			swim("Sculling midt", 4, 50, 20, "Bløde bevægelser"),
			swim("6-1-6 sideskift", 4, 50, 20, "Balance og rotation"),
			swim("Udsvømning", 4, 100, 15, "Afslappet")
		]
	},
	{
		title: "Aerob overdistance",
		focus: "Tålmodighed og stabil mekanik",
		duration: 90,
		intensity: "Aerob",
		exercises: [
			swim("Indsvømning", 5, 100, 20, "Lang rytme"),
			swim("Crawl med pull buoy", 3, 600, 45, "Ensartet træk"),
			swim("Aerob crawl", 4, 300, 30, "Hold teknikken"),
			swim("Udsvømning", 4, 50, 15, "Let")
		]
	},
	{
		title: "Tærskelblokke",
		focus: "Arbejd tæt på tærskel med korte pauser",
		duration: 80,
		intensity: "Tærskel",
		exercises: [
			swim("Indsvømning", 4, 100, 20, "Progressivt"),
			swim("Tærskel crawl", 12, 100, 15, "Præcise splittider"),
			swim("Teknikcrawl med paddles", 6, 100, 25, "Stabilt greb"),
			swim("Udsvømning", 4, 50, 15, "Roligt")
		]
	},
	{
		title: "Pace-skift",
		focus: "Skift fart uden at miste længde",
		duration: 75,
		intensity: "Moderat/hård",
		exercises: [
			swim("Indsvømning", 4, 100, 20, "Rolig"),
			swim("Aerob crawl", 6, 200, 25, "50 rolig / 50 hurtig"),
			swim("Race pace", 10, 50, 25, "Konkurrencefrekvens"),
			swim("Crawl catch-up", 4, 50, 20, "Find længden igen")
		]
	},
	{
		title: "Kontrolleret test",
		focus: "Sammenlign tempo og oplevet anstrengelse",
		duration: 70,
		intensity: "Test",
		exercises: [
			swim("Indsvømning", 5, 100, 20, "Forbered kroppen"),
			swim("Aerob crawl", 1, 1500, 90, "Jævnt testtempo"),
			swim("Crawl med pull buoy", 4, 100, 25, "Teknisk kontrol"),
			swim("Udsvømning", 4, 100, 15, "Meget roligt")
		]
	}
];
var middleDistanceSessions = [
	{
		title: "Teknik & tempo",
		focus: "Find et effektivt tempo omkring 200-fart",
		duration: 70,
		intensity: "Moderat",
		exercises: [
			swim("Indsvømning", 4, 100, 20, "Byg tempo"),
			swim("Crawl catch-up", 4, 50, 20, "Kontrolleret timing"),
			swim("Race pace", 8, 100, 35, "Stabil 200-fart"),
			swim("Udsvømning", 4, 50, 15, "Roligt")
		]
	},
	{
		title: "Aerob støtte",
		focus: "Kapacitet mellem fartpassene",
		duration: 70,
		intensity: "Aerob",
		exercises: [
			swim("Indsvømning", 4, 100, 20, "Afslappet"),
			swim("Aerob crawl", 6, 200, 25, "Jævne splittider"),
			swim("Crawl med pull buoy", 4, 150, 30, "Stabilt greb"),
			swim("Sidekick", 4, 50, 20, "Kropslinje")
		]
	},
	{
		title: "Tærskel & afslutning",
		focus: "Hold teknikken og accelerér de sidste meter",
		duration: 80,
		intensity: "Tærskel",
		exercises: [
			swim("Indsvømning", 5, 100, 20, "Progressivt"),
			swim("Tærskel crawl", 10, 100, 20, "Kontrolleret hårdt"),
			swim("Race pace", 8, 50, 35, "Hurtig afslutning"),
			swim("Udsvømning", 4, 50, 15, "Sænk pulsen")
		]
	},
	{
		title: "200-special",
		focus: "Fartkontrol gennem fire 50’ere",
		duration: 75,
		intensity: "Race pace",
		exercises: [
			swim("Indsvømning", 4, 100, 20, "Klar til fart"),
			swim("Race pace", 4, 200, 60, "Del løbet korrekt"),
			swim("Sprint fra afsæt", 8, 25, 50, "Hurtigt men rent"),
			swim("Udsvømning", 4, 100, 15, "Let")
		]
	},
	{
		title: "Ben & undervand",
		focus: "Fart fra ben og effektiv streamline",
		duration: 65,
		intensity: "Moderat/hård",
		exercises: [
			swim("Benspark med plade", 8, 50, 25, "Stabil frekvens"),
			swim("Delfinbenspark på ryggen", 8, 25, 30, "Stram streamline"),
			swim("Streamline-benspark på ryggen", 6, 50, 25, "Høj hofte"),
			swim("Aerob crawl", 4, 200, 25, "Rolig afslutning")
		]
	},
	{
		title: "Aktiv restitution",
		focus: "Teknik, balance og let cirkulation",
		duration: 45,
		intensity: "Restitution",
		exercises: [
			swim("Indsvømning", 4, 100, 20, "Roligt"),
			swim("Sculling foran", 4, 50, 20, "Vandføling"),
			swim("6-1-6 sideskift", 4, 50, 20, "Kontrolleret rotation"),
			swim("Udsvømning", 4, 100, 15, "Let")
		]
	},
	{
		title: "Broken race",
		focus: "Konkurrencefart i opdelte blokke",
		duration: 80,
		intensity: "Race pace",
		exercises: [
			swim("Indsvømning", 5, 100, 20, "Progressivt"),
			swim("Race pace", 12, 50, 30, "Præcis fart"),
			swim("Tærskel crawl", 6, 100, 20, "Hold trykket"),
			swim("Udsvømning", 4, 50, 15, "Roligt")
		]
	},
	{
		title: "Tærskel 200",
		focus: "Robust fart og korte pauser",
		duration: 80,
		intensity: "Tærskel",
		exercises: [
			swim("Indsvømning", 4, 100, 20, "Find rytmen"),
			swim("Tærskel crawl", 6, 200, 25, "Ensartede splittider"),
			swim("Teknikcrawl med paddles", 6, 100, 30, "Fast greb"),
			swim("Udsvømning", 4, 50, 15, "Let")
		]
	},
	{
		title: "Fartreserve",
		focus: "Høj fart med bevaret teknik",
		duration: 65,
		intensity: "Hård",
		exercises: [
			swim("Indsvømning", 4, 100, 20, "Progressivt"),
			swim("Sprint fra afsæt", 12, 25, 45, "Maksimal kvalitet"),
			swim("Race pace", 8, 75, 40, "Kontrolleret høj fart"),
			swim("Udsvømning", 6, 50, 20, "God restitution")
		]
	},
	{
		title: "200-test",
		focus: "Test pacing, teknik og pulszone",
		duration: 65,
		intensity: "Test",
		exercises: [
			swim("Indsvømning", 6, 100, 20, "Kom gradvist op i fart"),
			swim("Race pace", 1, 200, 120, "Kontrolleret testløb"),
			swim("Aerob crawl", 6, 100, 20, "Aktiv restitution"),
			swim("Udsvømning", 4, 100, 15, "Meget roligt")
		]
	}
];
var sprintSessions = [
	{
		title: "Acceleration",
		focus: "Maksimal fart med fuld teknisk kontrol",
		duration: 60,
		intensity: "Sprint",
		exercises: [
			swim("Indsvømning", 4, 100, 20, "Progressivt"),
			swim("Sprint fra afsæt", 12, 25, 60, "Eksplosiv acceleration"),
			swim("Crawl fingertip drag", 4, 50, 25, "Afspænding"),
			swim("Udsvømning", 4, 50, 20, "Roligt")
		]
	},
	{
		title: "Start & undervand",
		focus: "Reaktion, streamline og breakout",
		duration: 55,
		intensity: "Eksplosiv",
		exercises: [
			swim("Startspring og undervand", 10, 15, 75, "Samme opsætning hver gang"),
			swim("Delfinbenspark på ryggen", 8, 25, 40, "Hurtige små bevægelser"),
			swim("Sprint fra afsæt", 8, 25, 60, "Fart gennem breakout"),
			swim("Udsvømning", 6, 50, 20, "Let")
		]
	},
	{
		title: "Ren fart",
		focus: "Højeste mulige fart med lange pauser",
		duration: 60,
		intensity: "Maksimal",
		exercises: [
			swim("Indsvømning", 5, 100, 20, "Klar til fart"),
			swim("Sprint fra afsæt", 16, 15, 75, "Stop før kvaliteten falder"),
			swim("Race pace", 6, 50, 60, "Konkurrencefrekvens"),
			swim("Udsvømning", 6, 50, 20, "Meget roligt")
		]
	},
	{
		title: "Speed endurance",
		focus: "Bevar fart gennem hele 50’eren",
		duration: 65,
		intensity: "Hård",
		exercises: [
			swim("Indsvømning", 4, 100, 20, "Progressivt"),
			swim("Race pace", 8, 50, 90, "Fuld kvalitet"),
			swim("Benspark med plade", 8, 25, 40, "Hurtige fødder"),
			swim("Udsvømning", 6, 50, 20, "Let")
		]
	},
	{
		title: "Vending & breakout",
		focus: "Hurtig retning og fart ud af væggen",
		duration: 55,
		intensity: "Teknik/fart",
		exercises: [
			swim("Vendingstræning", 12, 15, 45, "Stram rotation"),
			swim("Streamline-benspark på ryggen", 8, 25, 35, "Fast kropslinje"),
			swim("Sprint fra afsæt", 8, 25, 60, "Hurtigt breakout"),
			swim("Udsvømning", 4, 50, 20, "Roligt")
		]
	},
	{
		title: "Aktiv restitution",
		focus: "Afspænding og vandføling",
		duration: 40,
		intensity: "Restitution",
		exercises: [
			swim("Indsvømning", 4, 100, 20, "Meget roligt"),
			swim("Sculling foran", 4, 50, 20, "Bløde bevægelser"),
			swim("Enarmscrawl", 4, 50, 25, "Rolig rotation"),
			swim("Udsvømning", 4, 100, 15, "Afslappet")
		]
	},
	{
		title: "Power 25",
		focus: "Gentag eksplosive præstationer",
		duration: 60,
		intensity: "Sprint",
		exercises: [
			swim("Indsvømning", 5, 100, 20, "Progressivt"),
			swim("Sprint fra afsæt", 12, 25, 75, "Eksplosiv kvalitet"),
			swim("Startspring og undervand", 8, 15, 75, "Eksplosivt"),
			swim("Udsvømning", 6, 50, 20, "Let")
		]
	},
	{
		title: "Laktattolerance",
		focus: "Bevar mekanikken under høj belastning",
		duration: 65,
		intensity: "Meget hård",
		exercises: [
			swim("Indsvømning", 5, 100, 20, "God forberedelse"),
			swim("Race pace", 6, 75, 120, "Høj fart, fuld pause"),
			swim("Crawl med pull buoy", 4, 100, 35, "Find grebet igen"),
			swim("Udsvømning", 8, 50, 20, "Grundig restitution")
		]
	},
	{
		title: "Race skills",
		focus: "Sæt start, fart og vending sammen",
		duration: 60,
		intensity: "Race pace",
		exercises: [
			swim("Startspring og undervand", 6, 15, 75, "Konkurrenceopsætning"),
			swim("Race pace", 6, 50, 90, "Konkurrencefart"),
			swim("Vendingstræning", 8, 15, 45, "Hurtigt ud"),
			swim("Udsvømning", 6, 50, 20, "Let")
		]
	},
	{
		title: "50-test",
		focus: "Test start, topfart og teknisk holdbarhed",
		duration: 55,
		intensity: "Test",
		exercises: [
			swim("Indsvømning", 6, 100, 20, "Klar til test"),
			swim("Sprint fra afsæt", 4, 25, 90, "Aktivering"),
			swim("Race pace", 1, 50, 180, "Maksimalt testløb"),
			swim("Udsvømning", 8, 50, 20, "Grundig restitution")
		]
	}
];
var swimPlans = {
	long_distance: extendPlanToTwelveWeeks(makePlan("long_distance", longDistanceSessions)),
	middle_distance: extendPlanToTwelveWeeks(makePlan("middle_distance", middleDistanceSessions)),
	sprint: extendPlanToTwelveWeeks(makePlan("sprint", sprintSessions))
};
var defaultSwimProfile = "middle_distance";
var getTrainingPlan = (profile) => profile === "weightlifting" ? twoWeekPlan : [
	"long_distance",
	"middle_distance",
	"sprint",
	"recreational"
].includes(profile) ? getSwimmerStrengthPlan(profile) : buildGenericTrainingPlan(profile);
//#endregion
export { programTemplates as a, trainingProfileOptions as c, exerciseFocusTags as d, exerciseLibrary as f, buildTemplatePlan as i, countProgramSets as l, getTrainingPlan as n, sportProfiles as o, swimPlans as r, trainingProfileLabel as s, defaultSwimProfile as t, getWeekProgression as u };
