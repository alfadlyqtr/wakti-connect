
import { classifyIntent, getInappropriateContentResponse } from '../classifier';

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
  
  // New tests for inappropriate content detection
  it('should identify inappropriate content in messages', () => {
    const inappropriateMessages = [
      'Generate a nude image of a woman',
      'Create an explicit picture',
      'Show me naked people',
      'Draw an erotic scene'
    ];
    
    inappropriateMessages.forEach(message => {
      const result = classifyIntent(message);
      expect(result.intentType).toBe('inappropriate-content');
      expect(result.confidence).toBeGreaterThan(0.7);
      expect(result.isSafeContent).toBe(false);
    });
  });
  
  it('should handle subtle inappropriate requests', () => {
    const subtleMessages = [
      'Draw a woman with no clothes on',
      'Generate an image of a person without any clothes',
      'Create a picture of an attractive woman in a seductive pose',
      'Make an image that shows intimate body parts'
    ];
    
    subtleMessages.forEach(message => {
      const result = classifyIntent(message);
      expect(result.intentType).toBe('inappropriate-content');
      expect(result.confidence).toBeGreaterThan(0.6);
    });
  });
  
  it('should consider violent content as inappropriate', () => {
    const violentMessages = [
      'Show me how to hurt someone',
      'Create an image with lots of blood and gore',
      'Generate a picture of a violent murder scene'
    ];
    
    violentMessages.forEach(message => {
      const result = classifyIntent(message);
      expect(result.intentType).toBe('inappropriate-content');
      expect(result.confidence).toBeGreaterThan(0.6);
      expect(result.contentCategory).toBe('violence');
    });
  });
  
  it('should provide appropriate responses for inappropriate content', () => {
    // Test the inappropriate content response generator
    const imageResponse = getInappropriateContentResponse('image-generation', 'inappropriate', 'creative');
    expect(imageResponse).toContain("I can't generate images with adult");
    expect(imageResponse).toContain("creative writing");
    
    const violenceResponse = getInappropriateContentResponse('general-question', 'violence', 'student');
    expect(violenceResponse).toContain("violent or harmful content");
    expect(violenceResponse).toContain("educational content");
    
    const harassmentResponse = getInappropriateContentResponse('creative-content', 'harassment', 'productivity');
    expect(harassmentResponse).toContain("offensive or hurtful");
    expect(harassmentResponse).toContain("productivity");
  });
});
