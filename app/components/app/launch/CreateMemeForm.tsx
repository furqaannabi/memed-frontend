import React, { type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";
import MemeImageUploader from "../../shared/MemeImageUploader";
import { ChevronRightIcon } from "lucide-react";

export default function CreateMemeForm({
  memeImage,
  setMemeImage,
  handlePrevStep,
  handleNextStep,
  memeTitle,
  setMemeTitle,
  memeDescription,
  setMemeDescription,
  memeSymbol,
  setMemeSymbol,
}: {
  memeImage: string | null;
  setMemeImage: Dispatch<SetStateAction<string | null>>;
  handlePrevStep: () => void;
  handleNextStep: () => void;
  memeTitle: string;
  setMemeTitle: Dispatch<SetStateAction<string>>;
  memeDescription: string;
  setMemeDescription: Dispatch<SetStateAction<string>>;
  memeSymbol: string;
  setMemeSymbol: Dispatch<SetStateAction<string>>;
}) {
  const showToast = (message: string) => {
    alert(message); // Simple alert for demonstration
  };

  return (
    <div className="p-8 bg-neutral-900 border border-neutral-800 text-white">
      <h1 className="mb-6 text-4xl font-black text-white">Create Your Meme</h1>
      <p className="mb-8 text-lg text-gray-400">
        Upload an image, choose from templates, or generate a meme using AI.
      </p>

      <div className="grid gap-8 mb-8 md:grid-cols-2">
        <div>
          <div className="mb-6">
            <label
              htmlFor="meme-title"
              className="mb-2 text-lg font-bold block text-gray-300"
            >
              Meme Title
            </label>
            <input
              id="meme-title"
              placeholder="Enter a catchy title..."
              className="border border-neutral-700 bg-neutral-900 text-white w-full p-2 rounded-md cursor-pointer outline-0"
              value={memeTitle}
              onChange={(e) => setMemeTitle(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="meme-symbol"
              className="mb-2 text-lg font-bold block text-gray-300"
            >
              Meme Symbol
            </label>
            <input
              id="meme-symbol"
              placeholder="Enter a symbol (e.g., MEME)"
              className="border border-neutral-700 bg-neutral-900 text-white w-full p-2 rounded-md cursor-pointer outline-0"
              value={memeSymbol}
              onChange={(e) => setMemeSymbol(e.target.value.toUpperCase())}
              maxLength={5}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="meme-description"
              className="mb-2 text-lg font-bold block text-gray-300"
            >
              Description
            </label>
            <textarea
              id="meme-description"
              placeholder="Tell the story behind your meme..."
              className="min-h-[100px] border border-neutral-700 bg-neutral-900 text-white w-full p-2 rounded-md cursor-pointer outline-0 resize-none"
              value={memeDescription}
              onChange={(e) => setMemeDescription(e.target.value)}
            />
          </div>
        </div>

        <div>
          <div className="mb-6">
            <MemeImageUploader image={memeImage} setImage={setMemeImage} />
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={handlePrevStep}
          className="px-4 py-2 border border-neutral-700 text-white rounded-md bg-neutral-800 hover:bg-neutral-700 cursor-pointer"
        >
          Back
        </button>
        <button
          onClick={() => {
            if (!memeImage || !memeTitle || !memeDescription) {
              toast.error("Please fill all fields");
              return;
            }
            handleNextStep();
            console.log(memeTitle, memeDescription, memeImage);
          }}
          disabled={!memeImage || !memeTitle || !memeDescription}
          className="px-4 py-2 gap-2 bg-green-500 rounded-md  text-black hover:shadow-2xl  cursor-pointer flex"
        >
          Next <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
}
