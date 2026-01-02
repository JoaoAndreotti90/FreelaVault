"use client"

import { createProject } from "@/actions/project"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function UploadForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    try {
      const result = await createProject(formData)
      
      if (result?.error) {
        toast.error(result.error)
      } else if (result?.success) {
        toast.success("Projeto publicado com sucesso!")
        router.push("/")
        router.refresh()
      }
    } catch (error: any) {
      toast.error(error.message || "Erro de conexão.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-8 rounded-2xl bg-white p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
      
      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-900 uppercase tracking-wider">Nome do Projeto</label>
        <input
          name="name"
          type="text"
          required
          placeholder="Ex: Dashboard Financeiro em React"
          className="mt-1 block w-full rounded-xl border border-gray-200 p-3 focus:border-black focus:ring-black outline-none transition-all"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-900 uppercase tracking-wider">Descrição</label>
        <textarea
          name="description"
          required
          placeholder="Descreva o que seu código faz e quais tecnologias usa..."
          rows={4}
          className="mt-1 block w-full rounded-xl border border-gray-200 p-3 focus:border-black focus:ring-black outline-none transition-all resize-none"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-900 uppercase tracking-wider">Preço (R$)</label>
        <input
          name="price"
          type="number"
          step="0.01"
          required
          placeholder="0.00"
          className="mt-1 block w-full rounded-xl border border-gray-200 p-3 focus:border-black focus:ring-black outline-none transition-all"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-900 uppercase tracking-wider">Imagem de Capa (Thumbnail)</label>
        <p className="text-xs text-gray-500 mb-2">Essa é a imagem que aparecerá na vitrine. Use JPG ou PNG.</p>
        <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-gray-300 px-6 py-8 transition-colors hover:bg-gray-50 hover:border-gray-400">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mx-auto h-10 w-10 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
              <label
                htmlFor="image-upload"
                className="relative cursor-pointer rounded-md bg-white font-bold text-black focus-within:outline-none hover:text-gray-500"
              >
                <span>Escolher Imagem</span>
                <input
                  id="image-upload"
                  name="image"
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  required
                  className="sr-only"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-900 uppercase tracking-wider">Arquivo do Projeto (Código/Zip)</label>
        <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-gray-300 px-6 py-8 transition-colors hover:bg-gray-50 hover:border-gray-400">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mx-auto h-10 w-10 text-gray-400">
               <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3.75h3.75M12 15.75h3.75M12 7.5a2.25 2.25 0 002.25-2.25 2.25 2.25 0 00-2.25 2.25m0 0h-3.75m9.75-3.75H9m12 0a3 3 0 013 3V19.5a3 3 0 01-3 3H4.5a3 3 0 01-3-3V5.25a3 3 0 013-3h3.75" />
            </svg>

            <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-bold text-black focus-within:outline-none hover:text-gray-500"
              >
                <span>Escolher Arquivo</span>
                <input
                  id="file-upload"
                  name="file"
                  type="file"
                  required
                  className="sr-only"
                />
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2">Zip, Rar, PDF ou Code</p>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center rounded-xl bg-black px-6 py-4 text-base font-bold text-white transition hover:bg-gray-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Publicando...</span>
          </div>
        ) : (
          "Publicar Projeto Agora"
        )}
      </button>
    </form>
  )
}