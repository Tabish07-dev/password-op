import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Icon components
const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18"></path>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

function Manager() {
    const [form, setForm] = useState({ id: '', site: "", username: "", password: "" });
    const [passwordArray, setPasswordArray] = useState([]);
    const [show, setShow] = useState(false);
    const [copied, setCopied] = useState({ id: null, field: null });
    const [editingId, setEditingId] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        let passwords = localStorage.getItem("passwords");
        if (passwords) {
            try {
                const parsed = JSON.parse(passwords);
                if (parsed.length > 0 && !parsed[0].id) {
                    const updated = parsed.map(item => ({ ...item, id: uuidv4() }));
                    localStorage.setItem("passwords", JSON.stringify(updated));
                    setPasswordArray(updated);
                } else {
                    setPasswordArray(parsed);
                }
            } catch (error) {
                console.error("Error parsing passwords:", error);
            }
        }
    }, []);

    const togglePassword = () => {
        setShow(prev => !prev);
    };

    const savePassword = (e) => {
        e.preventDefault();
        try {
            if (!form.site || !form.username || !form.password) {
                alert("Please fill all fields");
                return;
            }

            if (editingId) {
                const updatedArray = passwordArray.map(item => 
                    item.id === editingId ? { ...form, id: editingId } : item
                );
                setPasswordArray(updatedArray);
                localStorage.setItem("passwords", JSON.stringify(updatedArray));
                setEditingId(null);
            } else {
                const newEntry = { ...form, id: uuidv4() };
                const newPasswordArray = [...passwordArray, newEntry];
                setPasswordArray(newPasswordArray);
                localStorage.setItem("passwords", JSON.stringify(newPasswordArray));
            }
            setForm({ id: '', site: "", username: "", password: "" });
        } catch (error) {
            console.error("Error saving password:", error);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const copyToClipboard = (text, id, field) => {
        navigator.clipboard.writeText(text);
        setCopied({ id, field });
        setTimeout(() => setCopied({ id: null, field: null }), 2000);
    };

    const deletePassword = (id) => {
        if (window.confirm("Are you sure you want to delete this password?")) {
            const updatedArray = passwordArray.filter(item => item.id !== id);
            setPasswordArray(updatedArray);
            localStorage.setItem("passwords", JSON.stringify(updatedArray));
            if (editingId === id) {
                setEditingId(null);
                setForm({ id: '', site: "", username: "", password: "" });
            }
        }
    };

    const editPassword = (id) => {
        const itemToEdit = passwordArray.find(item => item.id === id);
        if (itemToEdit) {
            setForm(itemToEdit);
            setEditingId(id);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setForm({ id: '', site: "", username: "", password: "" });
    };

    return (
        <div className='bg-green-50 min-h-screen'>
            <div className="mx-auto bg-green-100 max-w-4xl p-4 md:p-6">
                <h1 className='text-3xl md:text-4xl font-bold text-center py-6 md:py-10'>
                    <span className='text-green-700'>&lt;</span>
                    pass
                    <span className='text-green-500'>OP/&gt;</span>
                </h1>
                <p className='text-green-500 text-base md:text-lg text-center'>your own password manager</p>

                <form className="flex flex-col p-4 text-black gap-6 md:gap-8 items-center py-6 md:py-10" onSubmit={savePassword}>
                    <input
                        value={form.site}
                        onChange={handleChange}
                        placeholder='Enter website URL'
                        className='rounded-full border border-green-500 w-full p-3 md:p-4 py-1 text-sm md:text-base'
                        type="text"
                        name='site'
                        required
                    />
                    <div className='flex flex-col md:flex-row w-full gap-4 md:gap-8'>
                        <input
                            value={form.username}
                            onChange={handleChange}
                            placeholder='Enter username'
                            className='rounded-full border border-green-500 w-full p-3 md:p-4 py-1 text-sm md:text-base'
                            type="text"
                            name='username'
                            required
                        />
                        <div className='relative w-full'>
                            <input
                                value={form.password}
                                onChange={handleChange}
                                placeholder='Enter Password'
                                className='rounded-full border border-green-500 w-full p-3 md:p-4 py-1 text-sm md:text-base'
                                type={show ? "text" : "password"}
                                name='password'
                                required
                            />
                            <button 
                                type="button"
                                className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer'
                                onClick={togglePassword}
                            >
                                <EyeIcon />
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <button
                            type="submit"
                            className='flex justify-center items-center bg-green-400 hover:bg-green-300 rounded-full px-4 py-2 md:px-6 md:py-2 transition-colors text-sm md:text-base w-full sm:w-auto'
                        >
                            {editingId !== null ? 'Update' : 'Save Password'}
                        </button>
                        {editingId !== null && (
                            <button
                                type="button"
                                onClick={cancelEdit}
                                className='flex justify-center items-center bg-gray-400 hover:bg-gray-300 rounded-full px-4 py-2 md:px-6 md:py-2 transition-colors text-sm md:text-base w-full sm:w-auto'
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>

                <div className="passwords p-2 md:p-4">
                    <h2 className='font-bold text-xl md:text-2xl py-3 md:py-4'>Your passwords</h2>
                    {passwordArray.length === 0 ? (
                        <div className="text-center py-6 md:py-8">No passwords saved yet</div>
                    ) : isMobile ? (
                        <div className="space-y-4">
                            {passwordArray.map((item) => (
                                <div key={item.id} className="bg-white rounded-lg shadow p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <a 
                                            href={item.site.startsWith('http') ? item.site : `https://${item.site}`} 
                                            target='_blank' 
                                            rel="noreferrer"
                                            className="font-medium text-green-700 hover:underline break-all"
                                        >
                                            {item.site}
                                        </a>
                                        <div className="flex gap-2">
                                            <button onClick={() => editPassword(item.id)} className="text-blue-500">
                                                <EditIcon />
                                            </button>
                                            <button onClick={() => deletePassword(item.id)} className="text-red-500">
                                                <DeleteIcon />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Username:</span>
                                            <div className="flex items-center gap-1">
                                                <span>{item.username}</span>
                                                <button onClick={() => copyToClipboard(item.username, item.id, 'username')}>
                                                    {copied.id === item.id && copied.field === 'username' ? 
                                                        <CheckIcon className='text-green-500' /> : 
                                                        <CopyIcon />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Password:</span>
                                            <div className="flex items-center gap-1">
                                                <span>{show ? item.password : '••••••••'}</span>
                                                <button onClick={() => copyToClipboard(item.password, item.id, 'password')}>
                                                    {copied.id === item.id && copied.field === 'password' ? 
                                                        <CheckIcon className='text-green-500' /> : 
                                                        <CopyIcon />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table-auto w-full rounded-md overflow-hidden border-collapse">
                                <thead className='bg-green-800 text-white'>
                                    <tr>
                                        <th className='py-3 px-4 text-left'>Site</th>
                                        <th className='py-3 px-4 text-left'>Username</th>
                                        <th className='py-3 px-4 text-left'>Password</th>
                                        <th className='py-3 px-4 text-left'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className='bg-green-100'>
                                    {passwordArray.map((item) => (
                                        <tr key={item.id} className='border-b border-green-200 hover:bg-green-50'>
                                            <td className='py-3 px-4'>
                                                <div className='flex items-center gap-2'>
                                                    <a 
                                                        href={item.site.startsWith('http') ? item.site : `https://${item.site}`} 
                                                        target='_blank' 
                                                        rel="noreferrer"
                                                        className='hover:text-green-700 hover:underline break-all'
                                                    >
                                                        {item.site}
                                                    </a>
                                                    <button 
                                                        onClick={() => copyToClipboard(item.site, item.id, 'site')}
                                                        className='text-gray-500 hover:text-green-700 transition-colors'
                                                        title="Copy URL"
                                                    >
                                                        {copied.id === item.id && copied.field === 'site' ? 
                                                            <CheckIcon className='text-green-500' /> : 
                                                            <CopyIcon />}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className='py-3 px-4'>
                                                <div className='flex items-center gap-2'>
                                                    <span className="break-all">{item.username}</span>
                                                    <button 
                                                        onClick={() => copyToClipboard(item.username, item.id, 'username')}
                                                        className='text-gray-500 hover:text-green-700 transition-colors'
                                                        title="Copy username"
                                                    >
                                                        {copied.id === item.id && copied.field === 'username' ? 
                                                            <CheckIcon className='text-green-500' /> : 
                                                            <CopyIcon />}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className='py-3 px-4'>
                                                <div className='flex items-center gap-2'>
                                                    <span>{show ? item.password : '••••••••'}</span>
                                                    <button 
                                                        onClick={() => copyToClipboard(item.password, item.id, 'password')}
                                                        className='text-gray-500 hover:text-green-700 transition-colors'
                                                        title="Copy password"
                                                    >
                                                        {copied.id === item.id && copied.field === 'password' ? 
                                                            <CheckIcon className='text-green-500' /> : 
                                                            <CopyIcon />}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className='py-3 px-4'>
                                                <div className="flex gap-3">
                                                    <button 
                                                        onClick={() => editPassword(item.id)}
                                                        className='text-blue-500 hover:text-blue-700 transition-colors'
                                                        title="Edit"
                                                    >
                                                        <EditIcon />
                                                    </button>
                                                    <button 
                                                        onClick={() => deletePassword(item.id)}
                                                        className='text-red-500 hover:text-red-700 transition-colors'
                                                        title="Delete"
                                                    >
                                                        <DeleteIcon />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Manager;