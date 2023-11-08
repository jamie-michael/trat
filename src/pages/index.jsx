import { useUser } from "@clerk/nextjs";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import { addFBDoc, db } from "~/db/firestore";
import dayjs from 'dayjs'

export default function Home() {
  const [message, setMessage] = useState('');
  const user = useUser();
  const [data, setData] = useState([]);
  const chatContainerRef = useRef();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'test'), (snapshot) => {
      const updatedData = [];
      snapshot.forEach((doc) => {
        updatedData.push({ id: doc.id, ...doc.data() });
      });

      setData(updatedData.map((d) => ({ ...d, createdAt: dayjs(d.createdAt.toDate()).unix() })).sort((a, b) => a.createdAt - b.createdAt));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Scroll to the latest message when the data changes
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [data]);

  const handleSend = async () => {
    if (message.trim() === '') return;

    const newMessage = {
      createdAt: new Date(),
      message,
      user: user?.user?.firstName
    };

    await addFBDoc('test', newMessage);
    setMessage('');
  };

  const handleKeyPress = async (event) => {
    if (event.key !== 'Enter') return;
    await handleSend();
  };

  return (
    <div className="bg-gradient-to-b from-[#2e026d] to-[#15162c] h-screen flex flex-col">
      {user?.isSignedIn && (
        <>
          <div className="flex flex-col gap-3 p-5 bg-stone-50 bg-opacity-20 text-stone-200 flex-grow overflow-y-auto" ref={chatContainerRef}>
            {data?.map((d, index) => (
              <div key={index} className="p-5 bg-stone-600 gap-2 flex">
                <p>{d.user}:</p>
                <p>{d.message}</p>
              </div>
            ))}
          </div>
          <div className="p-5 bg-stone-50 bg-opacity-20 text-stone-200">
            <div className="w-screen">
              <textarea onChange={(v) => setMessage(v.target.value)} value={message} onKeyDown={handleKeyPress} className="w-full text-stone-800" />
              <button className="p-3 bg-stone-700" onClick={handleSend}>Send</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
