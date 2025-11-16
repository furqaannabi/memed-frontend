import { useState } from "react";
import { ChevronLeft, User, Wallet, Check, Settings2 } from "lucide-react";

export default function Settings() {
  const [lensHandle, setLensHandle] = useState("@memegod");
  const [displayName, setDisplayName] = useState("Meme God");
  const [bio, setBio] = useState("");
  const [isConnected, setIsConnected] = useState(true);

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
          {/* Profile Setting Section */}
          <div className="space-y-6 bg-neutral-900 rounded-md p-2  py-4">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-gray-400" />
              <h2 className="text-xl font-semibold">Profile Setting</h2>
            </div>

            <div className="space-y-6">
              <div className="grid lg:grid-cols-2 items-center gap-3 mb-6">
                {/* Lens Handle */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Lens Handle
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={lensHandle}
                      onChange={(e) => setLensHandle(e.target.value)}
                      className="w-full px-4 py-3  border border-neutral-700 rounded-lg focus:outline-none  text-white"
                      placeholder="@username"
                    />
                  </div>
                </div>
                {/* Display Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-3  border border-neutral-700 rounded-lg focus:outline-none  text-white"
                    placeholder="Your display name"
                  />
                </div>
              </div>
              <div className=" flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-xs text-green-500">Verified on Lens</span>
              </div>
              {/* Bio */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3  border border-neutral-700 rounded-lg focus:outline-none  text-white resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
              {/* Update Button */}
              <div className="flex justify-end ">
                <button className="bg-white cursor-pointer text-gray-900 px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition-colors">
                  Update Profile
                </button>
              </div>
            </div>
          </div>

          {/* Wallet Connection Section */}
          <div className="space-y-6 bg-neutral-900 rounded-md p-2  py-4">
            <div className="flex items-center gap-3 mb-6">
              <Wallet className="w-5 h-5 text-gray-400" />
              <h2 className="text-xl font-semibold">Wallet Connection</h2>
            </div>

            {/* Primary Wallet */}
            <div className=" rounded-lg p-6 space-y-4 bg-neutral-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">Primary Wallet</h3>
                  <p className="text-gray-400 text-sm font-mono">
                    0x1234...5678
                  </p>
                </div>
                <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Connected
                </div>
              </div>
            </div>

            {/* Network */}
            <div className=" rounded-lg p-6 space-y-4 bg-neutral-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">Network</h3>
                  <p className="text-gray-400 text-sm">Lens Mainnet</p>
                </div>
                <div className="bg-green-600 text-black px-3 py-1 rounded-full text-xs font-medium">
                  Active
                </div>
              </div>
            </div>

            {/* Disconnect Button */}
            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setIsConnected(false)}
                className="cursor-pointer border border-red-600 text-red-400 px-4 py-2 rounded-md font-semibold hover:bg-red-800 hover:text-white transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
