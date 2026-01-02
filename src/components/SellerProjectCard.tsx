"use client"

import { deleteProject, updateProject } from "@/actions/project"
import { toast } from "sonner"
import { useState } from "react"
import Image from "next/image"

export default function SellerProjectCard({ project, salesCount }: any) {
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [preview, setPreview] = useState(project.imageUrl)

  async function handleDelete() {
    setLoading(true)
    const res = await deleteProject(project.id)
    
    if (res?.error) {
      toast.error(res.error)
    } else {
      toast.success("Projeto excluído com sucesso!")
      setIsDeleting(false)
    }
    setLoading(false)
  }

  async function handleUpdate(formData: FormData) {
    setLoading(true)
    const res = await updateProject(formData)
    setLoading(false)
    
    if (res?.error) {
      toast.error(res.error)
    } else {
      toast.success("Projeto atualizado com sucesso!")
      setIsEditing(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  return (
    <>
      <div className="group relative flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-gray-300">
        
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="truncate font-bold text-gray-900">{project.name}</h3>
          <div className="flex items-center gap-2 text-sm">
            <span className="rounded bg-emerald-50 px-2 py-0.5 font-bold text-emerald-600">
               {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(project.price))}
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-500">{salesCount} vendas</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Editar
          </button>
          
          <button
            onClick={() => setIsDeleting(true)}
            className="flex items-center justify-center rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-700 transition-colors"
          >
            Excluir
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="mb-6 flex items-center justify-between border-b pb-4">
              <h2 className="text-lg font-bold">Editar Projeto</h2>
              <button 
                onClick={() => { setIsEditing(false); setPreview(project.imageUrl); }} 
                className="rounded-full p-2 hover:bg-gray-100 transition-colors"
              >
                <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form action={handleUpdate} className="space-y-4">
              <input type="hidden" name="projectId" value={project.id} />
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome</label>
                <input 
                  name="name" 
                  defaultValue={project.name}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descrição</label>
                <textarea 
                  name="description" 
                  defaultValue={project.description}
                  rows={3}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition-all resize-none" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Preço (R$)</label>
                <input 
                  name="price" 
                  type="number" 
                  step="0.01"
                  defaultValue={Number(project.price)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Imagem de Capa</label>
                <div className="flex items-start gap-4">
                  <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                    {preview ? (
                      <Image src={preview} alt="Preview" fill className="object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="edit-image-upload"
                      className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 inline-block"
                    >
                      <span>Alterar Imagem</span>
                      <input
                        id="edit-image-upload"
                        name="image"
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">JPG ou PNG. Deixe em branco para manter a atual.</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Arquivo do Projeto</label>
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="edit-file-upload"
                      className="cursor-pointer text-sm font-bold text-blue-600 hover:underline"
                    >
                      <span>Substituir Arquivo Atual</span>
                      <input
                        id="edit-file-upload"
                        name="file"
                        type="file"
                        className="sr-only"
                      />
                    </label>
                    <p className="text-xs text-gray-500">Deixe em branco se não quiser alterar.</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 mt-4 border-t">
                <button
                  type="button"
                  onClick={() => { setIsEditing(false); setPreview(project.imageUrl); }}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-black px-6 py-2 text-sm font-bold text-white hover:bg-gray-800 disabled:opacity-50"
                >
                  {loading ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900">Excluir Projeto?</h3>
            <p className="text-sm text-gray-500 mt-2 mb-6">
              Tem certeza que deseja apagar <strong>{project.name}</strong>? Essa ação não pode ser desfeita.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleting(false)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "Excluindo..." : "Sim, Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}