export class TaskManager {
  constructor(orchestrator) {
    this.orchestrator = orchestrator;
    this.tasks = new Map();
    this.taskCounter = 0;
  }

  async create(task) {
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

  async updateProgress(taskId, agentType, response) {
    const task = this.tasks.get(taskId);
    if (!task) return;
    
    task.progress[agentType] = response;
    task.updatedAt = new Date();
    
    // Check if all required agents have responded
    this.checkCompletion(taskId);
  }

  checkCompletion(taskId) {
    const task = this.tasks.get(taskId);
    if (!task) return;
    
    const requiredAgents = [];
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

  getStatus(taskId) {
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

  compileResult(task) {
    if (task.status !== 'complete') return null;
    
    return {
      success: true,
      data: task.progress.research?.data,
      insights: task.progress.analysis?.insights,
      execution: task.progress.trading?.result,
      metrics: task.progress.monitor?.metrics,
      duration: task.completedAt - task.createdAt
    };
  }
}
