export default function ViewNoteModal({
    note, onClose, onEdit, onDelete,
}) {

    if (!note) return null;

    return (
        <div className="fixed inset-0  bg-black/40 overflow-auto z-50">
            <div className="bg-white dark:bg-black w-full max-w-4xl min-h-screen p-6 rounded shadow relative">
                <button
                    onClick={onClose}
                    className="absolute text-md top-5 right-5"
                >
                    ✕
                </button>
                <h2 className="text-2xl font-bold mb-4">
                    {note.title}
                </h2>
                <p className="whitespace-pre-wrap mb-6">
                    {note.content}
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        onClick={() => onEdit(note)}
                    >
                        Edit
                    </button>
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        onClick={() => onDelete(note.id)}
                    >
                        Delete
                    </button>
                </div>

            </div>
        </div >
    )

}