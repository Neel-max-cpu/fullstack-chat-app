import React from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Link } from 'react-router-dom';
import { LogOut, MessageSquare, Settings, User } from 'lucide-react';

const Navbar = () => {

  const { logout, authUser } = useAuthStore();

  return (
    <div className='mb-10'>
      <header
        className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg "
      >
        {/* left section */}
        <div className="container mx-auto px-4 h-16">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-8 hover:cursor-pointer">
              <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
                <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <h1 className="text-lg font-bold">Chatty</h1>
              </Link>
            </div>

            {/* right section */}
            <div className="flex items-center gap-2">
              <Link
                to={"/settings"}
                className={`
                  btn btn-sm gap-2 transition-colors border-none shadow-none bg-base-100 hover:opacity-80`}>
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </Link>

              {authUser && (
                <>
                  <Link to={"/profile"} className={`btn btn-sm gap-2 border-none shadow-none bg-base-100 hover:opacity-80`}>
                    <User className="size-5" />
                    <span className="hidden sm:inline">Profile</span>
                  </Link>

                  <button className="flex gap-2 items-center hover:cursor-pointer hover:opacity-80" onClick={logout}>
                    <LogOut className="size-5" />
                    <span className="hidden sm:inline text-sm font-semibold">Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}

export default Navbar
