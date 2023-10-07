import React from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import {
  defaultLayoutPlugin,
  toolbarPlugin,
} from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export const PdfViewer = ({ fileUrl }) => {
  const transform = (slot) => ({
    ...slot,
    Download: () => <></>,
    DownloadMenuItem: () => <></>,
    Print: () => <></>,
    PrintMenuItem: () => <></>,
    Open: () => <></>,
    OpenMenuItem: () => <></>,
    ShowProperties: () => <></>,
    ShowPropertiesMenuItem: () => <></>,
    SwitchSelectionMode: () => <></>,
    SwitchSelectionModeMenuItem: () => <></>,
  });
  const renderToolbar = (Toolbar) => (
    <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>
  );
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => [defaultTabs[0], defaultTabs[1]],
    renderToolbar,
  });
  const { renderDefaultToolbar } = defaultLayoutPluginInstance.toolbarPluginInstance;

  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
      <div style={{ height: "100%", width: "100%" }}>
        <Viewer
          fileUrl={fileUrl}
          plugins={[defaultLayoutPluginInstance]}
          theme="dark"
        />
      </div>
    </Worker>
  );
};
