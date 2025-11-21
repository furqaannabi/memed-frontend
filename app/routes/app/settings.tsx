import { useState } from "react";
import { User, Wallet, Check, Settings2, Link as LinkIcon, ExternalLink } from "lucide-react";
import { useAccount, useDisconnect } from "wagmi";
import { useAuthStore } from "@/store/auth";
import { useNavigate } from "react-router";

export default function Settings() {
  const navigate = useNavigate();
  const { address, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { user } = useAuthStore();

  // No endpoint to update profile, so these are read-only for now
  const [displayName] = useState(user?.address ? `${user.address.slice(0, 6)}...${user.address.slice(-4)}` : "");

  // Get linked social accounts
  const lensAccount = user?.socials?.find((social) => social.type === "LENS");
  const twitterAccount = user?.socials?.find((social) => social.type === "TWITTER");

  const handleDisconnect = () => {
    disconnect();
    navigate("/");
  };

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center bg-neutral-900 py-3 px-2 rounded-md gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-t  from-primary-900 to-black rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              <Settings2 />
            </span>
          </div>
          <h1 className="text-lg font-semibold">Account Overview</h1>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Account Info Section */}
          <div className="space-y-6 bg-neutral-900 rounded-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-gray-400" />
              <h2 className="text-xl font-semibold">Account Information</h2>
            </div>

            <div className="space-y-6">
              {/* Wallet Address */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Wallet Address
                </label>
                <div className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white font-mono text-sm">
                  {address || "Not connected"}
                </div>
              </div>

              {/* Display Name (Read-only) */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Display Name
                </label>
                <div className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-sm">
                  {displayName || "N/A"}
                </div>
              </div>

              {/* Account Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-neutral-800 rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">
                    {user?.token?.length || 0}
                  </div>
                  <div className="text-sm text-neutral-400">Tokens Created</div>
                </div>
                <div className="bg-neutral-800 rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">
                    {user?.socials?.length || 0}
                  </div>
                  <div className="text-sm text-neutral-400">Linked Accounts</div>
                </div>
              </div>

              {/* Info Notice */}
              <div className="bg-blue-500/10 border border-blue-500/30 text-blue-400 p-4 rounded-lg text-sm">
                <p className="mb-2">ℹ️ Profile updates are not available yet.</p>
                <p className="text-xs text-blue-300">
                  Your profile is automatically synced with your wallet and linked accounts.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Wallet & Linked Accounts */}
          <div className="space-y-6">
            {/* Linked Accounts Section */}
            <div className="bg-neutral-900 rounded-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <LinkIcon className="w-5 h-5 text-gray-400" />
                <h2 className="text-xl font-semibold">Linked Accounts</h2>
              </div>

              <div className="space-y-4">
                {/* Lens Account */}
                {lensAccount ? (
                  <div className="bg-neutral-800 rounded-lg p-4 border border-green-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">L</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-white flex items-center gap-2">
                            Lens Protocol
                            <Check className="w-4 h-4 text-green-500" />
                          </h3>
                          <p className="text-gray-400 text-sm">
                            @{lensAccount.username}
                          </p>
                        </div>
                      </div>
                      <a
                        href={`https://lens.xyz/u/${lensAccount.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-400 hover:text-green-300"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    <div className="text-xs text-neutral-500 mt-2">
                      Linked {new Date(lensAccount.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ) : (
                  <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-neutral-700 rounded-full flex items-center justify-center">
                        <span className="text-neutral-500 font-bold text-sm">L</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">Lens Protocol</h3>
                        <p className="text-gray-500 text-sm">Not linked</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Twitter Account (Placeholder for future) */}
                {twitterAccount ? (
                  <div className="bg-neutral-800 rounded-lg p-4 border border-blue-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">𝕏</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-white flex items-center gap-2">
                            Twitter (X)
                            <Check className="w-4 h-4 text-blue-500" />
                          </h3>
                          <p className="text-gray-400 text-sm">
                            @{twitterAccount.username}
                          </p>
                        </div>
                      </div>
                      <a
                        href={`https://twitter.com/${twitterAccount.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    <div className="text-xs text-neutral-500 mt-2">
                      Linked {new Date(twitterAccount.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ) : (
                  <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700 opacity-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-neutral-700 rounded-full flex items-center justify-center">
                        <span className="text-neutral-500 font-bold text-sm">𝕏</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">Twitter (X)</h3>
                        <p className="text-gray-500 text-sm">Coming soon</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-blue-500/10 border border-blue-500/30 text-blue-400 p-3 rounded-lg text-xs">
                  💡 Linked accounts are used during token creation to verify ownership and build trust.
                </div>
              </div>
            </div>

            {/* Wallet Connection Section */}
            <div className="bg-neutral-900 rounded-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <Wallet className="w-5 h-5 text-gray-400" />
                <h2 className="text-xl font-semibold">Wallet Connection</h2>
              </div>

              {/* Primary Wallet */}
              <div className="rounded-lg p-4 space-y-4 bg-neutral-800 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-2">Primary Wallet</h3>
                    <p className="text-gray-400 text-sm font-mono break-all">
                      {address || "Not connected"}
                    </p>
                  </div>
                  {address && (
                    <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium ml-3">
                      Connected
                    </div>
                  )}
                </div>
              </div>

              {/* Network */}
              <div className="rounded-lg p-4 space-y-4 bg-neutral-800 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white">Network</h3>
                    <p className="text-gray-400 text-sm">
                      {chain?.name || "Unknown Network"}
                    </p>
                  </div>
                  {chain && (
                    <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Active
                    </div>
                  )}
                </div>
              </div>

              {/* Account Created */}
              {user?.createdAt && (
                <div className="rounded-lg p-4 bg-neutral-800 mb-4">
                  <h3 className="font-semibold text-white mb-1">Member Since</h3>
                  <p className="text-gray-400 text-sm">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}

              {/* Disconnect Button */}
              <div className="pt-4">
                <button
                  onClick={handleDisconnect}
                  className="w-full cursor-pointer border border-red-600 text-red-400 px-4 py-3 rounded-md font-semibold hover:bg-red-600/20 transition-colors"
                >
                  Disconnect Wallet
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
