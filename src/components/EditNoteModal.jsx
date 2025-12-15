export default function ({
    open, title, content, onClose, onSave, setTitle, setContent,
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" >
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md min-h-screen">
                <h2 className="text-xl font-semibold mb-4 text-center">Edit Note</h2>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border p-2 rounded mb-3"
                    placeholder="Title"
                />
                <textarea
                    value={content}
                    placeholder="Content"
                    onChange={(e) => setContent(e.target.value)}
                    rows="4"
                    className="w-full border-1 p-2 rounded h-85 mb-4 resize-none"
                />
                <div className="flex gap-3 mt-2">
                    <button
                        onClick={onClose}
                        className="flex-1 border border p-2 rounded hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSave}
                        className="flex-1 bg-blue-600 text-white border border p-2 rounded hover:bg-blue-700"
                    >
                        Save changes
                    </button>
                </div>
            </div>
        </div>
    );

}