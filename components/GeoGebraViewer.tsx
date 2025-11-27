import React from 'react';

interface GeoGebraViewerProps {
  command: string;
}

const GeoGebraViewer: React.FC<GeoGebraViewerProps> = ({ command }) => {
  // We use the GeoGebra Classic web app with the 'command' parameter.
  // We encode the command to ensure it passes correctly in the URL.
  const encodedCommand = encodeURIComponent(command);
  const iframeSrc = `https://www.geogebra.org/classic?command=${encodedCommand}&showToolBar=false&showAlgebraInput=false&showMenuBar=false`;

  return (
    <div className="w-full h-[400px] bg-white rounded-xl border border-indigo-200 overflow-hidden shadow-inner my-6">
      <div className="bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-600 border-b border-indigo-100 flex justify-between items-center">
        <span>INTERACTION MATHÉMATIQUE</span>
        <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-indigo-200">Powered by GeoGebra</span>
      </div>
      <iframe
        title="GeoGebra Visualization"
        src={iframeSrc}
        width="100%"
        height="100%"
        style={{ border: 'none' }}
        allowFullScreen
      />
    </div>
  );
};

export default GeoGebraViewer;