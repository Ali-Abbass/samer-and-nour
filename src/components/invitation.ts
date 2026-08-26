/** Fired on window when the intro finishes (or is skipped) — the hero
 *  entrance and the music player both listen for it. */
export const OPEN_EVENT = 'invitation:open';

/** sessionStorage flag: the invitation was already opened this session
 *  (e.g. before a language switch), so the intro doesn't replay. */
export const OPENED_KEY = 'invitation:opened';
