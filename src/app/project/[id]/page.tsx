import { db } from "@/lib/db"
import Navbar from "@/components/Navbar"
import Link from "next/link"
import Image from "next/image"
import { buyProject } from "@/actions/checkout"
import { createReview } from "@/actions/social"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  
  const { id } = await params

  const project = await db.project.findUnique({
    where: { id: id },
    include: {    
      freelancer: true,
      reviews: { 
        include: { user: true }, 
        orderBy: { createdAt: 'desc' } 
      }
    }
  })

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Projeto não encontrado</h1>
          <Link href="/" className="text-blue-600 hover:underline mt-4 block">Voltar para a loja</Link>
        </div>
      </div>
    )
  }

  const isOwner = session?.user?.id === project.freelancerId
  
  const canReview = !isOwner && session?.user

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />
      <div className="container mx-auto px-6 py-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="relative h-[400px] w-full rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100">
            {project.imageUrl ? (
              <Image src={project.imageUrl} alt={project.name} fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center bg-gray-50 text-gray-400">
                <svg className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">{project.name}</h1>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                   {project.freelancer?.name?.[0]?.toUpperCase() || "V"}
                </div>
                <Link href={`/u/${project.freelancerId}`} className="text-sm font-medium text-gray-600 hover:text-black hover:underline transition-colors">
                  Vendido por {project.freelancer?.name}
                </Link>
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-emerald-600">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(project.price))}
              </span>
            </div>

            <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
              <p>{project.description}</p>
            </div>

            <div className="pt-6 border-t border-gray-100">
              {isOwner ? (
                <Link href="/dashboard" className="flex w-full items-center justify-center rounded-xl bg-gray-100 py-4 text-base font-bold text-gray-900 hover:bg-gray-200 transition-colors">
                  Gerenciar meu Projeto
                </Link>
              ) : (
                <form action={buyProject}>
                  <input type="hidden" name="projectId" value={project.id} />
                  <button className="flex w-full items-center justify-center rounded-xl bg-black py-4 text-base font-bold text-white shadow-lg shadow-gray-200 hover:bg-gray-800 transition-all active:scale-[0.99]">
                    Comprar Agora
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="mt-24 max-w-3xl">
          <div className="mb-10 flex items-center gap-4">
             <h2 className="text-2xl font-bold text-gray-900">Avaliações de Clientes</h2>
             <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">{project.reviews.length}</span>
          </div>

          {canReview && (
            <form 
              action={async (formData) => {
                "use server"
                await createReview(formData)
              }} 
              className="mb-12 rounded-2xl bg-white p-6 shadow-sm border border-gray-100"
            >
              <h3 className="text-base font-bold text-gray-900 mb-4">Deixe sua avaliação</h3>
              <input type="hidden" name="projectId" value={project.id} />
              
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nota</label>
                <div className="relative">
                  <select name="rating" className="w-full appearance-none rounded-lg border border-gray-200 bg-white p-3 text-sm font-medium outline-none focus:border-black focus:ring-1 focus:ring-black">
                    <option value="5">5 - Excelente</option>
                    <option value="4">4 - Muito Bom</option>
                    <option value="3">3 - Bom</option>
                    <option value="2">2 - Regular</option>
                    <option value="1">1 - Ruim</option>
                  </select>
                  <div className="pointer-events-none absolute right-3 top-3.5 text-gray-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Comentário</label>
                <textarea 
                  name="comment" 
                  required 
                  rows={3} 
                  className="w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black resize-none" 
                  placeholder="Conte o que achou do código..."
                ></textarea>
              </div>

              <button className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition-colors shadow-sm">
                Enviar Avaliação
              </button>
            </form>
          )}

          <div className="space-y-6">
            {project.reviews.map((review) => (
              <div key={review.id} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xs text-gray-600">
                      {review.user.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-gray-900">{review.user.name}</span>
                      <span className="block text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString('pt-BR', {
                          timeZone: 'America/Sao_Paulo'
                        })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex text-yellow-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} className={`h-4 w-4 ${i < review.rating ? "fill-current" : "text-gray-200 fill-current"}`} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
              </div>
            ))}
            
            {project.reviews.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
                <p className="text-gray-500">Este projeto ainda não tem avaliações.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}