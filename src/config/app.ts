export const DESCRIPTION_MAX = 5000;
export const TIMEZONE = "America/Bahia";
export const PAGE_SIZE = 15;
export const SESSION_DAYS_MAX_HOURS = 8;
export const allowAnonymous = () => process.env.ALLOW_ANONYMOUS !== "false";
export const allowRatingComments = () => process.env.ALLOW_RATING_COMMENTS === "true";

export const TYPE_LABEL = { COMPLAINT: "Reclamação", SUGGESTION: "Sugestão", PRAISE: "Elogio" } as const;
export const STATUS_LABEL = {
  RECEIVED: "Recebida",
  IN_REVIEW: "Em análise",
  IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluída",
} as const;
export const SCORE_LABEL: Record<number, string> = {
  1: "Muito insatisfeito", 2: "Insatisfeito", 3: "Regular", 4: "Satisfeito", 5: "Muito satisfeito",
};
export const CONFIRMATION_MESSAGE = {
  COMPLAINT: "Sua reclamação foi registrada e será encaminhada para análise.",
  SUGGESTION: "Obrigado pela sua sugestão. Ela contribui para a melhoria dos nossos serviços.",
  PRAISE: "Obrigado pelo seu elogio. Reconhecemos o valor do seu retorno sobre o atendimento prestado.",
} as const;
