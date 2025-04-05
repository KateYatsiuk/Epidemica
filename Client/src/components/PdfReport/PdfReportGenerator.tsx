import { RefObject, useEffect, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import html2canvas from 'html2canvas';
import { Button } from '@chakra-ui/react';
import ReportDocument from './ReportDocument';
import { SimulationModelResult } from '../SimulationChart';
import { SimulationFormValues } from '../../models/simulation';

interface PDFReportGeneratorProps {
  simulationData: SimulationModelResult & {
    beta?: number;
    gamma?: number;
  };
  modelParams: SimulationFormValues;
  chartRef: RefObject<any>;
}

const PDFReportGenerator = ({ simulationData, modelParams, chartRef }: PDFReportGeneratorProps) => {
  const [chartImage, setChartImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(false);
  }, [chartRef, simulationData, modelParams]);

  const captureChart = async () => {
    setIsLoading(true);

    if (chartRef.current) {
      try {
        const canvas = await html2canvas(chartRef.current, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff"
        });

        const image = canvas.toDataURL("image/png");
        setChartImage(image);
        setIsReady(true);
      } catch (error) {
        console.error("Помилка при створенні знімка графіка:", error);
      }
    }

    setIsLoading(false);
  };

  return (
    <>
      {!isReady
        ? (
          <Button
            colorPalette="purple"
            minWidth="fit-content"
            disabled={isLoading || !simulationData}
            onClick={captureChart}
          >
            Підготувати звіт
          </Button>)
        : (
          <PDFDownloadLink
            document={
              <ReportDocument chartImage={chartImage} simulationData={simulationData} modelParams={modelParams} />
            }
            fileName={`${modelParams?.model[0].toUpperCase()}-simulation-report.pdf`}
            style={{
              padding: "10px 15px",
              color: "white",
              backgroundColor: "rgb(147, 51, 234)",
              textDecoration: "none",
              borderRadius: "8px",
              display: "inline-block",
              fontWeight: 500,
              textAlign: "center",
              fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif"
            }}
          >
            {({ loading }) =>
              loading ? "Підготовка PDF..." : "Завантажити PDF"
            }
          </PDFDownloadLink>
        )}
    </>
  );
};

export default PDFReportGenerator;
