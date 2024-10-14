import { useEffect, useState } from "react";
import "./App.css";
import EnergyConsumptionTrends from "./Components/EnergyConsumptionTrends";
import SectorImpactRelevance from "./Components/SectorImpactRelevance";
import RiskLikelihood from "./Components/RiskLikelihoodAssessment";
import TimeBasedTrends from "./Components/TimeBasedTrends";
import axios from "axios";

function App() {
  // State for data
  const [state, setState] = useState([]);
  const [sector, setSector] = useState([]);
  const [risk, setRisk] = useState([]);
  const [source, setSource] = useState([]);
  const [analysis, setAnalysis] = useState([]);
  const [gio, setGio] = useState([]);
  const [trends, setTrends] = useState([]);

  // State for global filters
  const [filters, setFilters] = useState({
    // year: "",
    sector: "",
  });

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const energyData = await axios.get("http://localhost:5000/get-energy-consumption-trends");
        const sectorData = await axios.get("http://localhost:5000/get-sector-impact-data");
        const riskData = await axios.get("http://localhost:5000/get-risk-likelihood");
        const sourceData = await axios.get("http://localhost:5000/get-source-distribution");
        const analysisData = await axios.get("http://localhost:5000/get-pastel-analysis");
        const gioData = await axios.get("http://localhost:5000/get-gio-insights");
        const trendsData = await axios.get("http://localhost:5000/get-time-based-trends");

        setState(energyData.data);
        setSector(sectorData.data);
        setRisk(riskData.data);
        setSource(sourceData.data);
        setAnalysis(analysisData.data);
        setGio(gioData.data);
        setTrends(trendsData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Extract unique values for dropdowns
  const getUniqueValues = (array, key) => {
    return [...new Set(array.map((item) => item[key]))];
  };

  const uniqueYears = getUniqueValues(state, "end_year");
  const uniqueTopics = getUniqueValues(state, "topic");
  const uniqueSectors = getUniqueValues(state, "sector");
  const uniqueRegions = getUniqueValues(state, "region");
  const uniqueCountries = getUniqueValues(state, "country");
  const uniqueCities = getUniqueValues(state, "city");
  const uniquePestleFactors = getUniqueValues(analysis, "pestle");
  const uniqueSwot = getUniqueValues(state, "swot");
  const uniqueSources = getUniqueValues(source, "source");

  // Filtered data based on selected filters
  const filteredState = state.filter((item) => 
    (!filters.year || item.end_year === filters.year) &&
    (!filters.topic || item.topic === filters.topic) &&
    (!filters.sector || item.sector === filters.sector) &&
    (!filters.region || item.region === filters.region) &&
    (!filters.country || item.country === filters.country) &&
    (!filters.city || item.city === filters.city) &&
    (!filters.swot || item.swot === filters.swot)
  );

  const filteredRisk = risk.filter((item) => 
    !filters.source || item.likelihood === filters.source
  );

  const filteredSource = source.filter((item) => 
    !filters.source || item.source === filters.source
  );

  const filteredPestle = analysis.filter((item) => 
    !filters.pestle || item.pestle === filters.pestle
  );

  return (
    <>
      <div className="container">
        

        {/* Filter for Energy Consumption Trends */}
        <div className="text-center w-100 p-5 mb-4 border">
          <h3>Energy Consumption Trends Over Time</h3>
          {Object.keys(filters).map((key) => (
              <select
                key={key}
                className="form-select w-25"
                value={filters[key]}
                onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
              >
                <option value="">All {key.charAt(0).toUpperCase() + key.slice(1)}</option>
                {getUniqueValues(state, key).map((value, index) => (
                  <option key={index} value={value}>{value}</option>
                ))}
              </select>
            ))}
          <EnergyConsumptionTrends data={filteredState} />
        </div>

        {/* Filter for Sector Impact Relevance */}
        <div className="text-center mb-4 border">
          <h1>Sector Impact vs. Relevance</h1>
          <SectorImpactRelevance data={sector} />
        </div>

        {/* Filter for Risk Likelihood */}
        <div className="text-center mb-4 border">
          <h1>Risk and Likelihood Assessment</h1>
          <RiskLikelihood data={filteredRisk} />
        </div>


        {/* Time-Based Trends */}
        <div className="text-center mb-4 border">
          <h1>Time-Based Trends</h1>
          <TimeBasedTrends data={trends} />
        </div>
      </div>
    </>
  );
}

export default App;