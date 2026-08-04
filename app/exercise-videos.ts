export type ExerciseVideo = {
  youtubeId: string;
  source: string;
  sourceUrl: string;
};

export const exerciseVideos: Record<string, ExerciseVideo> = {
  "Snatch": { youtubeId: "1Lv1IyigIUY", source: "Catalyst Athletics", sourceUrl: "https://www.catalystathletics.com/exercise/58/Snatch/" },
  "Clean & Jerk": { youtubeId: "bNCXgyosXlc", source: "Catalyst Athletics", sourceUrl: "https://www.catalystathletics.com/exercise/76/Clean-Jerk/" },
  "Front squat": { youtubeId: "Q1R0_CbgHpc", source: "Catalyst Athletics", sourceUrl: "https://www.catalystathletics.com/exercise/78/Front-Squat/" },
  "Power snatch": { youtubeId: "ydHHsju1-Nc", source: "Catalyst Athletics", sourceUrl: "https://www.catalystathletics.com/exercise/61/Power-Snatch/" },
  "Hang snatch": { youtubeId: "Php-RclQ1yU", source: "Catalyst Athletics", sourceUrl: "https://www.catalystathletics.com/exercise/63/Hang-Snatch/" },
  "Snatch pull": { youtubeId: "G1QygZ3Kd3w", source: "Catalyst Athletics", sourceUrl: "https://www.catalystathletics.com/exercise/97/Snatch-Pull/" },
  "Overhead squat": { youtubeId: "m_fvfJi94D8", source: "Catalyst Athletics", sourceUrl: "https://www.catalystathletics.com/exercise/79/Overhead-Squat/" },
  "Clean pull": { youtubeId: "xx8WkFrST2Y", source: "Catalyst Athletics", sourceUrl: "https://www.catalystathletics.com/exercise/98/Clean-Pull/" },
  "Back squat": { youtubeId: "Akd5xmZlsvg", source: "Catalyst Athletics", sourceUrl: "https://www.catalystathletics.com/exercise/77/Back-Squat/" },
  "Strict press": { youtubeId: "_cfNP_VXs_U", source: "Catalyst Athletics", sourceUrl: "https://www.catalystathletics.com/exercise/90/Press/" },
  "Romanian deadlift": { youtubeId: "_U9KjljQyd0", source: "Catalyst Athletics", sourceUrl: "https://www.catalystathletics.com/exercise/101/Romanian-Deadlift-RDL/" },
};

export const youtubeExerciseSearchUrl = (exerciseName: string) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(`${exerciseName} olympic weightlifting exercise demonstration`)}`;
