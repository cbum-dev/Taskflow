import { toast } from 'sonner';
import { aiService } from '@/services/api';

export interface GenerateTasksParams {
  prompt: string;
  projectId: string;
  workspaceId: string;
  onSuccess?: (count: number, tasks: any[]) => void;
  onError?: (error: Error) => void;
}

export const generateTasksWithAI = async ({
  prompt,
  projectId,
  workspaceId,
  onSuccess,
  onError,
}: GenerateTasksParams) => {
  // Validate inputs
  if (!prompt.trim()) {
    const error = new Error('Prompt cannot be empty');
    toast.error('Please provide a description of what you want to accomplish');
    if (onError) onError(error);
    throw error;
  }

  if (prompt.length > 1000) {
    const error = new Error('Prompt is too long');
    toast.error('Please keep your description under 1000 characters');
    if (onError) onError(error);
    throw error;
  }

  // Show loading toast
  const loadingToast = toast.loading('Generating tasks with AI...');

  try {
    const response = await aiService.generateTasks({
      prompt: prompt.trim(),
      projectId,
      workspaceId,
    });

    if (response.data.success) {
      const { count, tasks, message } = response.data;
      
      toast.dismiss(loadingToast);
      toast.success(message || `Successfully generated ${count} tasks!`, {
        description: `${count} new tasks have been added to your project`,
      });
      
      if (onSuccess) onSuccess(count, tasks);
      return tasks;
    } else {
      throw new Error(response.data.error || 'Failed to generate tasks');
    }
  } catch (error: any) {
    console.error('Error generating tasks:', error);
    
    toast.dismiss(loadingToast);
    
    // Handle specific error types
    let errorMessage = 'Failed to generate tasks. Please try again.';
    
    if (error.response?.status === 429) {
      errorMessage = 'AI service is busy. Please try again in a few minutes.';
    } else if (error.response?.status === 503) {
      errorMessage = 'AI service is temporarily unavailable.';
    } else if (error.response?.status === 404) {
      errorMessage = 'Project not found or access denied.';
    } else if (error.response?.status === 400) {
      errorMessage = error.response.data?.error || 'Invalid request parameters.';
    } else if (error.code === 'NETWORK_ERROR') {
      errorMessage = 'Network error. Please check your connection.';
    }
    
    toast.error(errorMessage);
    if (onError) onError(error);
    throw error;
  }
};

export const formatAITaskPrompt = (goal: string, context: string = '') => {
  // Clean and format the goal
  const cleanGoal = goal.trim().replace(/\s+/g, ' ');
  
  if (context.trim()) {
    return `${cleanGoal}\n\nAdditional context: ${context.trim()}`;
  }
  
  return cleanGoal;
};

// Utility to validate prompt before sending
export const validateTaskPrompt = (prompt: string): { valid: boolean; error?: string } => {
  if (!prompt.trim()) {
    return { valid: false, error: 'Prompt cannot be empty' };
  }
  
  if (prompt.length > 1000) {
    return { valid: false, error: 'Prompt must be less than 1000 characters' };
  }
  
  if (prompt.trim().length < 10) {
    return { valid: false, error: 'Please provide a more detailed description (at least 10 characters)' };
  }
  
  return { valid: true };
};

// Pre-defined prompt templates
export const promptTemplates = {
  feature: (featureName: string) => 
    `Implement a new ${featureName} feature for our application. Include planning, development, testing, and documentation phases.`,
  
  bugfix: (bugDescription: string) => 
    `Fix the following bug: ${bugDescription}. Include investigation, root cause analysis, fix implementation, and testing.`,
  
  research: (topic: string) => 
    `Research and analyze ${topic}. Include information gathering, analysis, documentation, and recommendations.`,
  
  optimization: (area: string) => 
    `Optimize the ${area} in our application. Include performance analysis, optimization planning, implementation, and validation.`,
  
  integration: (service: string) => 
    `Integrate ${service} into our application. Include API research, implementation planning, development, and testing.`,
};

// Helper to get AI service health
export const checkAIServiceHealth = async (): Promise<boolean> => {
  try {
    const response = await aiService.checkHealth();
    return response.data.success;
  } catch (error) {
    console.error('AI service health check failed:', error);
    return false;
  }
};