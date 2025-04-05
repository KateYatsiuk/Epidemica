import { Button } from '@chakra-ui/react';
import { useRef, useEffect, useState } from 'react';
import { SimulationFormValues } from '../models/simulation';
import { AgentSimulation } from '../models/agentSimulation';
import { useColorMode } from './ui/color-mode';

interface AgentSimulationBoxProps {
  modelParams: SimulationFormValues;
  isActive: boolean;
}

const AgentSimulationBox = ({ modelParams, isActive }: AgentSimulationBoxProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentSim, setCurrentSim] = useState<AgentSimulation | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const { colorMode } = useColorMode();

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
        colorMode
      );
      setCurrentSim(sim);
      sim.startSimulation();
      setIsRunning(true);

      return sim;
    }
  };

  useEffect(() => {
    const sim = startSimulation();

    return () => {
      if (sim) {
        sim.stopSimulation();
      }
      if (currentSim) {
        currentSim.stopSimulation();
      }
    };

  }, [modelParams]);

  useEffect(() => {
    if (!isActive) {
      currentSim?.stopSimulation();
      setIsRunning(false);
    }
    // else {
    //   if (!isRunning) {
    //     if (currentSim) {
    //       currentSim.startSimulation();
    //       setIsRunning(true);
    //     } else {
    //       const sim = startSimulation();
    //       return () => sim?.stopSimulation();
    //     }
    //   }
    // }
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
        // TODO: Fix hardcoded values of width/height
        width={700}
        height={500}
        style={{
          border: "1px solid #E2E8F0",
          marginTop: "20px",
          borderRadius: "0.5rem"
        }}
      ></canvas>

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
