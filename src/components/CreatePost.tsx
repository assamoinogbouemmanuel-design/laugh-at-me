import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function CreatePost() {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const createPost = useMutation(api.posts.createPost);
  const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
  const syncUser = useMutation(api.users.syncUser);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    try {
      await syncUser();

      let mediaUrl = undefined;
      if (file) {
        const uploadUrl = await generateUploadUrl();
        const res = await fetch(uploadUrl, {
          method: "POST",
          body: file,
        });
        const { storageId } = await res.json();
        mediaUrl = storageId;
      }

      await createPost({ 
        text: text.trim(), 
        mediaUrl,
        category: "General" 
      });

      setText("");
      setFile(null);
      setPreview(null);
      alert("😂 Blague publiée avec succès !");
    } catch (err) {
      alert("Erreur lors de la publication");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6 mb-10">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Qu'est-ce qui t'a fait mourir de rire aujourd'hui ? 😂"
        className="w-full h-32 bg-zinc-800 rounded-2xl p-5 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-y"
        maxLength={500}
      />

      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange}
        className="mt-4 block w-full text-sm text-zinc-400 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:bg-yellow-400 file:text-black"
      />

      {preview && <img src={preview} className="mt-6 rounded-2xl max-h-80 mx-auto" alt="preview" />}

      <button
        type="submit"
        disabled={loading || !text.trim()}
        className="mt-6 w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-zinc-700 text-black font-bold py-4 rounded-2xl text-lg transition"
      >
        {loading ? "Publication en cours..." : "Publier la blague 😂"}
      </button>
    </form>
  );
}