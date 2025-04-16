
import { KeywordCollection, KeywordCollectionWithPhrases } from './types';

// Keywords for different intent types
export const generalQuestionKeywords: KeywordCollection = {
  keywords: [
    'what', 'how', 'why', 'when', 'where', 'who', 'explain', 'tell me about',
    'information', 'help me understand', 'describe', 'details', 'question',
    'meaning', 'define', 'difference', 'compare', 'example'
  ]
};

export const taskCreationKeywords: KeywordCollectionWithPhrases = {
  keywords: [
    'create task', 'add task', 'new task', 'set reminder', 'remind me',
    'schedule', 'todo', 'to-do', 'to do', 'plan', 'appointment', 'meeting',
    'organize', 'set up', 'arrange', 'deadline', 'priority', 'objective',
    'goal', 'target', 'remember to', 'don\'t forget', 'important to'
  ],
  contextualPhrases: [
    'i need to', 'we need to', 'have to', 'must', 'should', 'tomorrow',
    'next week', 'in two days', 'on monday', 'at 5pm', 'by friday',
    'this weekend', 'monthly', 'yearly', 'annually', 'every day',
    'every morning', 'every evening', 'later today', 'in the morning'
  ]
};

export const imageGenerationKeywords: KeywordCollectionWithPhrases = {
  keywords: [
    'generate image', 'create image', 'make image', 'draw', 'picture',
    'visual', 'illustration', 'artwork', 'photo', 'photograph', 'design',
    'graphic', 'generate a picture', 'create a picture', 'show me a',
    'visualize', 'render', 'create a visual', 'make a drawing', 'image of'
  ],
  contextualPhrases: [
    'can you show', 'could you generate', 'i\'d like to see', 'please create',
    'would you make', 'i want an image', 'create a scene', 'generate art of',
    'make a design', 'draw me a', 'illustrate', 'picture of', 'give me a visual',
    'show me what', 'can you draw', 'design a'
  ]
};

export const confirmationKeywords: KeywordCollection = {
  keywords: [
    'yes', 'yeah', 'yep', 'correct', 'right', 'sure', 'ok', 'okay',
    'sounds good', 'perfect', 'great', 'absolutely', 'definitely',
    'confirm', 'approved', 'go ahead', 'proceed', 'do it', 'that\'s right',
    'that works', 'fine', 'good', 'indeed', 'agreed', 'affirmative'
  ]
};

export const rejectionKeywords: KeywordCollection = {
  keywords: [
    'no', 'nope', 'incorrect', 'wrong', 'not right', 'cancel', 'stop',
    'don\'t', 'do not', 'negative', 'decline', 'reject', 'disagree',
    'not what i want', 'that\'s not correct', 'that\'s wrong', 'mistake',
    'error', 'not good', 'bad', 'terrible', 'abort', 'halt', 'cease'
  ]
};

// Inappropriate content detection
export const inappropriateContentKeywords: KeywordCollectionWithPhrases = {
  keywords: [
    'nude', 'naked', 'sex', 'sexual', 'porn', 'pornographic', 'explicit',
    'adult content', 'erotic', 'obscene', 'nsfw', 'xxx', 'x-rated',
    'lewd', 'indecent', 'offensive', 'inappropriate', 'provocative',
    'violent', 'gore', 'blood', 'kill', 'murder', 'suicide', 'self-harm',
    'abuse', 'harmful', 'illegal', 'weapon', 'drug', 'terrorist'
  ],
  contextualPhrases: [
    'without clothes', 'no clothes', 'in the nude', 'removing clothes',
    'taking off', 'sexy', 'seductive', 'revealing', 'intimate parts',
    'private parts', 'adult image', 'graphic content', 'mature content',
    'violent scene', 'harmful content', 'dangerous', 'disturbing'
  ]
};
