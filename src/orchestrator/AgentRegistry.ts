import type { OrchestratorAgent } from './OrchestratorAgent';

interface AgentConfig {
  role: string;
  capabilities: string[];
  description: string;
}

interface RegisteredAgent {
  type: string;
  role: string;
  capabilities: string[];
  description: string;
  registeredAt: Date;
}

export class AgentRegistry {
  private orchestrator: OrchestratorAgent;
  private agentTypes: Map<string, RegisteredAgent>;

  constructor(orchestrator: OrchestratorAgent) {
    this.orchestrator = orchestrator;
    this.agentTypes = new Map();
  }

  register(type: string, config: AgentConfig): void {
    this.agentTypes.set(type, {
      type,
      role: config.role,
      capabilities: config.capabilities,
      description: config.description,
      registeredAt: new Date()
    });
  }

  get(type: string): RegisteredAgent | undefined {
    return this.agentTypes.get(type);
  }

  getAll(): RegisteredAgent[] {
    return Array.from(this.agentTypes.values());
  }

  count(): number {
    return this.agentTypes.size;
  }

  hasCapability(type: string, capability: string): boolean {
    const agent = this.agentTypes.get(type);
    return agent ? agent.capabilities.includes(capability) : false;
  }
}
