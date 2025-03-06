"use client";
import React,{useState,useEffect} from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { fetchDoctor } from "@/actions/useraction";
import {useRouter} from "next/navigation";

export default function Home() {
  const router = useRouter()
  const { data: session } = useSession(); // Get session data
  const [prefix, setprefix] = useState("");
  const [search, setsearch] = useState([]);

  const handleSearch = (username) => {
    setprefix("")
    router.push(`/${username}`)
  }

  useEffect(() => {
    getUsers();
  }, [prefix]);

  const getUsers = async () => {
    let u = await fetchDoctor(prefix);
    setsearch(u);
  };


  useEffect(() => {
    (function(){
      if (!window.chatbase || window.chatbase("getState") !== "initialized") {
          window.chatbase = function() {
              if (!window.chatbase.q) { window.chatbase.q = []; }
              window.chatbase.q.push(arguments);
          };
          window.chatbase = new Proxy(window.chatbase, {
              get(target, prop) {
                  if (prop === "q") { return target.q; }
                  return function() { return target(prop, ...arguments); };
              }
          });
      }
      const onLoad = function() {
          const script = document.createElement("script");
          script.src = "https://www.chatbase.co/embed.min.js";
          script.id = "Gff76WUIxvkxcIF_kFjgy";
          script.domain = "www.chatbase.co";
          document.body.appendChild(script);
      };
      if (document.readyState === "complete") {
          onLoad();
      } else {
          window.addEventListener("load", onLoad);
      }
  })();
  
}, []);


  return (
    <>
      Homepage
      <br />
      <Link href="/Role">
      <button>
        Profile
        </button>
      </Link>
      <br />
      <br />
      {!session ? (
        <Link href="/login">
          <button>Login</button>
        </Link>
      ) : (
        <button onClick={() => signOut({ callbackUrl: "/" })}>Log out</button>
      )}
      <br />
      <br />
      <br />
      
      <div className="flex">
        {session && (
          <div className="flex gap-5 w-full items-center">
            <div className="relative max-w-md mx-auto w-full hidden sm:block">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                value={prefix}
                name="prefix"
                onChange={(e) => setprefix(e.target.value)}
                className="block w-auto p-4 py-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search by name"
                required
              />
              {((prefix && search.length > 0) || search.length === 0) && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {search.length > 0 ? (
                    search.map((user) => (
                      <div
                        key={user.name}
                        className="p-2 hover:bg-gray-100 text-black cursor-pointer flex gap-2"
                        onClick={() => handleSearch(user.username)}
                      >
                        <div className="w-9 h-9">
                          <img
                            src={user.image ||"/avatar.png"}
                            alt="dp"
                            className="rounded-full object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex flex-col">
                          <h3 className="text-[14px] font-bold">
                            {user.name}
                          </h3>
                          <span className="text-[8px]">{user.category}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-gray-500">No users found</div>
                  )}
                </div>
              )}
            </div>

            
          </div>
        )}
      </div>
    </>
  );
}
