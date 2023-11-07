import { useUser } from "@clerk/nextjs";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
// import { addFBDoc, db } from "~/db/firestore";
import dayjs from 'dayjs'


export default function Home() {
const [message,setMessage] = useState('')
  const user = useUser()
  const [data, setData] = useState([])

  // useEffect(() => {
  //   const unsubscribe = onSnapshot(collection(db, 'test'), (snapshot) => {
  //     const updatedData:[] = [];
  //     snapshot.forEach((doc) => {
  //       updatedData.push({ id: doc.id, ...doc.data() });
  //     });
     
  //     setData(updatedData.map((d) => ({...d,createdAt:dayjs(d.createdAt.toDate()).unix()})).sort((a,b) => a.createdAt - b.createdAt));
  //   });

  //   return () => {
  //     // Unsubscribe from the snapshot listener when the component unmounts
  //     unsubscribe();
  //   };
  // }, []);
  // const handleSend = async () => {
  //   if (message.trim() === '') return 

  //   const  data = {
  //     createdAt: new Date(),
  //     message,
  //     user: user?.user?.firstName
  //   }
  //   await addFBDoc('test',data)
  //   setMessage('')
  // }



  // const handleKeyPress = async (event) => {
  //   // if (event.key !== 'Enter') return
  //   await handleSend()
  // };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#2e026d] to-[#15162c]">
       {user?.isSignedIn && 
       <div className="h-full flex-1 flex flex-col">
          <div className="flex gap-3 flex-col justify-end bg-stone-50 bg-opacity-20 p-5 flex-1 text-stone-200">
            {
              data?.map((d,index) => {
                return (
                  <div key={index} className="p-2 bg-stone-600  gap-2 flex">
                    {/* <p>{d.user}:</p>
                    <p>{d.message}</p> */}
                  </div>
                )
              })
            }
          </div>
        <div className="w-screen flex flex-col">
          <textarea onChange={(v) => setMessage(v.target.value)} value={message} 
          // onKeyPress={handleKeyPress}
          />
          {/* <button className="p-3 bg-stone-200" onClick={handleSend}>Send</button> */}
        </div>
       </div>
       }
    </div>
  );
}
