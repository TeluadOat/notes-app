import "./DeleteModal.css"

export default function DeleteModal({ isOpen, onConfirm, onCancel }) {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center z-100 bg-black/50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
                <h3>Do you want to delete note?</h3>
                <div className="flex gap-3 mt-4">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2 border rounded hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-2 bg-red-600 text-white border rounded hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}