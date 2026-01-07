import { useState } from "react";
import { exportAllData, importData } from "../utils/storage";

const DataManager = () => {
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importText, setImportText] = useState("");
  const [message, setMessage] = useState("");

  const handleExport = () => {
    const data = exportAllData();
    if (data) {
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `meal-tracker-backup-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setMessage("Data exported successfully!");
      setTimeout(() => setMessage(""), 3000);
    } else {
      setMessage("Failed to export data");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleImport = () => {
    const success = importData(importText);
    if (success) {
      setMessage(
        "Data imported successfully! Refresh the page to see changes."
      );
      setImportText("");
      setShowImportDialog(false);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      setMessage("Failed to import data. Please check the format.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImportText(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="mb-6 bg-white rounded-lg shadow-lg border-2 border-orange-800 p-6">
      <h2 className="text-2xl font-bold text-orange-800 mb-4 text-center">
        Data Management
      </h2>

      {message && (
        <div className="mb-4 p-3 bg-blue-100 border-2 border-blue-400 rounded text-center text-blue-800">
          {message}
        </div>
      )}

      <div className="flex gap-4 justify-center">
        <button
          onClick={handleExport}
          className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-700 focus:ring-2 focus:ring-orange-400 transition-all duration-300 border-2 border-orange-800"
        >
          💾 Export Data
        </button>

        <button
          onClick={() => setShowImportDialog(!showImportDialog)}
          className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-700 focus:ring-2 focus:ring-orange-400 transition-all duration-300 border-2 border-orange-800"
        >
          📥 Import Data
        </button>
      </div>

      {showImportDialog && (
        <div className="mt-4 p-4 bg-orange-50 rounded border-2 border-orange-200">
          <h3 className="font-semibold text-orange-800 mb-2">Import Data</h3>
          <p className="text-sm text-gray-600 mb-3">
            Upload a JSON backup file or paste JSON data below:
          </p>

          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="mb-3 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-2
              file:border-orange-600
              file:text-sm file:font-semibold
              file:bg-orange-100 file:text-orange-700
              hover:file:bg-orange-200"
          />

          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="Or paste JSON data here..."
            className="w-full p-2 border-2 border-orange-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 h-32"
          />

          <div className="flex gap-2 mt-3">
            <button
              onClick={handleImport}
              disabled={!importText}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
            >
              Import
            </button>
            <button
              onClick={() => {
                setShowImportDialog(false);
                setImportText("");
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataManager;
