import type { OrchestratorAgent } from './OrchestratorAgent';
import type { Task } from '../types';

interface ManagedTask {
  id: string;
  description: string;
  type?: string;
  requiresData?: boolean;
  requiresAnalysis?: boolean;
  requiresExecution?: boolean;
  status: 'pending' | 'complete';
  progress: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

interface TaskStatus {
  taskId: string;
  status: string;
  progress: Record<string, any>;
  complete: boolean;
  result: any;
}

export class TaskManager {
  private orchestrator: OrchestratorAgent;
  private tasks: Map<string, ManagedTask>;
  private taskCounter: number;

  constructor(orchestrator: OrchestratorAgent) {
    this.orchestrator = orchestrator;
    this.tasks = new Map();
    this.taskCounter = 0;
  }

  async create(task: Task & { requiresData?: boolean; requiresAnalysis?: boolean; requiresExecution?: boolean }): Promise<string> {
    const taskId = `task-${++this.taskCounter}`;
    
    this.tasks.set(taskId, {
      id: taskId,
      description: task.description,
      type: task.type,
      requiresData: task.requiresData || false,
      requiresAnalysis: task.requiresAnalysis || false,
      requiresExecution: task.requiresExecution || false,
      status: 'pending',
      progress: {},
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return taskId;
  }

  async updateProgress(taskId: string, agentType: string, response: any): Promise<void> {
    const task = this.tasks.get(taskId);
    if (!task) return;
    
    task.progress[agentType] = response;
    task.updatedAt = new Date();
    
    // Check if all required agents have responded
    this.checkCompletion(taskId);
  }

  private checkCompletion(taskId: string): void {
    const task = this.tasks.get(taskId);
    if (!task) return;
    
    const requiredAgents: string[] = [];
    if (task.requiresData) requiredAgents.push('research');
    if (task.requiresAnalysis) requiredAgents.push('analysis');
    if (task.requiresExecution) requiredAgents.push('trading');
    requiredAgents.push('monitor');
    
    const completedAgents = Object.keys(task.progress);
    const allComplete = requiredAgents.every(agent => completedAgents.includes(agent));
    
    if (allComplete) {
      task.status = 'complete';
      task.completedAt = new Date();
    }
  }

  getStatus(taskId: string): TaskStatus | null {
    const task = this.tasks.get(taskId);
    if (!task) return null;
    
    return {
      taskId: task.id,
      status: task.status,
      progress: task.progress,
      complete: task.status === 'complete',
      result: this.compileResult(task)
    };
  }

  private compileResult(task: ManagedTask): any {
    if (task.status !== 'complete' || !task.completedAt) return null;
    
    return {
      success: true,
      data: task.progress.research?.data,
      insights: task.progress.analysis?.insights,
      execution: task.progress.trading?.result,
      metrics: task.progress.monitor?.metrics,
      duration: task.completedAt.getTime() - task.createdAt.getTime()
    };
  }
}
