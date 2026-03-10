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
import { Colors } from "../constants/theme";
import { scanBarcode } from "../services/api";
import { addHistoryItem } from "../services/historyService";

const NOT_FOUND_MESSAGE = "Medicine not found. Please search medicine name.";

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
          setError("");
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
        setMedicine(null);
        setError(e?.message || NOT_FOUND_MESSAGE);
        setNotFoundMessage("");
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
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.statusText}>Requesting camera permission…</Text>
          </View>
        ) : hasPermission === false ? (
          <View style={styles.center}>
            <Text style={styles.errorText}>
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

          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Looking up product…</Text>
            </View>
          ) : null}

          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

          {!loading && notFoundMessage ? (
            <View style={styles.notFoundWrap}>
              <Text style={styles.errorText}>{NOT_FOUND_MESSAGE}</Text>
              <LargeButton
                title="Search Medicine Name"
                variant="secondary"
                onPress={() => router.push("/screens/SearchMedicineScreen")}
                accessibilityLabel="Search medicine by name"
              />
            </View>
          ) : null}

          {medicine ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                {getMedicineTitle(medicine) || "Product found"}
              </Text>
              {medicine.brand ? (
                <Text style={styles.cardBrand}>Brand: {medicine.brand}</Text>
              ) : null}
              <LargeButton
                title="View Details"
                onPress={() =>
                  router.push({
                    pathname: "/screens/MedicineDetailsScreen",
                    params: { medicine: JSON.stringify(medicine) },
                  })
                }
                accessibilityLabel="View full medicine details"
              />
            </View>
          ) : null}

          {scanned && !loading ? (
            <LargeButton
              title="Scan Again"
              onPress={resetScan}
              accessibilityLabel="Scan another barcode"
            />
          ) : null}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 8,
  },
  body: {
    fontSize: 20,
    color: Colors.textMuted,
    lineHeight: 28,
    marginBottom: 12,
  },
  cameraWrap: {
    height: 320,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: Colors.border,
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
    color: Colors.text,
    marginBottom: 8,
  },
  hint: {
    fontSize: 18,
    color: Colors.textMuted,
    marginBottom: 8,
  },
  loadingWrap: {
    marginTop: 12,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: Colors.textMuted,
    fontWeight: "600",
  },
  errorText: {
    marginTop: 12,
    fontSize: 18,
    color: Colors.error,
    lineHeight: 26,
    fontWeight: "600",
  },
  notFoundWrap: {
    marginTop: 12,
  },
  center: { paddingVertical: 16 },
  statusText: {
    marginTop: 10,
    fontSize: 18,
    color: Colors.textMuted,
  },
  card: {
    marginTop: 12,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 18,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 6,
  },
  cardBrand: {
    fontSize: 18,
    color: Colors.textMuted,
    marginBottom: 16,
    fontWeight: "600",
  },
});
