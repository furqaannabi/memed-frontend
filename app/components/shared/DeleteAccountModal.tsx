import { useState } from "react";
import { AlertTriangle, X, Trash2 } from "lucide-react";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

/**
 * DeleteAccountModal Component
 *
 * Confirmation dialog for account deletion with clear warnings.
 * Requires user to type "DELETE" to confirm action.
 *
 * Features:
 * - Two-step confirmation (checkbox + text input)
 * - Clear warnings about what gets deleted
 * - Blockchain data preservation notice
 * - Disabled confirm button until user types "DELETE"
 */
export default function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteAccountModalProps) {
  const [confirmText, setConfirmText] = useState("");
  const [acknowledgeBlockchain, setAcknowledgeBlockchain] = useState(false);

  // Reset state when modal closes
  const handleClose = () => {
    setConfirmText("");
    setAcknowledgeBlockchain(false);
    onClose();
  };

  // Check if user has completed all confirmation steps
  const canConfirm =
    confirmText === "DELETE" && acknowledgeBlockchain && !isDeleting;

  const handleConfirm = () => {
    if (canConfirm) {
      onConfirm();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-neutral-900 rounded-xl max-w-lg w-full p-6 border border-neutral-700 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Delete Account</h2>
              <p className="text-sm text-neutral-400">
                This action cannot be undone
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isDeleting}
            className="text-neutral-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Content */}
        <div className="space-y-4 mb-6">
          {/* What Gets Deleted */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <h3 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              What Will Be Deleted
            </h3>
            <ul className="text-sm text-neutral-300 space-y-1">
              <li>• Account information & credentials</li>
              <li>• Username and profile details</li>
              <li>• Linked social accounts (Lens, Twitter, Instagram)</li>
              <li>• Meme uploads and platform interactions</li>
              <li>• Analytics and session logs</li>
            </ul>
          </div>

          {/* Blockchain Data Warning */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <h3 className="text-yellow-400 font-semibold mb-2">
              ⚠️ Blockchain Data Cannot Be Deleted
            </h3>
            <p className="text-sm text-neutral-300 mb-2">
              The following data is permanently stored on the blockchain and
              <strong className="text-white"> cannot be removed</strong>:
            </p>
            <ul className="text-sm text-neutral-300 space-y-1">
              <li>• Tokens you earned or received</li>
              <li>• On-chain transactions</li>
              <li>• NFT mint/burn events</li>
              <li>• Trade history</li>
            </ul>
          </div>

          {/* Blockchain Acknowledgment Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={acknowledgeBlockchain}
              onChange={(e) => setAcknowledgeBlockchain(e.target.checked)}
              disabled={isDeleting}
              className="mt-1 w-4 h-4 rounded border-neutral-600 bg-neutral-800 text-red-500 focus:ring-red-500 focus:ring-offset-0 disabled:opacity-50 cursor-pointer"
            />
            <span className="text-sm text-neutral-300">
              I understand that blockchain data cannot be deleted and will
              remain permanently on-chain
            </span>
          </label>

          {/* Confirmation Input */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Type <span className="text-red-500 font-bold">DELETE</span> to
              confirm:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
              disabled={isDeleting}
              placeholder="Type DELETE here"
              className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {isDeleting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Deleting...
              </span>
            ) : (
              "Delete Account Permanently"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
