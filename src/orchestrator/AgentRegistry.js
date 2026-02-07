export class AgentRegistry {
  constructor(orchestrator) {
    this.orchestrator = orchestrator;
    this.agentTypes = new Map();
  }

  register(type, config) {
    this.agentTypes.set(type, {
      type,
      role: config.role,
      capabilities: config.capabilities,
      description: config.description,
      registeredAt: new Date()
    });
  }

  get(type) {
    return this.agentTypes.get(type);
  }

  getAll() {
    return Array.from(this.agentTypes.values());
  }

  count() {
    return this.agentTypes.size;
  }

  hasCapability(type, capability) {
    const agent = this.agentTypes.get(type);
    return agent && agent.capabilities.includes(capability);
  }
}
