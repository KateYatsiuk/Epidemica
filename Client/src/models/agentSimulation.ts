import { ColorMode } from "../components/ui/color-mode";
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
  quarantineCtx: CanvasRenderingContext2D | null;
  hospitalCtx: CanvasRenderingContext2D | null;
  animationFrameId: number;
  quarantineArea?: RestrictedArea;
  hospitalArea?: RestrictedArea;
  colorMode: ColorMode;
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
    v_rate?: number,
    colorMode?: ColorMode,
    quarantineCanvas?: HTMLCanvasElement | null,
    hospitalCanvas?: HTMLCanvasElement | null
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
    this.colorMode = colorMode ?? "light";

    this.quarantineArea = quarantineCanvas
      ? { x: 0, y: 0, width: quarantineCanvas.width, height: quarantineCanvas.height }
      : undefined;

    this.hospitalArea = hospitalCanvas
      ? { x: 0, y: 0, width: hospitalCanvas.width, height: hospitalCanvas.height }
      : undefined;

    this.quarantineCtx = quarantineCanvas?.getContext('2d') || null;
    this.hospitalCtx = hospitalCanvas?.getContext('2d') || null;

    this.prepareIsolationAreas(quarantineCanvas, hospitalCanvas);
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
    this.agents.forEach(agent => {
      if (
        agent.state !== AgentsStatesKind.Quarantined &&
        agent.state !== AgentsStatesKind.Hospitalized
      ) {
        agent.render(this.ctx);
      }
    });

    if (this.quarantineCtx && this.quarantineArea) {
      this.quarantineCtx.clearRect(0, 0, this.quarantineArea.width, this.quarantineArea.height);
      this.agents
        .filter(agent => agent.state === AgentsStatesKind.Quarantined)
        .forEach(agent => agent.render(this.quarantineCtx!));
    }

    if (this.hospitalCtx && this.hospitalArea) {
      this.hospitalCtx.clearRect(0, 0, this.hospitalArea.width, this.hospitalArea.height);
      this.agents
        .filter(agent => agent.state === AgentsStatesKind.Hospitalized)
        .forEach(agent => agent.render(this.hospitalCtx!));
    }

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
    this.ctx.fillStyle = this.colorMode === "light" ? "black" : "white";
    this.ctx.font = "16px Arial";
    this.ctx.fillText(`Модель: ${this.modelType.toUpperCase()}`, 10, 20);

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

  private prepareIsolationAreas(quarantineCanvas: HTMLCanvasElement | null | undefined, hospitalCanvas: HTMLCanvasElement | null | undefined) {
    this.quarantineArea = quarantineCanvas
      ? { x: 0, y: 0, width: quarantineCanvas.width, height: quarantineCanvas.height }
      : undefined;

    this.hospitalArea = hospitalCanvas
      ? { x: 0, y: 0, width: hospitalCanvas.width, height: hospitalCanvas.height }
      : undefined;

    this.quarantineCtx = quarantineCanvas?.getContext('2d') || null;
    this.hospitalCtx = hospitalCanvas?.getContext('2d') || null;
  }
}
