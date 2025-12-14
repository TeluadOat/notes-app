import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoutModal from "../components/LogoutModal";
import DeleteModal from "../components/DeleteModal/DeleteModal";
import EditNoteModal from "../components/EditNoteModal";

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

    // for editing
    const [editingNote, setEditingNote] = useState();
    const [editTitle, setEditTitle] = useState();
    const [editContent, setEditContent] = useState();

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

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Your Notes</h1>
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
            <p className="text-gray-600 my-6">Welcome back, {user.email} </p>
            <form
                onSubmit={handleAddNote}
                className="mb-6 p-4 bg-white shadow rounded"
            >
                <h2 className="text-xl font-semibold mb-2">Add New Note</h2>
                <input
                    type="text"
                    placeholder="Title"
                    className="w-full p-2 border rounded mb-3"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    rows="3"
                    placeholder="Content"
                    className="w-full p-2 border rounded mb-3"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                >
                </textarea>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Note</button>
            </form>

            {/* Notes list */}
            {loading
                ? (<p>Loading notes...</p>)
                : (
                    <div className="grid gap-4 relative">
                        {notes.length === 0
                            ? (<p className="text-gray-500">No notes yet</p>)
                            : (notes.map((note) => (
                                <div key={note.id} className="bg-white p-4 shadow rounded relative">
                                    <h3 className="font-bold text-lg">{note.title}</h3>
                                    <p className="text-gray-700 mt-1 whitespace-pre-wrap">{note.content}</p>
                                    <p>{new Date(note.created_at).toLocaleString()}</p>
                                    <button
                                        onClick={() => openEditModal(note)}
                                        className="absolute top-3 right-16 text-blue-500 hover:text-blue-700"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            setNoteIdToDelete(note.id);
                                            setShowDeleteModal(true);
                                        }}
                                        className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                                    >
                                        Delete
                                    </button>
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
