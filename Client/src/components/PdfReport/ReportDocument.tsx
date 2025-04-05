import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import { SimulationFormValues } from '../../models/simulation';
import { SimulationModelResult } from '../SimulationChart';
import { reportDocumentStyles } from './ReportDocument.styles';

interface ReportDocumentProps {
  chartImage: string | null;
  simulationData: SimulationModelResult & {
    beta?: number;
    gamma?: number;
  };
  modelParams: SimulationFormValues;
}
const ReportDocument = ({ chartImage, simulationData, modelParams }: ReportDocumentProps) => {
  const currentDate = new Date().toLocaleDateString();

  const tableData = simulationData.S?.map((_, idx: number) => ({
    day: idx,
    susceptible: Math.round(simulationData.S[idx]),
    infected: Math.round(simulationData.I[idx]),
    recovered: Math.round(simulationData.R[idx]),
  })).filter((_, idx) => idx % 5 === 0) || [];

  const modelParamsList = [
    { label: "Модель", value: modelParams?.model[0].toUpperCase() },
    { label: "Коефіцієнт інфікування (β)", value: modelParams?.beta },
    { label: "Коефіцієнт відновлення (γ)", value: modelParams?.gamma },
    { label: "Кількість днів", value: modelParams?.days },
    { label: "Загальна популяція", value: modelParams?.n },
    { label: "Початкова кількість сприйнятливих", value: modelParams?.initialS },
    { label: "Початкова кількість інфікованих", value: modelParams?.initialI },
  ];

  const statsList = [
    { label: "Базове репродуктивне число (R₀)", value: simulationData.beta && simulationData.gamma ? (simulationData.beta / simulationData.gamma).toFixed(2) : "N/A" },
    { label: "День піку інфікованих", value: simulationData.peak_day },
    { label: "Максимальна кількість інфікованих", value: simulationData.max_infected },
    { label: "Фінальна кількість сприйнятливих", value: simulationData.final_susceptible },
    { label: "Фінальна кількість одужалих", value: simulationData.final_recovered },
  ];

  return (
    <Document>
      <Page size="A4" style={reportDocumentStyles.page}>
        <Text style={reportDocumentStyles.header}>SIR Симуляція</Text>
        <Text style={reportDocumentStyles.text}>Дата створення: {currentDate}</Text>

        <View style={reportDocumentStyles.section}>
          <Text style={reportDocumentStyles.subheader}>Параметри моделі</Text>
          <View style={reportDocumentStyles.statsSection}>
            {modelParamsList.map(({ label, value }, idx) => (
              <View key={idx} style={reportDocumentStyles.tableRow}>
                <Text style={reportDocumentStyles.statsLabel}>{label}:</Text>
                <Text style={reportDocumentStyles.statsValue}>{value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={reportDocumentStyles.chartContainer}>
          <Text style={reportDocumentStyles.subheader}>Графік симуляції</Text>
          {chartImage && <Image style={reportDocumentStyles.chart} src={chartImage} />}
        </View>

        <View style={reportDocumentStyles.section}>
          <Text style={reportDocumentStyles.subheader}>Статистика</Text>
          <View style={reportDocumentStyles.statsSection}>
            {statsList.map(({ label, value }, idx) => (
              <View key={idx} style={reportDocumentStyles.tableRow}>
                <Text style={reportDocumentStyles.statsLabel}>{label}:</Text>
                <Text style={reportDocumentStyles.statsValue}>{value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={reportDocumentStyles.section}>
          <Text style={reportDocumentStyles.subheader}>Дані симуляції (вибрані дні)</Text>
          <View>
            <View style={[reportDocumentStyles.tableRow, reportDocumentStyles.tableHeader]}>
              <Text style={reportDocumentStyles.statsLabel}>День</Text>
              <Text style={reportDocumentStyles.statsLabel}>Сприйнятливі</Text>
              <Text style={reportDocumentStyles.statsLabel}>Інфіковані</Text>
              <Text style={reportDocumentStyles.statsLabel}>Відновлені</Text>
            </View>

            {tableData.map((row, idx) => (
              <View key={idx} style={reportDocumentStyles.tableRow}>
                <Text style={reportDocumentStyles.statsValue}>{row.day}</Text>
                <Text style={reportDocumentStyles.statsValue}>{row.susceptible}</Text>
                <Text style={reportDocumentStyles.statsValue}>{row.infected}</Text>
                <Text style={reportDocumentStyles.statsValue}>{row.recovered}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={reportDocumentStyles.section}>
          <Text style={reportDocumentStyles.subheader}>Підсумок</Text>
          <Text style={reportDocumentStyles.text}>• Модель демонструє {simulationData.peak_day > modelParams?.days / 2 ? "пізній" : "ранній"} пік інфекції на {simulationData.peak_day}-й день.</Text>
          <Text style={reportDocumentStyles.text}>• Максимальна кількість одночасно інфікованих становить {simulationData.max_infected} осіб ({(simulationData.max_infected / modelParams?.n * 100).toFixed(1)}% популяції).</Text>
          <Text style={reportDocumentStyles.text}>• На кінець періоду відновилося {simulationData.final_recovered} осіб ({(simulationData.final_recovered / modelParams?.n * 100).toFixed(1)}% популяції).</Text>
          {simulationData.beta && simulationData.gamma &&
            <Text style={reportDocumentStyles.text}>• Базове репродуктивне число R₀ = {(simulationData.beta / simulationData.gamma).toFixed(2)}, що {(simulationData.beta / simulationData.gamma) > 1 ? "вказує на епідемічне поширення" : "є недостатнім для епідемії"}.</Text>
          }
        </View>

        <Text style={reportDocumentStyles.footer}>© {new Date().getFullYear()} - Epidemica</Text>
      </Page>
    </Document>
  );
};

export default ReportDocument;
