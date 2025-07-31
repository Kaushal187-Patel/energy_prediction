import React, { useState } from "react";

const initialForm = {
  "Outdoor Temperature (°C)": "",
  "Household Size": "",
  // Add other numeric features as needed
};

type PredictionResult = {
  linear_regression: number;
  knn: number;
};

export default function EnergyPredictor() {
  const [form, setForm] = useState<typeof initialForm>(initialForm);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(
            Object.entries(form).map(([k, v]) => [k, Number(v)])
          ),
        }),
      });
      const data = await res.json();
      if (res.ok) setResult(data);
      else setError(data.error || "Prediction failed");
    } catch (err) {
      setError("Could not connect to prediction API.");
    }
  };

  return (
    <div>
      <h2>Energy Prediction</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Outdoor Temperature (°C):
          <input
            type="number"
            name="Outdoor Temperature (°C)"
            value={form["Outdoor Temperature (°C)"]}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Household Size:
          <input
            type="number"
            name="Household Size"
            value={form["Household Size"]}
            onChange={handleChange}
            required
          />
        </label>
        {/* Add more fields for other numeric features if needed */}
        <br />
        <button type="submit">Predict</button>
      </form>
      {result && (
        <div>
          <h3>Predictions</h3>
          <p>Linear Regression: {result.linear_regression}</p>
          <p>KNN: {result.knn}</p>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
