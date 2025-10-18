import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface EmbedCodeSectionProps {
  embedId?: string | undefined | null;
}

export const EmbedCodeSection: React.FC<EmbedCodeSectionProps> = ({
  embedId,
}) => {
  const [copied, setCopied] = useState(false);
  const handleShare = async () => {
    try {
      const embedCode = `<script src="flint-form.js"></script>\n<div id="${embedId}"></div>`;
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy Embed Code:", err);
    }
  };
  return embedId ? (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-semibold text-green-900 mb-1">
            Share Your Contest Form
          </h3>
          <p className="text-xs text-green-700">
            Use the embed code below to integrate your contest form:
          </p>
        </div>

        <div className="bg-white border border-green-300 rounded-lg p-3 space-y-3">
          {/* Embed ID Only */}
          {/* <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-xs font-medium text-gray-700">Embed ID</label>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(embedId)
                                  alert('Embed ID copied to clipboard!')
                                }}
                                className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors font-medium"
                              >
                                Copy ID
                              </button>
                            </div>
                            <code className="block text-xs font-mono bg-gray-50 p-2 rounded border border-gray-200 text-gray-700 break-all">
                              {embedId}
                            </code>
                          </div> */}

          {/* Full Embed Code */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-gray-700">
                Full Embed Code
              </label>
              <button
                onClick={handleShare}
                className="px-2 py-1 text-xs rounded transition-colors font-medium bg-green-600 text-white hover:bg-green-700 flex items-center justify-center gap-1"
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy Embed Code
                  </>
                )}
              </button>
            </div>
            <code className="block text-xs font-mono bg-gray-50 p-2 rounded border border-gray-200 text-gray-700 whitespace-pre overflow-x-auto">
              {`<script src="flint-form.js"></script>\n<div id="${embedId}"></div>`}
            </code>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded p-2">
          <p className="text-xs text-blue-800">
            <strong>💡 Tip:</strong> Copy the full embed code and paste it into
            your website.
          </p>
        </div>
      </div>
    </div>
  ) : (
    <div>
      <p className="text-center text-green-500 p-4 border border-green-200 bg-green-50">
        Embed code will be generated after the form is created.
      </p>
    </div>
  );
};
