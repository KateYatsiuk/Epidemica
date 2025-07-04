import { Button, Heading, useMediaQuery } from '@chakra-ui/react';
import { useRef, useEffect, useState } from 'react';
import { ModelKind, SimulationFormValues } from '../models/simulation';
import { AgentSimulation } from '../models/agentSimulation';
import { useColorMode } from './ui/color-mode';

interface AgentSimulationBoxProps {
  modelParams: SimulationFormValues;
  isActive: boolean;
}

const AgentSimulationBox = ({ modelParams, isActive }: AgentSimulationBoxProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const quarantineCanvasRef = useRef<HTMLCanvasElement>(null);
  const hospitalCanvasRef = useRef<HTMLCanvasElement>(null);

  const [currentSim, setCurrentSim] = useState<AgentSimulation | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const { colorMode } = useColorMode();
  const [isTablet, isDesktop] = useMediaQuery([
    "(min-width: 768px)",
    "(min-width: 1024px)",
  ]);

  const getCanvasSize = () => {
    if (isDesktop) return { width: 700, height: 500 };
    else if (isTablet) return { width: 500, height: 350 };
    return { width: 320, height: 220 };
  };

  const { width: canvasWidth, height: canvasHeight } = getCanvasSize();

  const startSimulation = () => {
    if (canvasRef.current) {
      if (currentSim) {
        currentSim.stopSimulation();
      }

      const canvas = canvasRef.current;
      const sim = new AgentSimulation(
        modelParams.beta,
        modelParams.gamma,
        modelParams.n,
        modelParams.initialI,
        modelParams.days,
        canvas,
        modelParams.model[0],
        modelParams.sigma,
        modelParams.delta,
        modelParams.hRate,
        modelParams.mu,
        modelParams.vRate,
        colorMode,
        quarantineCanvasRef.current,
        hospitalCanvasRef.current
      );
      setCurrentSim(sim);
      sim.startSimulation();
      setIsRunning(true);

      return sim;
    }
  };

  useEffect(() => {
    if (isActive) {
      const sim = startSimulation();
      return () => {
        if (sim) {
          sim.stopSimulation();
        }
        if (currentSim) {
          currentSim.stopSimulation();
        }
      };
    }
  }, [modelParams, canvasWidth, canvasHeight]);

  useEffect(() => {
    if (!isActive) {
      currentSim?.stopSimulation();
      setIsRunning(false);
    } else {
      if (!currentSim && !isRunning) {
        const sim = startSimulation();
        return () => {
          if (sim) {
            sim.stopSimulation();
            setIsRunning(false);
          }
        }
      }
    }
  }, [isActive]);

  const toggleSimulation = () => {
    if (!currentSim) return;

    if (isRunning) {
      currentSim.stopSimulation();
    } else {
      currentSim.startSimulation();
    }

    setIsRunning(!isRunning);
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{
          border: "1px solid #E2E8F0",
          marginTop: "20px",
          borderRadius: "0.5rem"
        }}
      />

      {modelParams.model[0] === ModelKind.SEIQR &&
        <>
          <Heading size="md">Карантин</Heading>
          <canvas
            ref={quarantineCanvasRef}
            width={canvasWidth}
            height={100}
            style={{ border: "1px dashed purple", marginLeft: "10px", borderRadius: "0.5rem" }}
          />
        </>
      }
      {modelParams.model[0] === ModelKind.SEIHR &&
        <>
          <Heading size="md">Лікарня</Heading>
          <canvas
            ref={hospitalCanvasRef}
            width={canvasWidth}
            height={100}
            style={{ border: "1px dashed brown", marginLeft: "10px", borderRadius: "0.5rem" }}
          />
        </>
      }

      <div style={{ marginTop: '10px' }}>
        <Button
          onClick={toggleSimulation}
          style={{
            marginRight: "10px",
            backgroundColor: isRunning ? '#E53E3E' : '#38A169',
          }}
        >
          {isRunning ? 'Стоп' : 'Старт'}
        </Button>
        <Button
          variant="surface"
          onClick={startSimulation}
          colorPalette="purple"
        >
          Перезапустити симуляцію
        </Button>
      </div>
    </>
  );
};

export default AgentSimulationBox;
