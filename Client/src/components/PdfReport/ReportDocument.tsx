import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import { getLabelByKey, SimulationFormValues } from '../../models/simulation';
import { SimulationModelResult } from '../SimulationChart';
import { reportDocumentStyles } from './ReportDocument.styles';

interface ReportDocumentProps {
  chartImage: string | null;
  simulationData: SimulationModelResult;
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
    { label: getLabelByKey("beta"), value: modelParams?.beta },
    { label: getLabelByKey("gamma"), value: modelParams?.gamma },
    { label: getLabelByKey("days"), value: modelParams?.days },
    { label: getLabelByKey("N"), value: modelParams?.n },
    { label: getLabelByKey("initialS"), value: modelParams?.initialS },
    { label: getLabelByKey("initialI"), value: modelParams?.initialI },
  ];

  const statsList = [
    { label: getLabelByKey("r0"), value: simulationData.r0.toFixed(2)},
    { label: getLabelByKey("hit"), value: simulationData.hit.toFixed(2)},
    { label: getLabelByKey("peak_day"), value: simulationData.peak_day },
    { label: getLabelByKey("max_infected"), value: simulationData.max_infected.toFixed(2) },
    { label: getLabelByKey("final_susceptible"), value: simulationData.final_susceptible.toFixed(2) },
    { label: getLabelByKey("final_recovered"), value: simulationData.final_recovered.toFixed(2) },
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
          <Text style={reportDocumentStyles.text}>• Максимальна кількість одночасно інфікованих становить {simulationData.max_infected.toFixed(2)} осіб ({(simulationData.max_infected / modelParams?.n * 100).toFixed(2)}% популяції).</Text>
          <Text style={reportDocumentStyles.text}>• На кінець періоду відновилося {simulationData.final_recovered.toFixed(2)} осіб ({(simulationData.final_recovered / modelParams?.n * 100).toFixed(2)}% популяції).</Text>
          <Text style={reportDocumentStyles.text}>• Базове репродуктивне число R₀ = {simulationData.r0.toFixed(2)}, що {simulationData.r0 > 1 ? "вказує на епідемічне поширення" : "є недостатнім для епідемії"}.</Text>
          <Text style={reportDocumentStyles.text}>• Поріг колективного імунітету HIT = {simulationData.hit.toFixed(2)}.</Text>
        </View>

        <Text style={reportDocumentStyles.footer}>© {new Date().getFullYear()} - Epidemica</Text>
      </Page>
    </Document>
  );
};

export default ReportDocument;
