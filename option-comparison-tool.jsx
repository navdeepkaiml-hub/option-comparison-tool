import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Download } from "lucide-react";
import jsPDF from "jspdf";

// ---------------- DATA LAYER ----------------
const SERVICES = {
  Cloud: [
    {
      name: "AWS",
      cost: 3,
      scalability: 5,
      learningCurve: 2,
      ecosystem: 5,
      pros: ["Highly scalable", "Largest service catalog"],
      cons: ["Complex pricing", "Steep learning curve"],
    },
    {
      name: "Azure",
      cost: 3,
      scalability: 5,
      learningCurve: 3,
      ecosystem: 4,
      pros: ["Enterprise ready", "Microsoft integration"],
      cons: ["UI complexity"],
    },
    {
      name: "GCP",
      cost: 4,
      scalability: 5,
      learningCurve: 3,
      ecosystem: 3,
      pros: ["Strong AI & data tools"],
      cons: ["Smaller ecosystem"],
    },
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

// ---------------- UTILS ----------------
const calculateScore = (item, weights) =>
  Object.keys(weights).reduce((sum, key) => sum + item[key] * weights[key], 0);

// ---------------- COMPONENT ----------------
export default function AdvancedComparisonTool() {
  const [category, setCategory] = useState("Cloud");
  const [weights, setWeights] = useState({
    cost: 1,
    scalability: 1,
    learningCurve: 1,
    ecosystem: 1,
  });

  const scoredData = SERVICES[category].map((item) => ({
    ...item,
    score: calculateScore(item, weights),
  }));

  const best = [...scoredData].sort((a, b) => b.score - a.score)[0];

  // ---------------- PDF EXPORT ----------------
  const exportPDF = () => {
    const pdf = new jsPDF();
    pdf.text(`Decision Summary – ${category}`, 10, 10);

    scoredData.forEach((item, i) => {
      pdf.text(
        `${item.name} | Score: ${item.score}`,
        10,
        20 + i * 10
      );
    });

    pdf.text(`Recommended: ${best.name}`, 10, 70);
    pdf.save("decision-summary.pdf");
  };

  return (
    <div className="p-6 grid gap-6">
      <h1 className="text-3xl font-bold">Decision Comparison Engine</h1>

      {/* CATEGORY SELECT */}
      <div className="flex gap-2">
        {Object.keys(SERVICES).map((cat) => (
          <Button key={cat} onClick={() => setCategory(cat)}>
            {cat}
          </Button>
        ))}
      </div>

      {/* WEIGHTS */}
      <Card className="rounded-2xl">
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-2">Set Your Priorities</h2>
          {Object.keys(weights).map((key) => (
            <div key={key} className="flex items-center gap-2 mb-2">
              <label className="w-32 capitalize">{key}</label>
              <input
                type="range"
                min="0"
                max="5"
                value={weights[key]}
                onChange={(e) =>
                  setWeights({ ...weights, [key]: Number(e.target.value) })
                }
              />
              <span>{weights[key]}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* RESULTS */}
      <div className="grid md:grid-cols-3 gap-4">
        {scoredData.map((item) => (
          <Card key={item.name} className="rounded-2xl shadow-md">
            <CardContent className="p-4">
              <h3 className="text-xl font-semibold">{item.name}</h3>
              <p className="font-bold">Score: {item.score}</p>

              {item.name === best.name ? (
                <p className="text-green-600 font-semibold">✔ Best Match</p>
              ) : (
                <p className="text-gray-400">Trade-offs exist</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* PDF EXPORT */}
      <Button className="w-fit" onClick={exportPDF}>
        <Download className="mr-2" /> Export Decision PDF
      </Button>
    </div>
  );
}
