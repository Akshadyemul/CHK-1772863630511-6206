const express = require("express");
const axios = require("axios");
const History = require("../models/History");
console.log("MedicineRoutes file loaded");

const router = express.Router();

function pickFirstString(arr) {
  if (!Array.isArray(arr)) return null;
  for (const v of arr) {
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return null;
}

function toSideEffectsArray(textOrArray) {
  const out = [];
  if (Array.isArray(textOrArray)) {
    for (const t of textOrArray) {
      if (typeof t === "string" && t.trim()) out.push(t.trim());
    }
  } else if (typeof textOrArray === "string" && textOrArray.trim()) {
    const parts = textOrArray
      .split(/[\r\n]+|(?:\.\s+)/)
      .map((p) => p.trim())
      .filter(Boolean);
    out.push(...parts);
  }
  if (!out.length) {
    return ["Information not available"];
  }
  return out;
}

router.get("/test", (req, res) => {
  res.send("Medicine route working");
});

router.get("/search/:name", async (req, res) => {

  const medicineName = req.params.name;
  console.log("[/api/medicine/search] name param =", medicineName);

  try {

    const q = String(medicineName || "").trim();
    if (!q) {
      return res.status(400).json({ message: "Medicine name is required" });
    }

    // Use a simple search term to avoid malformed queries; let FDA match across fields.
    const url = `https://api.fda.gov/drug/label.json?search=${encodeURIComponent(
      q
    )}&limit=1`;
    console.log("[/api/medicine/search] FDA URL =", url);

    const response = await axios.get(url);

    console.log(
      "[/api/medicine/search] FDA status =",
      response.status,
      "keys =",
      Object.keys(response.data || {})
    );

    const results = response.data && Array.isArray(response.data.results)
      ? response.data.results
      : [];
    console.log("[/api/medicine/search] FDA results length =", results.length);

    if (!results.length) {
      console.log("[/api/medicine/search] no FDA results for", q);
      return res.status(404).json({ message: "Medicine information not found" });
    }

    const label = results[0] || {};
    const openfda = label.openfda || {};

    const brand = pickFirstString(openfda.brand_name);
    const generic = pickFirstString(openfda.generic_name);
    const productType = pickFirstString(openfda.product_type);

    const INDICATIONS_FIELDS = [
      "indications_and_usage",
      "indication_and_usage",
      "purpose",
      "description",
    ];
    const DOSAGE_FIELDS = [
      "dosage_and_administration",
      "dosage",
      "dosage_and_use",
    ];
    const WARNINGS_FIELDS = [
      "warnings_and_cautions",
      "warnings",
      "boxed_warning",
      "contraindications",
    ];

    function pickField(fields) {
      for (const f of fields) {
        const value = pickFirstString(label[f]);
        if (value) return value;
      }
      return null;
    }

    const structured = {
      name: brand || generic || productType || medicineName || "Information not available",
      usage: pickField(INDICATIONS_FIELDS) || "Information not available",
      dosage: pickField(DOSAGE_FIELDS) || "Information not available",
      sideEffects: toSideEffectsArray(
        label.adverse_reactions || label["adverse_reactions"] || label["adverse_reactions_table"]
      ),
      warnings: pickField(WARNINGS_FIELDS) || "Information not available",
    };

    // Save search history (fire-and-forget; errors are logged but do not break the response)
    try {
      await History.create({
        medicineName: structured.name,
        searchType: "search",
        date: new Date(),
        medicineData: structured,
        source: "search",
      });
    } catch (historyError) {
      console.error("Failed to save search history:", historyError.message);
    }

    console.log("[/api/medicine/search] structured response =", structured);
    res.json(structured);

  } catch (error) {

    if (error.response) {
      const status = error.response.status;
      console.log(
        "[/api/medicine/search] FDA error status =",
        status,
        "data =",
        error.response.data
      );
      // For any 4xx from FDA, treat as "not found" for the user
      if (status >= 400 && status < 500) {
        return res.status(404).json({ message: "Medicine information not found" });
      }
    }

    console.error(
      "Error fetching medicine from FDA API:",
      error.message,
      "status =",
      error.response?.status,
      "data =",
      error.response?.data
    );
    res.status(500).json({ message: "Failed to fetch medicine information" });

  }

});

router.get("/barcode/:code", async (req, res) => {

  const rawCode = req.params.code;
  const barcode = typeof rawCode === "string" ? rawCode.trim() : "";

  if (!barcode) {
    return res.status(400).json({
      barcode: "",
      message: "Barcode is required.",
    });
  }

  try {

    // Try to search medicine using the barcode (assumed NDC) in openFDA product/package NDC fields
    const fdaSearch = `openfda.package_ndc:"${barcode}"+OR+openfda.product_ndc:"${barcode}"`;
    const url = `https://api.fda.gov/drug/label.json?search=${encodeURIComponent(
      fdaSearch
    )}&limit=1`;

    const response = await axios.get(url);

    const results = response.data && Array.isArray(response.data.results)
      ? response.data.results
      : [];

    if (!results.length) {
      return res.status(200).json({
        barcode,
        message: "Medicine not found for this barcode. Please search medicine name.",
      });
    }

    const label = results[0] || {};
    const openfda = label.openfda || {};

    const brand = pickFirstString(openfda.brand_name);
    const generic = pickFirstString(openfda.generic_name);
    const productType = pickFirstString(openfda.product_type);

    const INDICATIONS_FIELDS = [
      "indications_and_usage",
      "indication_and_usage",
      "purpose",
      "description",
    ];
    const DOSAGE_FIELDS = [
      "dosage_and_administration",
      "dosage",
      "dosage_and_use",
    ];
    const WARNINGS_FIELDS = [
      "warnings_and_cautions",
      "warnings",
      "boxed_warning",
      "contraindications",
    ];

    function pickField(fields) {
      for (const f of fields) {
        const value = pickFirstString(label[f]);
        if (value) return value;
      }
      return null;
    }

    const structured = {
      name: brand || generic || productType || "Information not available",
      usage: pickField(INDICATIONS_FIELDS) || "Information not available",
      dosage: pickField(DOSAGE_FIELDS) || "Information not available",
      sideEffects: toSideEffectsArray(
        label.adverse_reactions || label["adverse_reactions"] || label["adverse_reactions_table"]
      ),
      warnings: pickField(WARNINGS_FIELDS) || "Information not available",
    };

    return res.json({
      barcode,
      medicine: structured,
    });

  } catch (error) {

    if (error.response && error.response.status === 404) {
      return res.status(200).json({
        barcode,
        message: "Medicine not found for this barcode. Please search medicine name.",
      });
    }

    console.error("Error fetching medicine by barcode from FDA API:", error.message);
    return res.status(500).json({
      barcode,
      message: "An error occurred while looking up this barcode.",
    });

  }

});

module.exports = router;