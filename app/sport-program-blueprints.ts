import type { TrainingProfile } from "./sport-catalog";

export type SportSessionBlueprint = {
  title: string;
  objective: string;
  duration: number;
  main: string[];
  assistance: string[];
  sportSpecific: string[];
};

export type SportProgramBlueprint = {
  principle: string;
  sessions: [SportSessionBlueprint, SportSessionBlueprint, SportSessionBlueprint];
};

const names = (value: string) => value.split("|");
const session = (title: string, objective: string, duration: number, main: string, assistance: string, sportSpecific: string): SportSessionBlueprint => ({
  title, objective, duration, main: names(main), assistance: names(assistance), sportSpecific: names(sportSpecific),
});

export const sportProgramBlueprints: Record<TrainingProfile, SportProgramBlueprint> = {
  weightlifting: {
    principle: "Konkurrenceløft trænes friskt; styrke og træk understøtter positionerne uden at overdøve teknikken.",
    sessions: [
      session("Snatch · teknik & hastighed", "Stabil startposition, tæt stangbane og hurtig modtagelse", 75, "Snatch|Power snatch|Hang snatch|Block snatch|Pause snatch|Snatch + overhead squat", "Snatch pull|Snatch deadlift|Snatch grip RDL|Overhead squat|Pendlay row|Pull-up", "Snatch balance|Tall snatch|No-foot snatch|Muscle snatch|Power snatch + overhead squat|Jerk-fodarbejde uden vægt"),
      session("Clean & jerk · kraft & timing", "Sammenhæng mellem vending, ben-drive og stabil lockout", 80, "Clean & Jerk|Power clean|Hang clean|Block clean|Clean & push jerk|Clean + front squat", "Clean pull|Clean deadlift|Front squat|Push press|Strict press|Pull-up", "Split jerk|Push jerk|Jerk from rack|Jerk balance|Pause jerk|Tall jerk"),
      session("Squat & trækkraft", "Benstyrke, positionsstyrke og robust overheadkapacitet", 70, "Front squat|Back squat|Pause front squat|Pause back squat|Clean deadlift|Snatch deadlift", "Romanian deadlift|Pendlay row|Strict press|Pull-up|Bulgarian split squat|Snatch grip RDL", "Snatch pull|Clean pull|Overhead squat|Jerk dip + drive|Snatch balance|Press in split"),
    ],
  },
  long_distance: {
    principle: "Lav træthed pr. sæt, høj skulderkvalitet og styrkeudholdenhed, der kan overføres til lange distancer.",
    sessions: [
      session("Trækkraft & skulderrobusthed", "Vedvarende lat-kraft og kontrolleret skulderbladsmekanik", 55, "Pull-up|Lat pulldown|Chest-supported dumbbell row|Single-arm cable pulldown|Seated cable row|Straight-arm pulldown", "Face pull|Prone Y-T-W|Serratus wall slide|Cable external rotation|Scapular pull-up|Band external rotation", "Swim bench freestyle pull|Band freestyle stroke|Isometric catch hold|Streamline lat pulldown|Prone swimmer|Single-arm row with rotation"),
      session("Benstyrke & kropslinje", "Ensidig benstyrke og stabil hofte til afsæt og strømlinet position", 55, "Trap bar deadlift|Front squat|Goblet squat|Romanian deadlift|Bulgarian split squat|Step-up", "Single-leg Romanian deadlift|Hip thrust|Copenhagen plank|Calf raise|Pallof press|Dead bug", "Streamline overhead hold|Banded hip-flexion march|Single-leg balance reach|Tall-kneeling cable lift|Band freestyle stroke|Prone swimmer"),
      session("Core & styrkeudholdenhed", "Antirotation, skulderudholdenhed og gentagelig kraft uden unødig muskelømhed", 50, "Half-kneeling landmine press|Single-arm cable row|Incline dumbbell bench press|Landmine row|Cable chest press|Goblet squat", "Pallof press|Side plank|Dead bug|Suitcase carry|Banded pull-apart|Scapular push-up", "Straight-arm pulldown|Isometric catch hold|Band freestyle stroke|Streamline overhead hold|Tall-kneeling cable chop|Single-arm row with rotation"),
    ],
  },
  middle_distance: {
    principle: "Styrke og power skal kunne gentages ved høj fart, mens skulderen forbliver stabil gennem hele trækket.",
    sessions: [
      session("Trækkraft & race-power", "Kraftfuldt træk og høj kvalitet i svømmespecifikke bevægelser", 60, "Pull-up|Lat pulldown|Chest-supported dumbbell row|Single-arm cable pulldown|Pendlay row|Straight-arm pulldown", "Face pull|Cable external rotation|Prone Y-T-W|Scapular pull-up|Pallof press|Dead bug", "Swim bench freestyle pull|Swim bench butterfly pull|Overhead medicine ball throw|Band freestyle stroke|Isometric catch hold|Single-arm row with rotation"),
      session("Underkropspower & afsæt", "Eksplosiv hofte- og benkraft til start, vending og acceleration", 60, "Trap bar deadlift|Front squat|Back squat|Romanian deadlift|Bulgarian split squat|Hip thrust", "Step-up|Single-leg Romanian deadlift|Copenhagen plank|Calf raise|Lateral lunge|Suitcase carry", "Box jump|Broad jump|Medicine ball slam|Overhead medicine ball throw|Streamline overhead hold|Banded hip-flexion march"),
      session("Skulderkapacitet & core", "Gentagelig overkropskraft med kontrolleret rotation og kropslinje", 55, "Half-kneeling landmine press|Incline dumbbell bench press|Landmine row|Single-arm cable row|Dips|Push-up", "Serratus wall slide|Scapular push-up|Band external rotation|Side plank|Pallof press|Dead bug", "Rotational medicine ball throw|Swim bench butterfly pull|Band butterfly stroke|Tall-kneeling cable chop|Streamline overhead hold|Isometric catch hold"),
    ],
  },
  sprint: {
    principle: "Få eksplosive gentagelser, fulde pauser og høj bevægelseshastighed prioriteres over udmattelse.",
    sessions: [
      session("Startstyrke & benpower", "Maksimal kraftudvikling til startblok, afsæt og undervandsfase", 60, "Trap bar deadlift|Front squat|Back squat|Hip thrust|Bulgarian split squat|Romanian deadlift", "Step-up|Single-leg Romanian deadlift|Copenhagen plank|Calf raise|Suitcase carry|Pallof press", "Box jump|Broad jump|Depth jump|Jump squat|Overhead medicine ball throw|Streamline overhead hold"),
      session("Eksplosivt træk & pres", "Høj overkropskraft med stabil skulder og hurtig kraftoverførsel", 60, "Pull-up|Pendlay row|Lat pulldown|Dips|Half-kneeling landmine press|Incline dumbbell bench press", "Face pull|Prone Y-T-W|Cable external rotation|Scapular pull-up|Serratus wall slide|Dead bug", "Swim bench freestyle pull|Swim bench butterfly pull|Plyometric push-up|Medicine ball chest pass|Band butterfly stroke|Isometric catch hold"),
      session("Rotation, vending & robusthed", "Eksplosiv helkropskraft og kontrol omkring core og skulder", 55, "Landmine row|Single-arm cable row|Push press|Goblet squat|Cable chest press|Romanian deadlift", "Pallof press|Side plank|Banded pull-apart|Scapular push-up|Single-leg balance reach|Suitcase carry", "Rotational medicine ball throw|Medicine ball scoop toss|Medicine ball slam|Single-arm row with rotation|Streamline overhead hold|Tall-kneeling cable chop"),
    ],
  },
  recreational: {
    principle: "Enkle bevægelser, tydelig progression og god teknik skaber kontinuitet før høj belastning.",
    sessions: [
      session("Squat, pres & træk", "Tryg helkropsstyrke i de grundlæggende bevægemønstre", 45, "Goblet squat|Leg press|Front squat|Push-up|Incline dumbbell bench press|Seated cable row", "Lat pulldown|Glute bridge|Dead bug|Calf raise|Face pull|Banded pull-apart", "Medicine ball chest pass|A-skip|Cross-crawl|Single-leg balance reach|Bear crawl|Banded lateral walk"),
      session("Hofte, ryg & ensidig kontrol", "Bagkæde, balance og styrke fra side til side", 45, "Trap bar deadlift|Romanian deadlift|Hip thrust|Step-up|Reverse lunge|Chest-supported dumbbell row", "Single-leg Romanian deadlift|Pallof press|Side plank|Suitcase carry|Band external rotation|Calf raise", "Broad jump|Banded hip-flexion march|Single-leg balance reach|Cross-crawl|Bear crawl|Lateral ladder drill"),
      session("Helkrop & bevægelseskvalitet", "Gentagelige løft og koordination med overskud", 50, "Leg press|Goblet squat|Half-kneeling landmine press|Lat pulldown|Cable chest press|Landmine row", "Glute bridge|Bird dog|Dead bug|Face pull|Banded lateral walk|Suitcase carry", "Medicine ball slam|A-skip|Bear crawl|Cross-crawl|Single-leg balance reach|Broad jump"),
    ],
  },
  athletics: {
    principle: "Maksimal kraft, elastisk power og sprintmekanik udvikles friskt med fulde pauser.",
    sessions: [
      session("Acceleration & maksimal kraft", "Horisontal kraft og stærke positioner i de første skridt", 65, "Trap bar deadlift|Front squat|Back squat|Romanian deadlift|Hip thrust|Bulgarian split squat", "Nordic hamstring curl|Step-up|Calf raise|Copenhagen plank|Pendlay row|Pallof press", "Broad jump|A-skip|Medicine ball scoop toss|Banded hip-flexion march|Pogo jumps|Sled push"),
      session("Spring & reaktiv power", "Kort kontakttid, elastisk styrke og kontrollerede landinger", 60, "Front squat|Trap bar deadlift|Push press|Bulgarian split squat|Romanian deadlift|Hip thrust", "Single-leg Romanian deadlift|Calf raise|Copenhagen plank|Lateral lunge|Suitcase carry|Dead bug", "Depth jump|Pogo jumps|Box jump|Lateral skater jump|Jump squat|Medicine ball chest pass"),
      session("Kast, ensidig styrke & robusthed", "Rotationskraft, unilateral kontrol og vævskapacitet", 60, "Push press|Half-kneeling landmine press|Pull-up|Pendlay row|Front squat|Romanian deadlift", "Nordic hamstring curl|Single-leg calf raise|Face pull|Pallof press|Side plank|Step-up", "Rotational medicine ball throw|Medicine ball scoop toss|Overhead medicine ball throw|Carioca drill|Lateral ladder drill|Single-leg balance reach"),
    ],
  },
  golf: {
    principle: "Kraften bygges fra jorden gennem hofte og thorax, mens lænd og skulder holdes robuste.",
    sessions: [
      session("Underkropskraft & hoftekontrol", "Stabilt fodtryk og ensidig hoftekraft gennem hele svinget", 55, "Trap bar deadlift|Front squat|Goblet squat|Bulgarian split squat|Romanian deadlift|Hip thrust", "Single-leg Romanian deadlift|Reverse lunge|Suitcase carry|Side plank|Bird dog|Face pull", "Hip airplane|Single-leg balance reach|Cable rotation|Medicine ball scoop toss|Half-kneeling anti-rotation hold|Landmine rotation"),
      session("Rotationspower & slagkraft", "Hurtig kraftoverførsel fra ben til overkrop uden tab af balance", 55, "Half-kneeling landmine press|Landmine row|Cable chest press|Push press|Goblet squat|Romanian deadlift", "Pallof press|Tall-kneeling cable chop|Tall-kneeling cable lift|Face pull|Dead bug|Split squat", "Rotational medicine ball throw|Medicine ball scoop toss|Landmine rotation|Cable rotation|Medicine ball slam|Hip airplane"),
      session("Ryg, core & holdbarhed", "Thorakal kontrol, antirotation og kapacitet til mange slag", 50, "Chest-supported dumbbell row|Single-arm cable row|Half-kneeling landmine press|Split squat|Hip thrust|Cable chest press", "Face pull|Band external rotation|Bird dog|Side plank|Suitcase carry|Dead bug", "Tall-kneeling cable chop|Tall-kneeling cable lift|Half-kneeling anti-rotation hold|Cable rotation|Hip airplane|Single-leg balance reach"),
    ],
  },
  running: {
    principle: "Høj kraft med lav volumen, stærke lægge og ensidig kontrol forbedrer løbeøkonomi uden unødig træthed.",
    sessions: [
      session("Maksimal benstyrke", "Høj kraft pr. skridt med lav samlet styrketræningsvolumen", 55, "Trap bar deadlift|Front squat|Back squat|Romanian deadlift|Hip thrust|Bulgarian split squat", "Nordic hamstring curl|Calf raise|Step-up|Copenhagen plank|Pallof press|Chest-supported dumbbell row", "A-skip|Banded hip-flexion march|Pogo jumps|Single-leg calf raise|Single-leg balance reach|Broad jump"),
      session("Elastisk styrke & lægkapacitet", "Kort jordkontakt og robusthed i fod, ankel og læg", 50, "Bulgarian split squat|Step-up|Romanian deadlift|Goblet squat|Single-leg Romanian deadlift|Hip thrust", "Calf raise|Nordic hamstring curl|Copenhagen plank|Banded lateral walk|Dead bug|Suitcase carry", "Pogo jumps|A-skip|Lateral skater jump|Single-leg calf raise|Banded hip-flexion march|Broad jump"),
      session("Unilateral robusthed & core", "Stabil kraftoverførsel gennem hofte, knæ og bækken", 50, "Step-up|Reverse lunge|Bulgarian split squat|Single-leg Romanian deadlift|Goblet squat|Trap bar deadlift", "Copenhagen plank|Pallof press|Side plank|Calf raise|Nordic hamstring curl|Chest-supported dumbbell row", "Single-leg balance reach|Banded lateral walk|Banded hip-flexion march|A-skip|Carioca drill|Lateral skater jump"),
    ],
  },
  powerlifting: {
    principle: "Konkurrenceløftene får førsteprioritet; variationer løser svage positioner, og assistance doseres efter restitution.",
    sessions: [
      session("Squat & bænk · volumen", "Teknisk ensartede konkurrenceløft og opbygning af arbejdsvolumen", 80, "Back squat|Pause back squat|Tempo back squat|Bænkpres|Incline dumbbell bench press|Front squat", "Romanian deadlift|Pendlay row|Bulgarian split squat|Face pull|Ab wheel rollout|Lat pulldown", "Back squat|Bænkpres|Pause back squat|Tempo back squat|Front squat|Dips"),
      session("Bænkpres & overkrop", "Presstyrke, øvre ryg og stabil konkurrenceopsætning", 70, "Bænkpres|Incline dumbbell bench press|Dips|Strict press|Close-grip bench press|Spoto press", "Pendlay row|Pull-up|Lat pulldown|Face pull|Chest-supported dumbbell row|Ab wheel rollout", "Bænkpres|Dips|Incline dumbbell bench press|Pause back squat|Tempo back squat|Front squat"),
      session("Dødløft & tung squat", "Startstyrke fra gulvet, bagkæde og tunge konkurrencerelevante løft", 80, "Dødløft|Romanian deadlift|Back squat|Pause back squat|Front squat|Trap bar deadlift", "Pendlay row|Hip thrust|Pull-up|Lat pulldown|Bulgarian split squat|Ab wheel rollout", "Dødløft|Back squat|Pause back squat|Tempo back squat|Romanian deadlift|Bænkpres"),
    ],
  },
  skiing: {
    principle: "Eccentrisk benstyrke, enbensbalance og stavkraft bygges uden at fjerne kvalitet fra udholdenhedspassene.",
    sessions: [
      session("Benstyrke & excentrisk kontrol", "Stærke lår og hofter til lange nedkørsler og gentagne afsæt", 60, "Front squat|Back squat|Trap bar deadlift|Romanian deadlift|Bulgarian split squat|Leg press", "Nordic hamstring curl|Calf raise|Step-up|Copenhagen plank|Hip thrust|Pallof press", "Lateral skater jump|Jump squat|Banded lateral walk|Single-leg balance reach|Lateral lunge|Pogo jumps"),
      session("Enbensbalance & sidekraft", "Stabil knælinje og kraft i skøjt og sving", 55, "Bulgarian split squat|Step-up|Single-leg Romanian deadlift|Reverse lunge|Lateral lunge|Goblet squat", "Calf raise|Copenhagen plank|Suitcase carry|Pallof press|Nordic hamstring curl|Dead bug", "Lateral skater jump|Single-leg balance reach|Banded lateral walk|Jump squat|Carioca drill|Hip airplane"),
      session("Stavkraft & core", "Stærkt træk, hoftedrive og vedvarende corekontrol", 55, "Pull-up|Lat pulldown|Pendlay row|Chest-supported dumbbell row|Push press|Landmine row", "Straight-arm pulldown|Pallof press|Side plank|Dead bug|Suitcase carry|Face pull", "Medicine ball slam|Overhead medicine ball throw|Tall-kneeling cable chop|Banded hip-flexion march|Bear crawl|Single-arm farmer carry"),
    ],
  },
  triathlon: {
    principle: "Styrken skal forbedre økonomi i alle tre discipliner med lille restitutionsomkostning.",
    sessions: [
      session("Benstyrke & løbeøkonomi", "Høj kraft pr. pedaltråd og løbeskridt med lav volumen", 55, "Trap bar deadlift|Front squat|Romanian deadlift|Bulgarian split squat|Hip thrust|Step-up", "Calf raise|Nordic hamstring curl|Copenhagen plank|Pallof press|Single-leg Romanian deadlift|Dead bug", "A-skip|Pogo jumps|Banded hip-flexion march|Single-leg calf raise|Banded lateral walk|Single-leg balance reach"),
      session("Svømmetrækkraft & skulder", "Effektivt træk og robust skulder uden overflødig hypertrofi", 50, "Pull-up|Lat pulldown|Chest-supported dumbbell row|Straight-arm pulldown|Single-arm cable pulldown|Landmine row", "Face pull|Prone Y-T-W|Serratus wall slide|Pallof press|Dead bug|Band external rotation", "Swim bench freestyle pull|Band freestyle stroke|Streamline lat pulldown|Isometric catch hold|Prone swimmer|Scapular pull-up"),
      session("Unilateral robusthed & position", "Hofte-, læg- og corekontrol gennem lange træningsuger", 50, "Step-up|Single-leg Romanian deadlift|Reverse lunge|Goblet squat|Half-kneeling landmine press|Chest-supported dumbbell row", "Copenhagen plank|Single-leg calf raise|Pallof press|Suitcase carry|Banded lateral walk|Dead bug", "Hip airplane|Banded hip-flexion march|A-skip|Straight-arm pulldown|Band freestyle stroke|Single-leg balance reach"),
    ],
  },
  ironman: {
    principle: "Robusthed og bevægelsesøkonomi prioriteres; styrketræningen må aldrig kompromittere de lange nøglepas.",
    sessions: [
      session("Helkropsstyrke · lav træthed", "Vedligehold kraft og muskelkapacitet gennem høj udholdenhedsvolumen", 50, "Trap bar deadlift|Front squat|Romanian deadlift|Goblet squat|Pull-up|Chest-supported dumbbell row", "Step-up|Calf raise|Pallof press|Face pull|Dead bug|Hip thrust", "Banded hip-flexion march|Straight-arm pulldown|Band freestyle stroke|Single-leg calf raise|Banded lateral walk|Hip airplane"),
      session("Ensidig udholdenhed & core", "Stabile hofter, knæ og bækken når trætheden stiger", 45, "Step-up|Reverse lunge|Single-leg Romanian deadlift|Bulgarian split squat|Half-kneeling landmine press|Landmine row", "Copenhagen plank|Side plank|Single-leg calf raise|Suitcase carry|Dead bug|Face pull", "Banded lateral walk|Banded hip-flexion march|Single-leg balance reach|Hip airplane|Pallof press|Band freestyle stroke"),
      session("Skulder, ryg & kropslinje", "Bevar svømmetrækkraft og aero-position gennem lange blokke", 45, "Lat pulldown|Chest-supported dumbbell row|Straight-arm pulldown|Single-arm cable row|Half-kneeling landmine press|Goblet squat", "Prone Y-T-W|Serratus wall slide|Band external rotation|Pallof press|Dead bug|Bird dog", "Band freestyle stroke|Isometric catch hold|Streamline overhead hold|Banded hip-flexion march|Hip airplane|Single-leg calf raise"),
    ],
  },
  hyrox: {
    principle: "Løbeøkonomi, stationsstyrke og transitionskapacitet trænes særskilt, før de kombineres under træthed.",
    sessions: [
      session("Maksimal styrke & løbeøkonomi", "Stærke ben og bagkæde med lav nok volumen til kvalitetsløb", 65, "Trap bar deadlift|Front squat|Back squat|Romanian deadlift|Bulgarian split squat|Hip thrust", "Nordic hamstring curl|Calf raise|Copenhagen plank|Pull-up|Pallof press|Chest-supported dumbbell row", "Sled push|Sled pull|A-skip|Pogo jumps|Banded hip-flexion march|Single-leg calf raise"),
      session("Stationskraft & teknik", "Effektiv bevægelse i slæde, carry, lunges og wall balls", 65, "Front squat|Trap bar deadlift|Push press|Goblet squat|Romanian deadlift|Pull-up", "Suitcase carry|Step-up|Copenhagen plank|Face pull|Dead bug|Calf raise", "Sled push|Sled pull|Farmers carry|Sandbag walking lunges|Wall balls|Burpee broad jumps"),
      session("Styrkeudholdenhed & robusthed", "Gentagelig helkropskraft uden teknisk kollaps", 60, "Goblet squat|Dumbbell shoulder press|Landmine row|Romanian deadlift|Step-up|Half-kneeling landmine press", "Nordic hamstring curl|Pallof press|Face pull|Calf raise|Side plank|Single-leg Romanian deadlift", "Kettlebell swing|Dumbbell thruster|Wall balls|Farmers carry|Burpee broad jumps|Sandbag walking lunges"),
    ],
  },
  crossfit: {
    principle: "Teknik og maksimal styrke udvikles før intensitet; mixed-modal arbejde må ikke skjule svage bevægelser.",
    sessions: [
      session("Olympiske løft & squat", "Teknisk power i vægtløftning og stærke modtagepositioner", 70, "Snatch|Power snatch|Clean & Jerk|Power clean|Front squat|Back squat", "Snatch pull|Clean pull|Romanian deadlift|Pendlay row|Pull-up|Overhead squat", "Hang snatch|Hang clean|Push jerk|Kettlebell swing|Box jump|Jerk-fodarbejde uden vægt"),
      session("Pres, træk & gymnastik", "Strikt styrke som base for sikker gymnastisk volumen", 65, "Strict press|Push press|Pull-up|Dips|Bænkpres|Pendlay row", "Face pull|Lat pulldown|Pallof press|Dead bug|Chest-supported dumbbell row|Half-kneeling landmine press", "Toes-to-bar|Handstand push-up|Plyometric push-up|Medicine ball chest pass|Bear crawl|Hollow body hold"),
      session("Bagkæde & mixed-modal støtte", "Hoftepower, carry og styrkeudholdenhed med bevaret teknik", 65, "Dødløft|Romanian deadlift|Trap bar deadlift|Front squat|Push press|Pull-up", "Bulgarian split squat|Copenhagen plank|Face pull|Suitcase carry|Ab wheel rollout|Calf raise", "Kettlebell swing|Dumbbell thruster|Wall balls|Farmers carry|Burpee broad jumps|Sandbag walking lunges"),
    ],
  },
  cycling: {
    principle: "Maksimal benstyrke, bækkenkontrol og stabil aero-position udvikles uden unødig ømhed.",
    sessions: [
      session("Maksimal benstyrke", "Mere kraft pr. pedaltråd med kontrolleret styrkevolumen", 60, "Front squat|Back squat|Trap bar deadlift|Romanian deadlift|Leg press|Hip thrust", "Nordic hamstring curl|Calf raise|Copenhagen plank|Pallof press|Chest-supported dumbbell row|Dead bug", "Single-leg squat to box|Banded hip-flexion march|Single-leg calf raise|Banded lateral walk|Hip airplane|Single-leg balance reach"),
      session("Unilateral kraft & knækontrol", "Udjævn kraftforskelle og stabiliser hofte og knæ", 55, "Bulgarian split squat|Step-up|Single-leg Romanian deadlift|Reverse lunge|Goblet squat|Hip thrust", "Calf raise|Copenhagen plank|Suitcase carry|Pallof press|Nordic hamstring curl|Face pull", "Single-leg squat to box|Banded lateral walk|Banded hip-flexion march|Hip airplane|Single-leg calf raise|Single-leg balance reach"),
      session("Core, ryg & position", "Bevar bækken- og skulderposition gennem lange perioder på cyklen", 50, "Chest-supported dumbbell row|Half-kneeling landmine press|Lat pulldown|Landmine row|Goblet squat|Romanian deadlift", "Pallof press|Dead bug|Bird dog|Side plank|Face pull|Suitcase carry", "Banded hip-flexion march|Hip airplane|Banded lateral walk|Single-leg balance reach|Copenhagen plank|Single-leg calf raise"),
    ],
  },
  american_football: {
    principle: "Acceleration, positionsspecifik kraft og kontaktrobusthed bygges med fulde pauser og høj kvalitet.",
    sessions: [
      session("Acceleration & underkropskraft", "Eksplosivt første skridt og høj horisontal kraft", 70, "Trap bar deadlift|Front squat|Back squat|Hip thrust|Romanian deadlift|Bulgarian split squat", "Nordic hamstring curl|Calf raise|Copenhagen plank|Step-up|Pendlay row|Pallof press", "Sled push|Broad jump|10-yard sprint|Medicine ball scoop toss|A-skip|Pogo jumps"),
      session("Overkropskraft & kontakt", "Stærkt pres, træk, greb og stabil skulder i kontakt", 65, "Bænkpres|Push press|Pull-up|Pendlay row|Dips|Incline dumbbell bench press", "Face pull|Farmer's walk|Half-kneeling landmine press|Pallof press|Landmine row|Band external rotation", "Sled pull|Plyometric push-up|Medicine ball chest pass|Farmers carry|Bear crawl|Single-arm farmer carry"),
      session("Retningsskift & ensidig styrke", "Bremsning, lateral kraft og stabil re-acceleration", 65, "Bulgarian split squat|Step-up|Front squat|Romanian deadlift|Lateral lunge|Hip thrust", "Nordic hamstring curl|Copenhagen plank|Calf raise|Suitcase carry|Face pull|Dead bug", "Lateral skater jump|Depth jump|Lateral ladder drill|Carioca drill|Broad jump|Single-leg balance reach"),
    ],
  },
  football: {
    principle: "Styrkeprogrammet understøtter acceleration og kampkapacitet med særlig beskyttelse af baglår, lyske og læg.",
    sessions: [
      session("Benstyrke & baglårsrobusthed", "Høj underkropskraft og stærke baglår gennem hele kampen", 60, "Trap bar deadlift|Front squat|Back squat|Romanian deadlift|Hip thrust|Bulgarian split squat", "Nordic hamstring curl|Copenhagen plank|Calf raise|Step-up|Pallof press|Chest-supported dumbbell row", "A-skip|Pogo jumps|Broad jump|Banded hip-flexion march|Single-leg calf raise|Banded lateral walk"),
      session("Acceleration & reaktiv power", "Første skridt, kort jordkontakt og kontrollerede landinger", 55, "Front squat|Trap bar deadlift|Bulgarian split squat|Push press|Hip thrust|Romanian deadlift", "Nordic hamstring curl|Calf raise|Copenhagen plank|Face pull|Dead bug|Step-up", "Depth jump|Lateral skater jump|Pogo jumps|Broad jump|A-skip|Lateral ladder drill"),
      session("Retningsskift & unilateral kontrol", "Bremsestyrke, sidekraft og stabilitet i hofte og lyske", 55, "Bulgarian split squat|Step-up|Lateral lunge|Single-leg Romanian deadlift|Reverse lunge|Goblet squat", "Copenhagen plank|Nordic hamstring curl|Single-leg calf raise|Pallof press|Suitcase carry|Face pull", "Carioca drill|Lateral ladder drill|Lateral skater jump|Single-leg balance reach|Banded lateral walk|Pogo jumps"),
    ],
  },
  handball: {
    principle: "Springkraft, bremsestyrke og kastets kraftkæde trænes sammen med konsekvent skulderrobusthed.",
    sessions: [
      session("Springkraft & benstyrke", "Høj vertikal kraft og kontrolleret landing i gentagne spring", 60, "Front squat|Back squat|Trap bar deadlift|Bulgarian split squat|Hip thrust|Romanian deadlift", "Nordic hamstring curl|Copenhagen plank|Calf raise|Step-up|Pallof press|Face pull", "Box jump|Depth jump|Pogo jumps|Lateral skater jump|Jump squat|Broad jump"),
      session("Kastestyrke & skulderrobusthed", "Kraft fra ben og rotation gennem en stabil skulder", 60, "Push press|Half-kneeling landmine press|Pull-up|Pendlay row|Incline dumbbell bench press|Landmine row|Bænkpres|Dips|Cable chest press|Push-up|Single-arm dumbbell bench press", "Face pull|Band external rotation|Cable external rotation|Pallof press|Serratus wall slide|Dead bug", "Overhead medicine ball throw|Rotational medicine ball throw|Medicine ball chest pass|Medicine ball scoop toss|Landmine rotation|Plyometric push-up"),
      session("Retningsskift & ensidig kontrol", "Bremsning, lateral acceleration og robusthed i knæ og lyske", 55, "Bulgarian split squat|Step-up|Lateral lunge|Single-leg Romanian deadlift|Front squat|Hip thrust", "Copenhagen plank|Nordic hamstring curl|Calf raise|Suitcase carry|Face pull|Pallof press", "Lateral skater jump|Carioca drill|Lateral ladder drill|Single-leg balance reach|Pogo jumps|Banded lateral walk"),
    ],
  },
};

export type ConditioningSessionBlueprint = {
  title: string;
  objective: string;
  keywords: string[];
  zone: string;
};

const conditioning = (title: string, objective: string, keywords: string, zone: string): ConditioningSessionBlueprint => ({ title, objective, keywords: names(keywords), zone });

export const conditioningBlueprints: Partial<Record<TrainingProfile, [ConditioningSessionBlueprint, ConditioningSessionBlueprint, ConditioningSessionBlueprint]>> = {
  long_distance: [conditioning("Teknik & aerob base", "Stabil teknik ved lav metabolisk belastning", "teknik|aerob|indsvømning|crawl|sculling", "Pulszone 2"), conditioning("Tærskel & tempo", "Jævne splittider tæt på bæredygtig tærskel", "tærskel|tempo|2500", "Pulszone 3–4"), conditioning("Lang specifik udholdenhed", "Pacing og teknisk holdbarhed over længere serier", "aerob crawl|pull buoy|udholdenhed|lang", "Pulszone 2–3")],
  middle_distance: [conditioning("Aerob støtte & teknik", "Bevar effektiv mekanik mellem fartpassene", "aerob|teknik|crawl|sculling", "Pulszone 2–3"), conditioning("Tærskelkapacitet", "Gentag høj fart med kontrollerede pauser", "tærskel|interval|3000", "Pulszone 3–4"), conditioning("Race pace & afslutning", "Præcis konkurrencefart uden teknisk fald", "race pace|sprint|vending", "Pulszone 4–5")],
  sprint: [conditioning("Start, vending & undervand", "Eksplosive færdigheder med fuld kvalitet", "start|vending|undervand", "Pulszone 2–4"), conditioning("Topfart", "Maksimal fart med lange pauser", "sprint|race pace|acceleration", "Pulszone 4–5"), conditioning("Speed endurance", "Bevar fart gennem hele konkurrencedistancen", "race pace|tærskel|butterfly", "Pulszone 4–5")],
  athletics: [conditioning("Acceleration", "Første skridt og horisontal kraft", "acceleration|10-yard|20 m|bakke", "Pulszone 3–5"), conditioning("Fart & retningsskift", "Høj løbehastighed med fuld bevægelseskvalitet", "sprint|shuttle|retningsskift", "Pulszone 4–5"), conditioning("Tempo & kapacitet", "Aerob støtte uden at sløve power", "tempo|roligt|restitution", "Pulszone 2–3")],
  running: [conditioning("Rolig base & teknik", "Byg volumen med stabil løbeøkonomi", "roligt|aerob|restitution", "Pulszone 2"), conditioning("Tærskel", "Flyt den bæredygtige fart med kontrollerede intervaller", "tærskel|bakke|3000", "Pulszone 3–4"), conditioning("10 km-fart", "Præcis målfart og pacing", "10 km|progressivt|interval", "Pulszone 4")],
  skiing: [conditioning("Aerob skikapacitet", "Teknisk rytme og langvarigt arbejde", "ski|dobbeltstav|aerob", "Pulszone 2–3"), conditioning("Tærskel & stavkraft", "Vedvarende effekt gennem core og overkrop", "skierg|dobbeltstav|tærskel", "Pulszone 3–4"), conditioning("Konkurrenceintervaller", "Gentag høj fart med stabil teknik", "interval|500 m|1000 m", "Pulszone 4–5")],
  triathlon: [conditioning("Svømning", "Teknik og aerob vandkapacitet", "crawl|svøm|sculling|pull buoy", "Pulszone 2–3"), conditioning("Cykling", "Kadence, tærskel og trådøkonomi", "cykel|kadence|bakke", "Pulszone 2–4"), conditioning("Løb & brick", "Stabil løberytme efter cykling", "brick|løb|tærskel|10 km", "Pulszone 3–4")],
  ironman: [conditioning("Lang aerob base", "Bæredygtig intensitet og energiøkonomi", "aerob|lang|roligt", "Pulszone 2"), conditioning("Race pace & brick", "Ernæring, pacing og disciplineret skifte", "brick|race|tærskel", "Pulszone 2–3"), conditioning("Teknik & restitution", "Bevar bevægelseskvalitet under høj samlet volumen", "restitution|kadence|teknik|crawl", "Pulszone 1–2")],
  hyrox: [conditioning("Løbeøkonomi", "Stabil konkurrencefart mellem stationerne", "hyrox løb|løbeinterval|roligt", "Pulszone 3–4"), conditioning("SkiErg & roning", "Kontrollerede splits og effektiv helkropsrytme", "skierg|romaskine", "Pulszone 3–4"), conditioning("Kompromitteret løb", "Genfind rytmen efter høj lokal belastning", "bakke|tærskel|restitution", "Pulszone 3–4")],
  crossfit: [conditioning("Roning", "Jævn pacing og effektiv trækrytme", "romaskine|roning", "Pulszone 3–4"), conditioning("SkiErg", "Hofte- og stavkraft med kontrolleret split", "skierg|ski", "Pulszone 3–4"), conditioning("Aerob engine", "Sammenhængende arbejde uden teknisk kollaps", "roligt|aerob|interval", "Pulszone 2–4")],
  cycling: [conditioning("Aerob base & kadence", "Stabilt tråd og lav metabolisk pris", "aerob|kadence|restitution", "Pulszone 2"), conditioning("Tærskel & bakke", "Vedvarende effekt med rolig overkrop", "tærskel|bakke", "Pulszone 3–4"), conditioning("Sprintkraft", "Høj topkraft med fuld pause", "sprint|250 m", "Pulszone 4–5")],
  american_football: [conditioning("10-yard acceleration", "Eksplosivt første skridt med fuld pause", "10-yard|acceleration|20 m", "Pulszone 3–5"), conditioning("Retningsskift", "Bremsning og re-acceleration i kamprelevante vinkler", "5-10-5|retningsskift|shuttle", "Pulszone 4–5"), conditioning("Gentagen sprint", "Bevar sprintkvalitet gennem gentagne plays", "repeated|kamp|tempo", "Pulszone 3–5")],
  football: [conditioning("Acceleration & retningsskift", "Korte kamprelevante aktioner med høj kvalitet", "acceleration|retningsskift|5-10-5", "Pulszone 3–5"), conditioning("Gentagen sprint", "Gentag høj fart med begrænset farttab", "repeated|suicide|kampintervaller", "Pulszone 4–5"), conditioning("Aerob kampkapacitet", "Restituer hurtigere mellem intense aktioner", "tempo|roligt|restitution", "Pulszone 2–3")],
  handball: [conditioning("Acceleration & bremsning", "Korte fremadrettede og laterale aktioner", "acceleration|retningsskift|5-10-5", "Pulszone 3–5"), conditioning("Gentagen sprint", "Bevar kvalitet gennem gentagne kontrafaser", "repeated|suicide|kampintervaller", "Pulszone 4–5"), conditioning("Aerob restitution", "Bedre restitution mellem dueller og spring", "tempo|roligt|restitution", "Pulszone 2–3")],
};
