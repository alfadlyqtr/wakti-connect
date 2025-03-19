
# AI Settings System Documentation

## Overview

The AI Assistant settings system in WAKTI provides customization capabilities for the AI assistant, allowing users to tailor the assistant's behavior, appearance, and knowledge base to their specific needs.

## Architecture

The system follows a React Context-based architecture with separate hooks for different functionalities:

```
┌─────────────────────┐     ┌───────────────────┐
│ AISettingsProvider  │─────▶ useAISettings     │
└─────────────────────┘     └───────────────────┘
           │                          │
           │                          │
           ▼                          ▼
┌─────────────────────┐     ┌───────────────────┐
│ Setting Operations  │     │ Knowledge Ops     │
└─────────────────────┘     └───────────────────┘
           │                          │
           │                          │
           ▼                          ▼
┌─────────────────────┐     ┌───────────────────┐
│  Supabase Tables    │     │ Backend Storage   │
└─────────────────────┘     └───────────────────┘
```

## Core Components

### 1. AISettingsContext

A React Context that provides access to AI settings throughout the application.

**Location**: `src/components/settings/ai/context/AISettingsContext.tsx`

**Responsibilities**:
- Manages the state of AI settings
- Provides methods to update settings
- Handles loading and error states
- Manages knowledge base operations
- Creates default settings for new users

### 2. Hook: useAISettings

A custom hook that provides a clean interface to interact with the AI settings.

**Usage**:
```tsx
const { 
  settings, 
  isLoadingSettings, 
  updateSettings,
  knowledgeUploads,
  addKnowledge,
  deleteKnowledge,
  createDefaultSettings
} = useAISettings();
```

## Database Tables

The AI settings system utilizes two main tables in Supabase:

1. **ai_assistant_settings**: Stores user preferences for the AI assistant
   - assistant_name: Custom name for the AI
   - tone: Communication style (formal, casual, etc.)
   - response_length: Preferred level of detail
   - proactiveness: Whether AI should proactively make suggestions
   - suggestion_frequency: How often suggestions should be made
   - enabled_features: Which features the AI can assist with

2. **ai_knowledge_uploads**: Stores custom knowledge provided by users
   - title: Topic of the knowledge
   - content: The actual information
   - user_id: Owner of the knowledge

## Main Features

### 1. AI Personality Customization

Users can customize how the AI assistant communicates:

```tsx
// Example of updating AI personality
updateSettings({
  ...settings,
  assistant_name: "My Assistant",
  tone: "casual",
  response_length: "detailed"
});
```

### 2. Feature Control

Enable or disable specific AI assistant features:

```tsx
// Example of toggling features
updateSettings({
  ...settings,
  enabled_features: {
    ...settings.enabled_features,
    tasks: true,
    analytics: false
  }
});
```

### 3. Knowledge Management

Add custom knowledge to enhance the AI assistant:

```tsx
// Example of adding knowledge
addKnowledge(
  "Company Policy", 
  "Our work hours are 9am to 5pm, Monday through Friday."
);

// Example of deleting knowledge
deleteKnowledge("knowledge-id-123");
```

## Integration with Components

### AI Assistant Chat

The AI assistant chat component uses settings to customize the AI behavior:

```tsx
// Example from src/components/ai/assistant/AIAssistantChatCard.tsx
const { settings } = useAISettings();
const assistantName = settings?.assistant_name || "WAKTI AI";

// Later used in rendering
<h3 className="font-medium text-sm md:text-base">Chat with {assistantName}</h3>
```

### AI Settings Tabs

The settings interface is split into tabs:

1. **AIPersonalityTab**: Customizes assistant name, tone, and response length
2. **AIFeaturesTab**: Controls proactiveness, suggestion frequency, and enabled features
3. **AIKnowledgeTab**: Manages custom knowledge for the assistant

## How to Use in New Components

### 1. Access AI Settings

To access AI settings in any component:

```tsx
import { useAISettings } from "@/components/settings/ai/context/AISettingsContext";

const MyComponent = () => {
  const { settings, isLoadingSettings } = useAISettings();
  
  if (isLoadingSettings) {
    return <div>Loading settings...</div>;
  }
  
  return (
    <div>
      <h1>Hello, {settings?.assistant_name || "AI Assistant"}</h1>
      {/* Rest of your component */}
    </div>
  );
};
```

### 2. Provide AI Settings Context

To make AI settings available in a component tree:

```tsx
import { AISettingsProvider } from "@/components/settings/ai";

const MyFeature = () => {
  return (
    <AISettingsProvider>
      <MyComponent />
    </AISettingsProvider>
  );
};
```

### 3. Update AI Settings

To modify AI settings:

```tsx
const { settings, updateSettings } = useAISettings();

const handleNameChange = (name: string) => {
  updateSettings({
    ...settings,
    assistant_name: name
  });
};
```

### 4. Manage Knowledge

To add or remove custom knowledge:

```tsx
const { addKnowledge, deleteKnowledge } = useAISettings();

// Add knowledge
const handleAddKnowledge = () => {
  addKnowledge("Financial Procedures", "Step 1: Submit expense reports by the 15th...");
};

// Delete knowledge
const handleDeleteKnowledge = (id: string) => {
  deleteKnowledge(id);
};
```

## First-Time User Experience

When a user accesses AI settings for the first time, they'll need to create default settings:

```tsx
const { settings, createDefaultSettings, isCreatingSettings } = useAISettings();

// Check if settings exist
if (!settings) {
  return (
    <Button 
      onClick={createDefaultSettings} 
      disabled={isCreatingSettings}
    >
      {isCreatingSettings ? "Creating Settings..." : "Create Default Settings"}
    </Button>
  );
}
```

## Access Control

The AI settings system checks if a user has access to AI features based on their account type:

```tsx
const { canUseAI } = useAISettings();

if (!canUseAI) {
  return <AIAssistantUpgradeCard />;
}
```

## Error Handling

The system provides error handling and reporting:

```tsx
const { error } = useAISettings();

if (error) {
  return <ErrorMessage message={error} />;
}
```

## Best Practices

1. **Always check loading state** before using settings to avoid null reference errors
2. **Handle the case when settings don't exist** for new users
3. **Verify user permissions** with the `canUseAI` flag before showing AI features
4. **Use the spread operator** when updating settings to preserve other settings
5. **Consider performance** by wrapping only the components that need AI settings in the provider

## Troubleshooting

### Common Issues

1. **Settings not loading**: Verify the user is authenticated and has the correct account type
2. **Updates not saving**: Check for error messages and ensure proper network connectivity
3. **Knowledge not appearing**: Verify it was added successfully and the user has permission

### Debugging

The system logs information to the console during development to help with debugging:

```javascript
// Example log in useAISettings hook
console.log("Fetching AI settings for user:", user.id);
```

## Future Improvements

The AI settings system is designed to be extensible for future features:

1. **Settings versioning**: Track changes to settings over time
2. **Import/export**: Allow users to share settings configurations
3. **Templates**: Predefined settings configurations for different use cases
4. **Analytics**: Track which settings are most commonly used
