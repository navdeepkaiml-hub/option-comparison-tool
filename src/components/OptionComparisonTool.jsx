import { useState } from "react";
import jsPDF from "jspdf";

const SERVICES = {
  Cloud: [
    { name: "AWS", cost: 3, scalability: 5, learningCurve: 2, ecosystem: 5 },
    { name: "Azure", cost: 3, scalability: 5, learningCurve: 3, ecosystem: 4 },
    { name: "GCP", cost: 4, scalability: 5, learningCurve: 3, ecosystem: 3 },
  ],
  Database: [
    { name: "MySQL", cost: 5, scalability: 3, learningCurve: 5, ecosystem: 5 },
    { name: "PostgreSQL", cost: 5, scalability: 4, learningCurve: 4, ecosystem: 5 },
    { name: "MongoDB", cost: 4, scalability: 5, learningCurve: 4, ecosystem: 4 },
  ],
  Framework: [
    { name: "React", cost: 5, scalability: 5, learningCurve: 3, ecosystem: 5 },
    { name: "Angular", cost: 4, scalability: 5, learningCurve: 2, ecosystem: 4 },
    { name: "Vue", cost: 5, scalability: 4, learningCurve: 5, ecosystem: 4 },
  ],
};

export default function OptionComparisonTool() {
  const [category, setCategory] = useState("Cloud");
  const [weights, setWeights] = useState({
    cost: 1,
    scalability: 1,
    learningCurve: 1,
    ecosystem: 1,
  });

  const scored = SERVICES[category].map((item) => {
    const score =
      item.cost * weights.cost +
      item.scalability * weights.scalability +
      item.learningCurve * weights.learningCurve +
      item.ecosystem * weights.ecosystem;

    return { ...item, score };
  });

  const best = [...scored].sort((a, b) => b.score - a.score)[0];

  const exportPDF = () => {
    const pdf = new jsPDF();
    pdf.text(`Decision Comparison Engine – ${category}`, 10, 10);

    scored.forEach((item, i) => {
      pdf.text(`${item.name} — Score: ${item.score}`, 10, 25 + i * 10);
    });

    pdf.text(`Best Choice: ${best.name}`, 10, 70);
    pdf.save("decision.pdf");
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Decision Comparison Engine</h1>

      {/* CATEGORY BUTTONS */}
      <div style={{ marginBottom: 20 }}>
        {Object.keys(SERVICES).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{ marginRight: 10 }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* WEIGHTS */}
      <h2>Set Priorities</h2>
      {Object.keys(weights).map((key) => (
        <div key={key}>
          {key}:
          <input
            type="range"
            min="0"
            max="5"
            value={weights[key]}
            onChange={(e) =>
              setWeights({ ...weights, [key]: Number(e.target.value) })
            }
          />
          {weights[key]}
        </div>
      ))}

      {/* RESULTS */}
      <h2>Results</h2>
      {scored.map((item) => (
        <div key={item.name}>
          {item.name} — Score: {item.score}
          {item.name === best.name && " ✔ Best"}
        </div>
      ))}

      <br />
      <button onClick={exportPDF}>Export PDF</button>
    </div>
  );
}
