import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import SignOutButton from "./SignOutButton"
import MobileMenu from "./MobileMenu"

export default async function Navbar() {
  const session = await getServerSession(authOptions)
  
  const initial = session?.user?.name?.[0]?.toUpperCase() || "U"
  const firstName = session?.user?.name?.split(" ")[0] || "Usuário"

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 group mr-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white transition-transform group-hover:scale-105 shrink-0">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-gray-900">FreelaVault</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {session ? (
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard" 
                className="text-sm font-medium text-gray-500 hover:text-black transition-colors"
              >
                Minha Conta
              </Link>
              
              <div className="h-4 w-[1px] bg-gray-200"></div>

              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold shadow-sm ring-2 ring-gray-100 cursor-default shrink-0">
                  {initial}
                </div>
                
                <div className="flex items-center">
                   <p className="text-sm font-semibold text-gray-900 leading-none pt-0.5">
                     {firstName}
                   </p>
                </div>

                <div className="ml-1 flex items-center">
                  <SignOutButton />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-black">
                Entrar
              </Link>
              <Link 
                href="/register" 
                className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-800 whitespace-nowrap"
              >
                Criar Conta
              </Link>
            </div>
          )}
        </div>

        <MobileMenu session={session} />
        
      </div>
    </nav>
  )
}