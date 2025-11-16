import { Link } from "react-router";

export function meta() {
  return [
    { title: "404 - Page Not Found | Memed.fun" },
    { name: "description", content: "The page you're looking for doesn't exist on Memed.fun. Return to create and battle with meme tokens." },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Animated 404 */}
        <div className="mb-8">
          <h1 className="text-8xl font-bold text-white mb-4">
            404
          </h1>
          <div className="text-6xl mb-4">🤔</div>
        </div>

        {/* Error Message */}
        <div className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800">
          <h2 className="text-2xl font-bold text-white mb-4">
            Oops! This meme got lost
          </h2>
          <p className="text-neutral-400 mb-6 leading-relaxed">
            The page you're looking for doesn't exist. Maybe it was turned into a token and traded away?
            Let's get you back to creating some epic memes!
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              to="/"
              className="block w-full bg-green-600 hover:bg-green-700 text-black font-semibold py-3 px-6 rounded-lg transition-colors cursor-pointer"
            >
              🏠 Back to Home
            </Link>

            <button
              onClick={() => window.history.back()}
              className="block w-full bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors border border-neutral-700 cursor-pointer"
            >
              ← Go Back
            </button>
          </div>

          {/* Fun Stats */}
          <div className="mt-8 pt-6 border-t border-neutral-800">
            <p className="text-sm text-neutral-500 mb-2">While you're here...</p>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-neutral-800 rounded-lg p-3">
                <div className="text-lg font-bold text-white">∞</div>
                <div className="text-xs text-neutral-400">Memes Created</div>
              </div>
              <div className="bg-neutral-800 rounded-lg p-3">
                <div className="text-lg font-bold text-white">🚀</div>
                <div className="text-xs text-neutral-400">To The Moon</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-neutral-600 text-sm mt-6">
          Lost? Confused? That's just the meme economy for you! 📈
        </p>
      </div>
    </div>
  );
}
