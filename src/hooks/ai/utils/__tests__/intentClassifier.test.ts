
import { classifyIntent } from '../intentClassifier';

describe('Intent Classifier', () => {
  it('should correctly identify task creation intents', () => {
    const taskMessages = [
      'Create a task to buy groceries tomorrow',
      'Remind me to call John at 3pm',
      'Set a reminder for my dentist appointment on Friday',
      'I need to schedule a meeting with the team next week'
    ];
    
    taskMessages.forEach(message => {
      const result = classifyIntent(message);
      expect(result.intentType).toBe('task-creation');
      expect(result.confidence).toBeGreaterThan(0.6);
    });
  });
  
  it('should correctly identify image generation intents', () => {
    const imageMessages = [
      'Generate an image of a sunset over mountains',
      'Create a picture of a cat playing with yarn',
      'Can you make an image of a futuristic city?',
      'Draw me a beautiful landscape'
    ];
    
    imageMessages.forEach(message => {
      const result = classifyIntent(message);
      expect(result.intentType).toBe('image-generation');
      expect(result.confidence).toBeGreaterThan(0.7);
    });
  });
  
  it('should correctly identify general questions', () => {
    const questionMessages = [
      'What is the capital of France?',
      'Who invented the telephone?',
      'How does photosynthesis work?',
      'Tell me about quantum physics'
    ];
    
    questionMessages.forEach(message => {
      const result = classifyIntent(message);
      expect(result.intentType).toBe('general-question');
      expect(result.confidence).toBeGreaterThan(0.5);
    });
  });
  
  it('should correctly identify confirmation messages', () => {
    const confirmMessages = [
      'Yes, that looks good',
      'Go ahead',
      'Please proceed',
      'Confirm',
      'Sounds great',
      'That is correct'
    ];
    
    confirmMessages.forEach(message => {
      const result = classifyIntent(message);
      expect(result.intentType).toBe('confirmation');
      expect(result.confidence).toBeGreaterThan(0.7);
    });
  });
  
  it('should correctly identify rejection messages', () => {
    const rejectMessages = [
      'No, that\'s wrong',
      'Please cancel',
      'Stop that',
      'That is incorrect',
      'Don\'t do that',
      'I don\'t want that'
    ];
    
    rejectMessages.forEach(message => {
      const result = classifyIntent(message);
      expect(result.intentType).toBe('rejection');
      expect(result.confidence).toBeGreaterThan(0.7);
    });
  });
  
  it('should handle ambiguous or mixed intent messages', () => {
    // Messages with multiple potential intents
    const mixedIntentMessage = 'Can you create a task and also tell me the weather?';
    const result = classifyIntent(mixedIntentMessage);
    
    // The classifier should pick one of the intents with higher confidence
    expect(['task-creation', 'general-question'].includes(result.intentType)).toBeTruthy();
  });
  
  it('should classify completely unknown messages with low confidence', () => {
    const randomMessage = 'xyzabc 123456 !@#$%^';
    const result = classifyIntent(randomMessage);
    
    expect(result.intentType).toBe('unknown');
    expect(result.confidence).toBeLessThan(0.5);
  });
});
