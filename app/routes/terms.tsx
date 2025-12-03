import { useState } from "react";
import { Header } from "@/components/home/Header";
import { MobileMenu } from "@/components/home/MobileMenu";
import { Footer } from "@/components/home/Footer";

// Import delete account step screenshots
import step1 from "@/assets/images/step1.png";
import step2 from "@/assets/images/step2.png";
import step3 from "@/assets/images/step3.png";
import step4 from "@/assets/images/step4.png";
import step5 from "@/assets/images/step5.png";

export default function Terms() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMenuOpen={isMobileMenuOpen}
      />

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-green-500">
          Terms & Conditions
        </h1>

        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 mb-6">
            <strong>Last updated:</strong> 01 December 2025<br />
            <strong>Effective date:</strong> 01 December 2025<br />
            <strong>Contact:</strong> <a href="mailto:support@memed.fun" className="text-green-400 hover:text-green-300">support@memed.fun</a>
          </p>

          <p className="text-gray-300 mb-6">
            Welcome to Memed.fun. By accessing or using our website, app, or any related services, you agree to these Terms & Conditions. If you do not agree, you must discontinue use of the platform.
          </p>

          <h2 className="text-2xl font-semibold text-green-400 mb-4">1. Eligibility</h2>
          <p className="text-gray-300 mb-6">
            You must be at least 13 years old to use Memed.fun. If you access Memed.fun through platforms like Facebook, Instagram, X, or others, you must also comply with their terms and policies.
          </p>

          <h2 className="text-2xl font-semibold text-green-400 mb-4">2. Accounts</h2>
          <p className="text-gray-300 mb-4">You are responsible for maintaining the confidentiality and security of your account.</p>
          <ul className="text-gray-300 mb-4 list-disc list-inside">
            <li>You must not impersonate someone else or attempt to access another user's account.</li>
            <li>We reserve the right to suspend or terminate accounts that violate these terms or disrupt the platform.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-green-400 mb-4">3. User Content</h2>
          <p className="text-gray-300 mb-4">When you upload memes or other content ("User Content"), you confirm that:</p>
          <ul className="text-gray-300 mb-4 list-disc list-inside">
            <li>You own the rights to the content or have permission to use it.</li>
            <li>Your content does not violate copyright, privacy, or any law.</li>
            <li>Your content is not hateful, harmful, abusive, or illegal.</li>
            <li>You grant Memed.fun a global, royalty-free license to display and use your content for operating and promoting the platform.</li>
          </ul>
          <p className="text-gray-300 mb-6">We may remove content at our discretion.</p>

          <h2 className="text-2xl font-semibold text-green-400 mb-4">4. Prohibited Use</h2>
          <p className="text-gray-300 mb-4">You agree not to:</p>
          <ul className="text-gray-300 mb-6 list-disc list-inside">
            <li>Upload illegal, abusive, or harmful content.</li>
            <li>Manipulate votes, battles, rewards, heat scoring, or tokens.</li>
            <li>Use bots, automation tools, or exploit vulnerabilities.</li>
            <li>Reverse-engineer any part of Memed.fun.</li>
            <li>Misuse Facebook/Instagram/X APIs or violate their policies.</li>
            <li>Attempt to disrupt servers or security.</li>
          </ul>
          <p className="text-gray-300 mb-6">Violations may result in account suspension or permanent ban.</p>

          <h2 className="text-2xl font-semibold text-green-400 mb-4">5. Intellectual Property</h2>
          <p className="text-gray-300 mb-6">
            All trademarks, branding, code, and platform assets belong to Memed.fun. You may not copy, modify, or distribute them without permission. User-generated content remains owned by its respective creator.
          </p>

          <h2 className="text-2xl font-semibold text-green-400 mb-4">6. Virtual Rewards, Tokens & NFTs</h2>
          <p className="text-gray-300 mb-4">Memed.fun includes features such as:</p>
          <ul className="text-gray-300 mb-4 list-disc list-inside">
            <li>Heat scoring</li>
            <li>Engagement-based rewards</li>
            <li>Tokens and NFTs</li>
            <li>Creator incentives</li>
            <li>Burn mechanics for NFTs</li>
            <li>Meme battles and scoring</li>
          </ul>
          <p className="text-gray-300 mb-6">These features are not financial instruments. They do not guarantee profit, monetary value, or future appreciation. You participate at your own risk.</p>

          <h2 className="text-2xl font-semibold text-green-400 mb-4">7. Third-Party Services</h2>
          <p className="text-gray-300 mb-4">Memed.fun integrates with:</p>
          <ul className="text-gray-300 mb-6 list-disc list-inside">
            <li>Facebook / Instagram</li>
            <li>X (Twitter)</li>
            <li>YouTube</li>
            <li>TikTok</li>
            <li>Farcaster</li>
            <li>Blockchain networks (Base, Ethereum, etc.)</li>
          </ul>
          <p className="text-gray-300 mb-6">Your use of these services is subject to their own terms. We are not responsible for outages, errors, or policy changes by third-party platforms.</p>

          <h2 className="text-2xl font-semibold text-green-400 mb-4">8. Privacy</h2>
          <p className="text-gray-300 mb-6">
            Your use of Memed.fun is governed by our Privacy Policy. By using the platform, you consent to how we collect, use, and share your data.
          </p>

          <h2 className="text-2xl font-semibold text-green-400 mb-4">9. Termination</h2>
          <p className="text-gray-300 mb-6">
            We may suspend or terminate your account if you violate these terms, harm the platform, or misuse features. You can request account deletion anytime by emailing: <a href="mailto:support@memed.fun" className="text-green-400 hover:text-green-300">support@memed.fun</a>
          </p>

          <h2 className="text-2xl font-semibold text-green-400 mb-4">10. Disclaimers</h2>
          <p className="text-gray-300 mb-4">Memed.fun is provided "as is" and "as available." We do not guarantee:</p>
          <ul className="text-gray-300 mb-6 list-disc list-inside">
            <li>uninterrupted availability</li>
            <li>error-free performance</li>
            <li>accuracy of content or metrics</li>
            <li>zero downtime</li>
          </ul>
          <p className="text-gray-300 mb-6">You assume full responsibility for your use of the platform.</p>

          <h2 className="text-2xl font-semibold text-green-400 mb-4">11. Limitation of Liability</h2>
          <p className="text-gray-300 mb-4">To the maximum extent allowed by law, Memed.fun is not liable for:</p>
          <ul className="text-gray-300 mb-6 list-disc list-inside">
            <li>lost data or content</li>
            <li>financial losses</li>
            <li>indirect, incidental, or consequential damages</li>
            <li>issues caused by third-party platforms, networks, or integrations</li>
          </ul>

          <h2 className="text-2xl font-semibold text-green-400 mb-4">12. Updates to Terms</h2>
          <p className="text-gray-300 mb-6">
            We may update these Terms & Conditions at any time. Changes will be posted with a new "Last updated" date. Your continued use of the platform indicates acceptance of the updated terms.
          </p>

          <h2 className="text-2xl font-semibold text-green-400 mb-4">13. Contact</h2>
          <p className="text-gray-300 mb-8">
            For support, questions, or concerns: <a href="mailto:support@memed.fun" className="text-green-400 hover:text-green-300">support@memed.fun</a>
          </p>

          <h1 className="text-3xl font-bold text-center mb-8 text-green-500">Data & Account Deletion Instructions – Memed.fun</h1>

          <p className="text-gray-300 mb-6">
            You can delete your Memed.fun account and all associated platform data from the Profile page, with the following conditions:
          </p>

          <h2 className="text-2xl font-semibold text-green-400 mb-4">1. When You Can Delete Your Account</h2>
          <p className="text-gray-300 mb-4">You are allowed to delete your account only if:</p>
          <ul className="text-gray-300 mb-4 list-disc list-inside">
            <li>You have not started the Fair Launch, OR</li>
            <li>If you did start it, your token sale is failed.</li>
          </ul>
          <p className="text-gray-300 mb-4">In these cases, all personal data stored on our servers will be permanently removed, including:</p>
          <ul className="text-gray-300 mb-6 list-disc list-inside">
            <li>Account information</li>
            <li>Username and profile details</li>
            <li>Email address (if provided)</li>
            <li>Linked social accounts (Facebook, X, etc.)</li>
            <li>Local activity data</li>
            <li>Meme uploads and platform interactions</li>
          </ul>
          <p className="text-gray-300 mb-6">Once deleted, the account cannot be restored.</p>

          <h2 className="text-2xl font-semibold text-green-400 mb-4">2. Why Account Deletion Is Restricted After Fair Launch Completion</h2>
          <p className="text-gray-300 mb-6">
            After your Fair Launch completes: Your connected social accounts are used to update Heat scores, which are essential for leaderboard and reward systems. Deleting the social account link would break on-chain reward and scoring integrity. Because of this, deletion is not allowed after your sale has completed.
          </p>

          <h2 className="text-2xl font-semibold text-green-400 mb-4">3. Blockchain Data Cannot Be Deleted</h2>
          <p className="text-gray-300 mb-4">Any information stored on the Base Mainnet cannot be removed. This includes:</p>
          <ul className="text-gray-300 mb-6 list-disc list-inside">
            <li>Tokens you earned or received</li>
            <li>On-chain transactions</li>
            <li>Trade history</li>
            <li>NFT mint or burn events</li>
            <li>Rewards or credits tied to your wallet</li>
          </ul>
          <p className="text-gray-300 mb-6">This data is permanently recorded on the blockchain, and no one (including Memed.fun) can erase or alter it.</p>

          <h2 className="text-2xl font-semibold text-green-400 mb-4">4. What Still Gets Deleted (Even If Blockchain Data Stays)</h2>
          <p className="text-gray-300 mb-4">Even if you have on-chain activity, we will still delete:</p>
          <ul className="text-gray-300 mb-6 list-disc list-inside">
            <li>Your off-chain profile on Memed.fun</li>
            <li>Your login credentials</li>
            <li>Stored content and actions</li>
            <li>Analytics and session logs</li>
            <li>Any linked social access tokens</li>
          </ul>
          <p className="text-gray-300 mb-6">Only blockchain data remains because it is irreversible by design.</p>

          <h2 className="text-2xl font-semibold text-green-400 mb-4">5. How to Delete Your Account</h2>
          <p className="text-gray-300 mb-6">You can delete your account in two ways:</p>

          <h3 className="text-xl font-medium text-green-300 mb-3">a. Self-Service Deletion (Recommended)</h3>
          <p className="text-gray-300 mb-4">Follow these steps to delete your account from the Settings page:</p>

          {/* Step-by-step guide with screenshot placeholders */}
          <div className="space-y-6 mb-8">
            {/* Step 1 */}
            <div className="bg-neutral-800 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-white mb-2">Step 1: Navigate to Settings</h4>
              <p className="text-gray-300 text-sm mb-3">
                Click on your profile icon in the top right corner, then select <strong>"Settings"</strong> from the dropdown menu.
              </p>
              <img
                src={step1}
                alt="Navigate to Settings - Click profile icon and select Settings from dropdown"
                className="w-full rounded-lg border border-neutral-700 shadow-lg"
              />
            </div>

            {/* Step 2 */}
            <div className="bg-neutral-800 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-white mb-2">Step 2: Scroll to Danger Zone</h4>
              <p className="text-gray-300 text-sm mb-3">
                Scroll down to the bottom of the Settings page. You'll see a red-bordered section called <strong>"Danger Zone"</strong> with account deletion options.
              </p>
              <img
                src={step2}
                alt="Danger Zone section at bottom of Settings page"
                className="w-full rounded-lg border border-neutral-700 shadow-lg"
              />
            </div>

            {/* Step 3 */}
            <div className="bg-neutral-800 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-white mb-2">Step 3: Check Eligibility</h4>
              <p className="text-gray-300 text-sm mb-3">
                The Danger Zone will show if you're eligible to delete your account:
              </p>
              <ul className="text-gray-300 text-sm list-disc list-inside mb-3 space-y-1">
                <li><span className="text-green-400">✓ Green message</span> = You can delete (no Fair Launch or Fair Launch failed)</li>
                <li><span className="text-yellow-400">⚠️ Yellow warning</span> = Cannot delete (Fair Launch active or completed)</li>
              </ul>
              <img
                src={step3}
                alt="Eligibility status showing green eligible message or yellow warning"
                className="w-full rounded-lg border border-neutral-700 shadow-lg"
              />
            </div>

            {/* Step 4 */}
            <div className="bg-neutral-800 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-white mb-2">Step 4: Click "Delete Account Permanently"</h4>
              <p className="text-gray-300 text-sm mb-3">
                If eligible, click the red <strong>"Delete Account Permanently"</strong> button. A confirmation modal will appear with detailed warnings.
              </p>
              <img
                src={step4}
                alt="Red Delete Account Permanently button"
                className="w-full rounded-lg border border-neutral-700 shadow-lg"
              />
            </div>

            {/* Step 5 */}
            <div className="bg-neutral-800 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-white mb-2">Step 5: Confirm Deletion</h4>
              <p className="text-gray-300 text-sm mb-3">
                In the confirmation modal, you must:
              </p>
              <ol className="text-gray-300 text-sm list-decimal list-inside mb-3 space-y-1 ml-4">
                <li>Check the box acknowledging blockchain data cannot be deleted</li>
                <li>Type <strong className="text-red-400">DELETE</strong> in the input field</li>
                <li>Click <strong>"Delete Account Permanently"</strong></li>
              </ol>
              <img
                src={step5}
                alt="Confirmation modal with warnings and DELETE input field"
                className="w-full rounded-lg border border-neutral-700 shadow-lg"
              />
              <p className="text-gray-300 text-xs mt-3 italic">
                After confirmation, your account will be permanently deleted. You'll be logged out and redirected to the home page.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-medium text-green-300 mb-3">b. Manual Request</h3>
          <p className="text-gray-300 mb-6">
            If you cannot access your account or need assistance:<br />
            <strong>Email:</strong> <a href="mailto:support@memed.fun" className="text-green-400 hover:text-green-300">support@memed.fun</a><br />
            <strong>Subject:</strong> Account Deletion Request<br />
            <strong>Include:</strong> Your wallet address and reason for deletion<br />
            <br />
            We will verify your eligibility based on your Fair Launch status and process the deletion within 48 hours.
          </p>
        </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}