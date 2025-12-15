import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoutModal from "../components/LogoutModal";
import DeleteModal from "../components/DeleteModal/DeleteModal";
import EditNoteModal from "../components/EditNoteModal";
import ViewNoteModal from "../components/ViewNoteModal";

export default function DashBoard() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // this state store all notes fetched from Supabase
    const [notes, setNotes] = useState([]);

    // set particular note id for deletion
    const [noteIdToDelete, setNoteIdToDelete] = useState(null);

    // this states store new notes input values
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    // loading indicator
    const [loading, setLoading] = useState(false);

    // state to display logout modal
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // state to display delete modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // state to control full screen create note view
    const [isCreating, setIsCreating] = useState(false);

    // for editing
    const [editingNote, setEditingNote] = useState();
    const [editTitle, setEditTitle] = useState();
    const [editContent, setEditContent] = useState();

    // state for clicked note
    const [activeNote, setActiveNote] = useState(null);

    // note selected

    // fetch notes after user loads
    useEffect(() => {
        if (user) fetchNotes();
    }, [user]);

    const fetchNotes = async () => {
        setLoading(true);

        const { data, error } = await supabase
            .from("notes")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        setLoading(false);
        if (error) console.log("Error fetching notes:", error);
        else setNotes(data);
    }

    // helper to truncate text
    const truncateText = (text, maxLength = 120) => {
        if (!text) return "";
        return text.length > maxLength
            ? text.slice(0, maxLength) + "..."
            : text;
    };

    // add a new note with optimistic UI update
    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;
        if (!user) return;

        // temporary note for instant UI update
        const tempNote = {
            id: Date.now(), //fake id
            user_id: user.id,
            title,
            content,
            created_at: new Date().toISOString()
        }

        // update UI immediately
        setNotes(prev => [tempNote, ...prev]);
        setTitle("");
        setContent("");

        // insert into Supabase
        const { data, error } = await supabase
            .from("notes")
            .insert({ user_id: user.id, title, content })
            .select();

        if (error) {
            //remove temp note if insert fails
            setNotes(prev => prev.filter(n => n.id !== tempNote.id));
        } else if (data && data.length > 0) {
            //replace temp note with real note from Supabase
            setNotes(prev => [data[0], ...prev.filter(n => n.id !== tempNote.id)]);
        } else {
            console.warn("No data returned after inserting note");
        }
    }

    // delete note
    const handleDelete = async (id) => {
        // optimistic update
        const previousNote = notes;
        setNotes((prev) => prev.filter((n) => n.id !== id));

        // delete from supabase
        const { error } = await supabase
            .from("notes")
            .delete()
            .eq("id", id);

        // if Supabase fails -> restore

        if (error) {
            console.log("Delete failed:", error.message)
            setNotes(previousNote);
        }

    }

    const openEditModal = (note) => {
        setEditingNote(note);
        setEditTitle(note.title);
        setEditContent(note.content);
    }

    const handleSaveEdit = async () => {
        if (!editTitle.trim() || editContent.trim()) return;

        //optimistic update
        const previousNotes = notes;
        const updated = notes.map(n => n.id === editingNote.id ? { ...n, title: editTitle, content: editContent } : n);
        setNotes(updated);

        // update in Supabase
        const { error } = supabase
            .from("notes")
            .update({ title: editTitle, content: editContent })
            .eq("id", editingNote.id)

        // rollback on error
        if (error) {
            console.log("Error updating user data:", error)
            setNotes(previousNotes);
        }

        // clear modal
        setEditingNote(null)
    }


    if (!user) return <p>Loading user...</p>;

    if (isCreating) {
        return (
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">New Note</h2>

                        <button
                            onClick={() => setIsCreating(false)}
                            className="text-gray-500 hover:text-black text-xl"
                        >
                            ✕
                        </button>
                    </div>

                    <form
                        onSubmit={(e) => {
                            handleAddNote(e);
                            setIsCreating(false); // return to dashboard after save
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Title"
                            className="w-full p-3 border rounded mb-4 text-lg"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <textarea
                            placeholder="Write note..."
                            className="w-full p-3 border rounded h-80 resize-none"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />

                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                type="button"
                                onClick={() => setIsCreating(false)}
                                className="px-4 py-2 border rounded"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                            >
                                Save Note
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="flex justify-between items-center gap-2">
                <h1 className="text-3xl font-bold">Your Notes</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsCreating(true)}
                        className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                    >
                        +
                    </button>
                    <button
                        onClick={() => navigate("/profile")}
                        className="bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700"
                    >
                        Profile
                    </button>
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            </div>
            <p className="text-gray-600 my-6">Welcome back, {user.email} </p>


            {/* Notes list */}
            {loading
                ? (<p>Loading notes...</p>)
                : (
                    <div className="grid gap-4 relative">
                        {notes.length === 0
                            ? (<p className="text-gray-500">No notes yet</p>)
                            : (notes.map((note) => (
                                <div
                                    key={note.id}
                                    onClick={() => setActiveNote(note)}
                                    className="bg-white p-4 shadow rounded cursor-pointer hover:bg-gray-50 transition">
                                    <h3 className="font-bold text-lg">{note.title}</h3>

                                    {/* truncate content for preview */}
                                    <p className="text-gray-700 mt-1">
                                        {truncateText(note.content)}
                                    </p>

                                    <p className="text-xs text-gray-500 mt-2">{new Date(note.created_at).toLocaleString()}</p>
                                </div>
                            )))
                        }
                        <DeleteModal
                            isOpen={showDeleteModal}
                            onCancel={() => setShowDeleteModal(false)}
                            onConfirm={() => {
                                handleDelete(noteIdToDelete);
                                setShowDeleteModal(false);
                            }}
                        />
                    </div>
                )
            }

            <ViewNoteModal
                note={activeNote}
                onClose={() => setActiveNote(null)}
                onEdit={(note) => {
                    setActiveNote(null);
                    openEditModal(note);
                }}
                onDelete={(id) => {
                    setActiveNote(null);
                    setNoteIdToDelete(id);
                    setShowDeleteModal(true);
                }}
            />

            {/*logout modal*/}
            <LogoutModal
                open={showLogoutModal}
                onCancel={() => setShowLogoutModal(false)}
                onConfirm={async () => {
                    await logout();
                    setShowLogoutModal(false);
                    navigate("/login");
                }}
            />
            {/* Edit Note Modal */}
            <EditNoteModal
                open={!!editingNote}
                title={editTitle}
                content={editContent}
                setTitle={setEditTitle}
                setContent={setEditContent}
                onClose={() => setEditingNote(null)}
                onSave={handleSaveEdit}
            />


        </div>
    );
}
