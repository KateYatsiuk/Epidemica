import { stateColors } from "./simulation";

export enum AgentsStatesKind {
  Susceptible,
  Infected,
  Recovered,
  Exposed,
  Quarantined,
  Vaccinated,
  Hospitalized,
};

export interface RestrictedArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class Agent {
  x: number;
  y: number;
  radius: number;
  state: AgentsStatesKind;
  dx: number;
  dy: number;
  recoveryTime: number;
  exposureTime: number;

  constructor(x: number, y: number, radius: number = 5) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.state = AgentsStatesKind.Susceptible;
    this.dx = (Math.random() - 0.5) * 2;
    this.dy = (Math.random() - 0.5) * 2;
    this.recoveryTime = 500;
    this.exposureTime = 200;
  }

  move(width: number, height: number, isRestricted: boolean = false, restrictedArea?: RestrictedArea) {
    // If agent is in a restricted area (quarantine or hospital), limit movement
    if (isRestricted && restrictedArea) {
      this.dx = (Math.random() - 0.5) * 1;
      this.dy = (Math.random() - 0.5) * 1;

      this.x += this.dx;
      this.y += this.dy;

      if (this.x - this.radius < restrictedArea.x) this.x = restrictedArea.x + this.radius;
      if (this.x + this.radius > restrictedArea.x + restrictedArea.width) this.x = restrictedArea.x + restrictedArea.width - this.radius;
      if (this.y - this.radius < restrictedArea.y) this.y = restrictedArea.y + this.radius;
      if (this.y + this.radius > restrictedArea.y + restrictedArea.height) this.y = restrictedArea.y + restrictedArea.height - this.radius;
    } else {
      // Normal movement for non-restricted agents
      this.x += this.dx;
      this.y += this.dy;

      if (this.x - this.radius <= 0 || this.x + this.radius >= width) this.dx = -this.dx;
      if (this.y - this.radius <= 0 || this.y + this.radius >= height) this.dy = -this.dy;
    }
  }

  expose() {
    if (this.state === AgentsStatesKind.Susceptible) {
      this.state = AgentsStatesKind.Exposed;
    }
  }

  infect() {
    if (this.state === AgentsStatesKind.Exposed || this.state === AgentsStatesKind.Susceptible) {
      this.state = AgentsStatesKind.Infected;
    }
  }

  recover() {
    if (this.state === AgentsStatesKind.Infected || this.state === AgentsStatesKind.Quarantined || this.state === AgentsStatesKind.Hospitalized) {
      this.state = AgentsStatesKind.Recovered;
    }
  }

  quarantine(quarantineArea: RestrictedArea) {
    if (this.state === AgentsStatesKind.Infected) {
      this.state = AgentsStatesKind.Quarantined;
      this.x = quarantineArea.x + Math.random() * quarantineArea.width;
      this.y = quarantineArea.y + Math.random() * quarantineArea.height;
    }
  }

  hospitalize(hospitalArea: RestrictedArea) {
    if (this.state === AgentsStatesKind.Infected) {
      this.state = AgentsStatesKind.Hospitalized;
      this.x = hospitalArea.x + Math.random() * hospitalArea.width;
      this.y = hospitalArea.y + Math.random() * hospitalArea.height;
    }
  }

  vaccinate() {
    if (this.state === AgentsStatesKind.Susceptible) {
      this.state = AgentsStatesKind.Vaccinated;
    }
  }

  update(gamma: number, sigma?: number, delta?: number, hRate?: number, mu?: number, vRate?: number,
    quarantineArea?: RestrictedArea, hospitalArea?: RestrictedArea) {
    // SEIR transitions: Exposed -> Infected (based on sigma)
    if (sigma && this.state === AgentsStatesKind.Exposed) {
      this.exposureTime--;
      if (this.exposureTime <= 0 && Math.random() < sigma) {
        this.infect();
      }
    }

    // SIR transitions: Infected -> Recovered (based on gamma)
    if (this.state === AgentsStatesKind.Infected) {
      this.recoveryTime--;

      // Recovery chance
      if (this.recoveryTime <= 0 && Math.random() < gamma) {
        this.recover();
      }

      // SEIQR: Chance to be quarantined (based on delta)
      else if (delta && Math.random() < delta && quarantineArea) {
        this.quarantine(quarantineArea);
      }

      // SEIHR: Chance to be hospitalized (based on hRate)
      else if (hRate && Math.random() < hRate && hospitalArea) {
        this.hospitalize(hospitalArea);
      }
    }

    // Quarantined agents can recover
    if (mu && this.state === AgentsStatesKind.Quarantined) {
      this.recoveryTime--;
      if (this.recoveryTime <= 0 && Math.random() < mu) {
        this.recover();
      }
    }

    // Hospitalized agents can recover (based on mu - discharge rate)
    if (mu && this.state === AgentsStatesKind.Hospitalized) {
      this.recoveryTime--;
      if (this.recoveryTime <= 0 && Math.random() < mu) {
        this.recover();
      }
    }

    // SEIRV: Susceptible agents can be vaccinated
    if (vRate && this.state === AgentsStatesKind.Susceptible && Math.random() < vRate) {
      this.vaccinate();
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = stateColors[this.state] || "gray";
    ctx.fill();
  }
}
