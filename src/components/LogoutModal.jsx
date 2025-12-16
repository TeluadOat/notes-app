import "./LogoutModal.css";

export default function LogoutModal({ open, onCancel, onConfirm }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-black p-6 rounded-lg shadow-lg w-full max-w-sm animate-fadeIn">
                <h2 className="text-2xl font-bold text-center mb-4">Confirm Logout</h2>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2 border rounded hover:bg-gray-100 dark:hover:bg-black dark:hover:text-gray-300 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-2 bg-red-600 text-white border rounded hover:bg-red-700 cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}