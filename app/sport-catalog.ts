export const sportProfiles = [
  { id: "weightlifting", label: "Vægtløftning", short: "VL", description: "Teknik, eksplosivitet og styrke i de olympiske løft.", tracksLoad: true, tracksDistance: false },
  { id: "long_distance", label: "Langdistance svømning", short: "SVØM L", description: "Landstyrke til stabil teknik og lange distancer.", tracksLoad: true, tracksDistance: true },
  { id: "middle_distance", label: "Mellemdistance svømning", short: "SVØM M", description: "Landstyrke, power og kapacitet til gentagen fart.", tracksLoad: true, tracksDistance: true },
  { id: "sprint", label: "Sprintsvømning", short: "SVØM S", description: "Eksplosiv landstyrke til start, vending og topfart.", tracksLoad: true, tracksDistance: true },
  { id: "recreational", label: "Motionist", short: "MOTION", description: "En enkel og progressiv introduktion til styrketræning.", tracksLoad: true, tracksDistance: false },
  { id: "athletics", label: "Atletik", short: "ATLETIK", description: "Styrke, acceleration, spring og robusthed til atletik.", tracksLoad: true, tracksDistance: true },
  { id: "golf", label: "Golf", short: "GOLF", description: "Rotation, stabilitet og kraftoverførsel til golf.", tracksLoad: true, tracksDistance: false },
  { id: "running", label: "Løb", short: "LØB", description: "Landstyrke og kapacitet til hurtigere og mere robust løb.", tracksLoad: true, tracksDistance: true },
  { id: "powerlifting", label: "Powerlifting", short: "PL", description: "Progression i squat, bænkpres og dødløft.", tracksLoad: true, tracksDistance: false },
  { id: "skiing", label: "Skisport", short: "SKI", description: "Benstyrke, balance og udholdenhed til skisport.", tracksLoad: true, tracksDistance: true },
  { id: "triathlon", label: "Triathlon", short: "TRI", description: "Supplerende styrke på tværs af svømning, cykling og løb.", tracksLoad: true, tracksDistance: true },
  { id: "ironman", label: "Ironman", short: "IRON", description: "Robusthed og styrkeudholdenhed til lange konkurrencer.", tracksLoad: true, tracksDistance: true },
  { id: "hyrox", label: "Hyrox", short: "HYROX", description: "Løbsøkonomi, stationsstyrke og arbejdskapacitet.", tracksLoad: true, tracksDistance: true },
  { id: "crossfit", label: "CrossFit", short: "CF", description: "Alsidig styrke, teknik og kondition til mixed modal træning.", tracksLoad: true, tracksDistance: true },
  { id: "cycling", label: "Cykling", short: "CYKEL", description: "Styrke og stabilitet til bedre kraft og position på cyklen.", tracksLoad: true, tracksDistance: true },
  { id: "american_football", label: "Amerikansk fodbold", short: "AF", description: "Acceleration, retningsskift og kontaktrobusthed.", tracksLoad: true, tracksDistance: true },
  { id: "football", label: "Fodbold", short: "FODBOLD", description: "Kondition, acceleration og robusthed gennem hele kampen.", tracksLoad: true, tracksDistance: true },
  { id: "handball", label: "Håndbold", short: "HÅNDBOLD", description: "Springkraft, retningsskift og skulderrobusthed.", tracksLoad: true, tracksDistance: true },
] as const;

export type TrainingProfile = (typeof sportProfiles)[number]["id"];
export type SportProfile = (typeof sportProfiles)[number];
export type SwimProfile = "long_distance" | "middle_distance" | "sprint";
export type StrengthProfile = SwimProfile | "recreational";
export type Difficulty = "Begynder" | "Øvet" | "Avanceret";
export type ContentVisibility = "athlete" | "coach_only";

export const trainingProfileOptions: Array<{ id: TrainingProfile; label: string; short: string; description: string }> = sportProfiles.map(({ id, label, short, description }) => ({ id, label, short, description }));
export const swimProfileOptions = sportProfiles.filter((profile): profile is Extract<SportProfile, { id: SwimProfile }> => ["long_distance", "middle_distance", "sprint"].includes(profile.id));
export const trainingProfileLabel = (profile: TrainingProfile | null | undefined) => sportProfiles.find((option) => option.id === profile)?.label ?? "Ikke valgt";
export const swimProfileLabel = trainingProfileLabel;
export const isTrainingProfile = (value: unknown): value is TrainingProfile => typeof value === "string" && sportProfiles.some((option) => option.id === value);
export const isSwimProfile = (value: unknown): value is SwimProfile => value === "long_distance" || value === "middle_distance" || value === "sprint";
export const getSportProfile = (profile: TrainingProfile) => sportProfiles.find((option) => option.id === profile)!;
