import { BarCodeScanner } from "expo-barcode-scanner";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useRouter } from "expo-router";
import { LargeButton } from "../components/LargeButton";
import { scanBarcode } from "../services/api";
import { addHistoryItem } from "../services/historyService";

function getMedicineTitle(medicine) {
  if (!medicine) return "";
  return (
    medicine.name ||
    medicine.medicineName ||
    medicine.brandName ||
    medicine.genericName ||
    medicine.title ||
    ""
  );
}

export default function ScanQR() {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [barcodeValue, setBarcodeValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [medicine, setMedicine] = useState(null);
  const [notFoundMessage, setNotFoundMessage] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      if (mounted) setHasPermission(status === "granted");
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleBarCodeScanned = useCallback(
    async ({ data }) => {
      if (scanned) return;
      const value = String(data ?? "").trim();
      if (!value) return;

      setScanned(true);
      setBarcodeValue(value);
      setLoading(true);
      setError("");
      setMedicine(null);
      setNotFoundMessage("");
      try {
        const data = await scanBarcode(value);

        if (data?.medicine) {
          const med = data.medicine;
          setMedicine(med);
          setNotFoundMessage("");
          await addHistoryItem({
            medicineName: getMedicineTitle(med) || value,
            medicineData: med,
            source: "scan",
          });
        } else {
          setMedicine(null);
          setNotFoundMessage(
            data?.message ||
              "Medicine not found for this barcode. Please search medicine name.",
          );
        }
      } catch (e) {
        setError(e?.message || "Could not find medicine for this barcode.");
      } finally {
        setLoading(false);
      }
    },
    [scanned],
  );

  function resetScan() {
    setScanned(false);
    setBarcodeValue("");
    setError("");
    setMedicine(null);
    setNotFoundMessage("");
    setLoading(false);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Scan Barcode</Text>
        <Text style={styles.body}>
          Place the medicine barcode inside the square box. Hold steady until it
          scans.
        </Text>

        {hasPermission === null ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#1E88E5" />
            <Text style={styles.statusText}>Requesting camera permission…</Text>
          </View>
        ) : hasPermission === false ? (
          <View style={styles.center}>
            <Text style={styles.error}>
              Camera permission is required to scan barcodes. Please enable it
              in your phone settings.
            </Text>
          </View>
        ) : (
          <View style={styles.cameraWrap}>
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.overlay}>
              <View style={styles.scanBox} />
            </View>
          </View>
        )}

        <ScrollView contentContainerStyle={styles.results}>
          {barcodeValue ? (
            <Text style={styles.barcodeText}>Scanned: {barcodeValue}</Text>
          ) : (
            <Text style={styles.hint}>No barcode scanned yet.</Text>
          )}

          {loading ? <ActivityIndicator size="large" color="#1E88E5" /> : null}
          {error ? <Text style={styles.error}>{error}</Text> : null}

          {!loading && notFoundMessage ? (
            <>
              <Text style={styles.error}>{notFoundMessage}</Text>
              <LargeButton
                title="Search Medicine Name"
                variant="secondary"
                onPress={() => router.push("/screens/SearchMedicineScreen")}
              />
            </>
          ) : null}

          {medicine ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                {getMedicineTitle(medicine) || "Medicine found"}
              </Text>
              <Text style={styles.cardBody}>
                {JSON.stringify(medicine, null, 2)}
              </Text>
              <LargeButton
                title="Open Details"
                onPress={() =>
                  router.push({
                    pathname: "/screens/MedicineDetailsScreen",
                    params: { medicine: JSON.stringify(medicine) },
                  })
                }
              />
            </View>
          ) : null}

          {scanned ? (
            <LargeButton title="Scan Again" onPress={resetScan} />
          ) : null}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F6F8FB" },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: "800", color: "#0B2D4D", marginBottom: 8 },
  body: { fontSize: 20, color: "#2B4A66", lineHeight: 28, marginBottom: 12 },
  cameraWrap: {
    height: 320,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#D6E1EC",
    backgroundColor: "#000000",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  scanBox: {
    width: 220,
    height: 220,
    borderRadius: 18,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  results: {
    paddingTop: 14,
    paddingBottom: 20,
  },
  barcodeText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0B2D4D",
    marginBottom: 8,
  },
  hint: { fontSize: 18, color: "#2B4A66", marginBottom: 8 },
  error: { marginTop: 8, fontSize: 18, color: "#B00020", lineHeight: 24 },
  center: { paddingVertical: 16 },
  statusText: { marginTop: 10, fontSize: 18, color: "#2B4A66" },
  card: {
    marginTop: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#D6E1EC",
    borderRadius: 16,
    padding: 14,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0B2D4D",
    marginBottom: 8,
  },
  cardBody: {
    fontSize: 16,
    color: "#2B4A66",
    lineHeight: 22,
    marginBottom: 12,
  },
});
