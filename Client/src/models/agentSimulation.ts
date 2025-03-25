import { Agent, AgentsStatesKind, RestrictedArea } from "./agent";
import { ModelKind } from "./simulation";

export class AgentSimulation {
  agents: Agent[];
  beta: number;       // Transmission rate
  gamma: number;      // Recovery rate
  sigma?: number;     // Incubation rate (exposed -> infected)
  delta?: number;     // Quarantine rate
  hRate?: number;     // Hospitalization rate
  mu?: number;        // Hospital discharge rate
  vRate?: number;
  n: number;
  initialI: number;
  days: number;
  modelType: ModelKind;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  animationFrameId: number;
  quarantineArea?: RestrictedArea;
  hospitalArea?: RestrictedArea;
  SPREAD_RADIUS = 10;

  constructor(
    beta: number,
    gamma: number,
    n: number,
    initialI: number,
    days: number,
    canvas: HTMLCanvasElement,
    modelType: ModelKind = ModelKind.SIR,
    sigma?: number,
    delta?: number,
    h_rate?: number,
    mu?: number,
    v_rate?: number
  ) {
    this.agents = [];
    this.beta = beta;
    this.gamma = gamma;
    this.sigma = sigma || undefined;
    this.delta = delta || undefined;
    this.hRate = h_rate || undefined;
    this.mu = mu || undefined;
    this.vRate = v_rate || undefined;
    this.n = n;
    this.initialI = initialI;
    this.days = days;
    this.modelType = modelType;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.animationFrameId = 0;

    this.prepareIsolationAreas(modelType);
    this.initializeAgents();
  }

  initializeAgents() {
    for (let i = 0; i < this.n; i++) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      const agent = new Agent(x, y);

      if (i < this.initialI) {
        if (this.modelType === ModelKind.SEIR || this.modelType === ModelKind.SEIQR ||
          this.modelType === ModelKind.SEIHR || this.modelType === ModelKind.SEIRV) {
          agent.expose(); // Start with exposed agents in SEIR-based models
        } else {
          agent.infect(); // Start with infected agents in SIR model
        }
      }

      this.agents.push(agent);
    }
  }

  step() {
    for (let i = 0; i < this.agents.length; i++) {
      const agent = this.agents[i];

      if (agent.state === AgentsStatesKind.Quarantined && this.quarantineArea) {
        agent.move(this.canvas.width, this.canvas.height, true, this.quarantineArea);
      } else if (agent.state === AgentsStatesKind.Hospitalized && this.hospitalArea) {
        agent.move(this.canvas.width, this.canvas.height, true, this.hospitalArea);
      } else {
        agent.move(this.canvas.width, this.canvas.height);
      }

      agent.update(
        this.gamma,
        this.sigma,
        this.delta,
        this.hRate,
        this.mu,
        this.vRate,
        this.quarantineArea,
        this.hospitalArea
      );

      // Handle infection spread
      if (agent.state === AgentsStatesKind.Infected) {
        for (let j = 0; j < this.agents.length; j++) {
          if (i !== j &&
            (this.agents[j].state === AgentsStatesKind.Susceptible)) {
            const distance = Math.sqrt(
              Math.pow(agent.x - this.agents[j].x, 2) + Math.pow(agent.y - this.agents[j].y, 2)
            );

            // Infection based on beta parameter
            if (distance < this.SPREAD_RADIUS && Math.random() < this.beta) {
              if (this.modelType === ModelKind.SEIR || this.modelType === ModelKind.SEIQR ||
                this.modelType === ModelKind.SEIHR || this.modelType === ModelKind.SEIRV) {
                this.agents[j].expose();
              } else {
                this.agents[j].infect();
              }
            }
          }
        }
      }
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawIsolationAreas();
    this.agents.forEach(agent => agent.render(this.ctx));
    this.displayStatistics();
  }

  getStatus() {
    const susceptible = this.agents.filter(agent => agent.state === AgentsStatesKind.Susceptible).length;
    const exposed = this.agents.filter(agent => agent.state === AgentsStatesKind.Exposed).length;
    const infected = this.agents.filter(agent => agent.state === AgentsStatesKind.Infected).length;
    const recovered = this.agents.filter(agent => agent.state === AgentsStatesKind.Recovered).length;
    const quarantined = this.agents.filter(agent => agent.state === AgentsStatesKind.Quarantined).length;
    const hospitalized = this.agents.filter(agent => agent.state === AgentsStatesKind.Hospitalized).length;
    const vaccinated = this.agents.filter(agent => agent.state === AgentsStatesKind.Vaccinated).length;

    return {
      susceptible,
      exposed,
      infected,
      recovered,
      quarantined,
      hospitalized,
      vaccinated
    };
  }

  startSimulation() {
    const animate = () => {
      this.step();
      this.render();
      this.animationFrameId = requestAnimationFrame(animate);
    };
    animate();
  }

  stopSimulation() {
    cancelAnimationFrame(this.animationFrameId);
  }

  private displayStatistics() {
    this.ctx.fillStyle = "black";
    this.ctx.font = "16px Arial";
    this.ctx.fillText(`Model: ${this.modelType}`, 10, 20);

    const stats = this.getStatus();
    this.ctx.fillText(`S: ${stats.susceptible} | `, 10, 40);

    if (this.modelType !== ModelKind.SIR) {
      this.ctx.fillText(`E: ${stats.exposed} | `, 70, 40);
    }

    this.ctx.fillText(`I: ${stats.infected} | `, this.modelType !== ModelKind.SIR ? 130 : 70, 40);
    this.ctx.fillText(`R: ${stats.recovered}`, this.modelType !== ModelKind.SIR ? 190 : 130, 40);

    if (this.modelType === ModelKind.SEIQR || this.modelType === ModelKind.SEIHR) {
      this.ctx.fillText(`Q: ${stats.quarantined || 0}`, 250, 40);
    }

    if (this.modelType === ModelKind.SEIHR) {
      this.ctx.fillText(`H: ${stats.hospitalized || 0}`, 310, 40);
    }

    if (this.modelType === ModelKind.SEIRV) {
      this.ctx.fillText(`V: ${stats.vaccinated || 0}`, 250, 40);
    }
  }

  private prepareIsolationAreas(modelType: ModelKind) {
    if (modelType === ModelKind.SEIQR || modelType === ModelKind.SEIHR) {
      const canvasWidth = this.canvas.width;
      const canvasHeight = this.canvas.height;

      if (modelType === ModelKind.SEIQR) {
        // bottom right
        this.quarantineArea = {
          x: canvasWidth * 0.7,
          y: canvasHeight * 0.7,
          width: canvasWidth * 0.25,
          height: canvasHeight * 0.25
        };
      }

      if (modelType === ModelKind.SEIHR) {
        // bottom left
        this.hospitalArea = {
          x: canvasWidth * 0.05,
          y: canvasHeight * 0.7,
          width: canvasWidth * 0.25,
          height: canvasHeight * 0.25
        };
      }
    }
  }

  private drawIsolationAreas() {
    if (this.quarantineArea) {
      this.ctx.fillStyle = "rgba(128, 0, 128, 0.1)";
      this.ctx.fillRect(
        this.quarantineArea.x,
        this.quarantineArea.y,
        this.quarantineArea.width,
        this.quarantineArea.height
      );
      this.ctx.strokeStyle = "purple";
      this.ctx.strokeRect(
        this.quarantineArea.x,
        this.quarantineArea.y,
        this.quarantineArea.width,
        this.quarantineArea.height
      );
      this.ctx.fillStyle = "purple";
      this.ctx.font = "14px Arial";
      this.ctx.fillText("Quarantine", this.quarantineArea.x + 10, this.quarantineArea.y + 20);
    }

    if (this.hospitalArea) {
      this.ctx.fillStyle = "rgba(165, 42, 42, 0.1)";
      this.ctx.fillRect(
        this.hospitalArea.x,
        this.hospitalArea.y,
        this.hospitalArea.width,
        this.hospitalArea.height
      );
      this.ctx.strokeStyle = "brown";
      this.ctx.strokeRect(
        this.hospitalArea.x,
        this.hospitalArea.y,
        this.hospitalArea.width,
        this.hospitalArea.height
      );
      this.ctx.fillStyle = "brown";
      this.ctx.font = "14px Arial";
      this.ctx.fillText("Hospital", this.hospitalArea.x + 10, this.hospitalArea.y + 20);
    }
  }
}
