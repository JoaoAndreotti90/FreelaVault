import { db } from "@/lib/db"
import Navbar from "@/components/Navbar"
import Link from "next/link"
import { buyProject } from "@/actions/checkout"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import SearchBar from "@/components/SearchBar"
import Image from "next/image"

export const dynamic = "force-dynamic"

export default async function Home({ 
  searchParams 
}: { 
  searchParams: Promise<{ query?: string }> 
}) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  
  const { query } = await searchParams
  const searchTerm = query || ""

  const projects = await db.project.findMany({
    where: {
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
    include: { freelancer: true },
  })

  const activeProjects = projects.filter(p => p.freelancer !== null)

  return (
    <main className="min-h-screen bg-gray-50/50">
      <Navbar />

      <div className="container mx-auto px-6 py-12">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {searchTerm ? `Resultados para "${searchTerm}"` : "Explorar Projetos"}
            </h1>
            <p className="mt-2 text-gray-500">
              Encontre o código perfeito para o seu próximo grande projeto.
            </p>
          </div>
          
          <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
            <SearchBar />
            <Link
              href="/upload"
              className="flex items-center justify-center gap-2 rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Vender Código
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {activeProjects.map((project) => {
            const isOwner = userId === project.freelancerId

            return (
              <div key={project.id} className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                <Link href={`/project/${project.id}`} className="block">
                  <div className="relative h-48 w-full bg-gray-100 overflow-hidden border-b border-gray-50">
                    {project.imageUrl && (
                      <Image
                        src={project.imageUrl}
                        alt={project.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    
                    {isOwner && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className="flex items-center justify-center rounded-full bg-black/80 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm leading-none">
                          Seu Produto
                        </span>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="flex flex-col justify-between flex-1 p-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{project.name}</h3>
                    <p className="mt-2 text-sm text-gray-500 line-clamp-2 leading-relaxed h-10">
                      {project.description}
                    </p>
                  </div>
                  
                  <div className="mt-4 flex items-center gap-2 text-xs font-medium text-gray-400">
                    <span>Por {project.freelancer?.name || "Vendedor"}</span>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-50">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Preço</p>
                      <span className="text-xl font-extrabold text-gray-900">
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(project.price))}
                      </span>
                    </div>
                    
                    {isOwner ? (
                       <Link 
                         href="/dashboard"
                         className="flex h-9 items-center justify-center rounded-full bg-gray-100 px-5 text-xs font-bold text-gray-900 hover:bg-gray-200"
                       >
                         Gerenciar
                       </Link>
                    ) : (
                      <form action={buyProject}>
                        <input type="hidden" name="projectId" value={project.id} />
                        <button type="submit" className="flex h-9 items-center justify-center rounded-full bg-blue-600 px-6 text-xs font-bold text-white transition hover:bg-blue-700 active:scale-95">
                          Comprar
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {activeProjects.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <h3 className="text-lg font-medium text-gray-900">Nenhum projeto encontrado</h3>
          </div>
        )}
      </div>
    </main>
  )
}