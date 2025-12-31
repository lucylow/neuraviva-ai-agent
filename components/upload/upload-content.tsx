"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { CloudArrowUpIcon, DocumentIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { ShieldCheck, Cable as Cube, AlertTriangle } from "lucide-react"
import { useDataStore } from "@/lib/store"
import { useForm } from "react-hook-form"
import { z } from "zod"

const uploadSchema = z.object({
  program: z.enum(["vina", "glide", "gromacs", "autodock", "other"]),
  projectId: z.string().min(1, "Project is required"),
  description: z.string().optional(),
  verifyOnBlockchain: z.boolean().optional(),
})

type UploadFormData = z.infer<typeof uploadSchema>

export function UploadContent() {
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const { uploadFile, projects, processingJobs } = useDataStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UploadFormData>({
    defaultValues: {
      program: "vina",
      verifyOnBlockchain: true,
    },
  })

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    setFiles((prev) => [...prev, ...droppedFiles])
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...selectedFiles])
    }
  }

  const onSubmit = async (data: UploadFormData) => {
    if (files.length === 0) {
      setError("Please select at least one file")
      return
    }

    if (!data.projectId) {
      setError("Please select a project")
      return
    }

    setUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
      const uploadPromises = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        if (file.size > 50 * 1024 * 1024) {
          throw new Error(`File ${file.name} exceeds 50MB limit`)
        }

        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            const newProgress = prev + (100 / files.length) * 0.1
            return newProgress > ((i + 1) / files.length) * 100 ? ((i + 1) / files.length) * 100 : newProgress
          })
        }, 100)

        try {
          await uploadFile(file, {
            program: data.program,
            projectId: data.projectId,
            description: data.description,
            verifyOnBlockchain: data.verifyOnBlockchain,
          })

          clearInterval(interval)
          setUploadProgress(((i + 1) / files.length) * 100)
        } catch (fileError: any) {
          clearInterval(interval)
          throw new Error(`Failed to upload ${file.name}: ${fileError.message}`)
        }
      }

      setFiles([])
      reset()
      setUploadProgress(100)

      setTimeout(() => {
        setUploading(false)
        setUploadProgress(0)
      }, 1000)
    } catch (error: any) {
      console.error("[v0] Upload failed:", error)
      setUploading(false)
      setUploadProgress(0)
      setError(error.message || "Upload failed. Please try again.")
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-900">Upload Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upload Data</h1>
        <p className="mt-2 text-sm text-gray-500">
          Upload docking simulation results for AI processing and blockchain storage
        </p>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-4">
        <div className="flex items-start gap-3">
          <Cube className="h-5 w-5 text-purple-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Blockchain Verification Available</h3>
            <p className="text-sm text-gray-700">
              All uploaded data can be verified on Solana blockchain for immutable data integrity. Enable automatic
              verification during upload or verify manually later.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
          mt-2 flex justify-center rounded-lg border-2 border-dashed px-6 py-10 transition-colors
          ${isDragging ? "border-purple-500 bg-purple-50" : "border-gray-300 bg-white"}
        `}
        >
          <div className="text-center">
            <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4 flex text-sm leading-6 text-gray-600">
              <label className="relative cursor-pointer rounded-md font-semibold text-purple-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-600 focus-within:ring-offset-2 hover:text-purple-500">
                <span>Upload files</span>
                <input
                  type="file"
                  className="sr-only"
                  multiple
                  onChange={handleFileInput}
                  accept=".log,.pdbqt,.txt,.maegz,.mae,.pdb,.gro,.dlg,.json,.csv"
                  disabled={uploading}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs leading-5 text-gray-600">AutoDock, Vina, Glide, GROMACS files up to 50MB</p>
          </div>
        </div>

        {files.length > 0 && (
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Files ({files.length})</h3>
              <ul className="divide-y divide-gray-200">
                {files.map((file, index) => (
                  <li key={index} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <DocumentIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFiles(files.filter((_, i) => i !== index))}
                      className="text-sm text-red-600 hover:text-red-500"
                      disabled={uploading}
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {files.length > 0 && (
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Docking Program</label>
                  <select
                    {...register("program")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                    disabled={uploading}
                  >
                    <option value="vina">AutoDock Vina</option>
                    <option value="glide">Schrödinger Glide</option>
                    <option value="gromacs">GROMACS</option>
                    <option value="autodock">AutoDock</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Project</label>
                  <select
                    {...register("projectId")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                    disabled={uploading}
                  >
                    <option value="">Select a project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                  {errors.projectId && <p className="mt-1 text-sm text-red-600">{errors.projectId.message}</p>}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                <textarea
                  {...register("description")}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                  placeholder="Add any notes about this upload..."
                  disabled={uploading}
                />
              </div>

              <div className="mt-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    {...register("verifyOnBlockchain")}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    disabled={uploading}
                  />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-purple-600" />
                      Verify on Blockchain
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Automatically register data hash on Solana blockchain for immutable verification and data
                      integrity
                    </p>
                  </div>
                </div>
              </div>

              {uploading && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Uploading...</span>
                    <span className="text-sm text-gray-500">{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-purple-600 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setFiles([])
                    reset()
                  }}
                  className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  disabled={uploading}
                >
                  Clear All
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={uploading || files.length === 0}
                >
                  {uploading ? "Processing..." : `Upload ${files.length} file${files.length !== 1 ? "s" : ""}`}
                </button>
              </div>
            </div>
          </div>
        )}
      </form>

      {processingJobs.length > 0 && (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Queue</h3>
            <ul className="divide-y divide-gray-200">
              {processingJobs.slice(0, 5).map((job) => (
                <li key={job.id} className="py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{job.filePath}</p>
                      <p className="text-xs text-gray-500">Started {new Date(job.createdAt).toLocaleString()}</p>
                    </div>
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        job.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : job.status === "failed"
                            ? "bg-red-100 text-red-800"
                            : job.status === "processing"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <CloudArrowUpIcon className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Supported File Formats</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>AutoDock Vina: .log, .pdbqt, .txt</li>
                <li>Schrödinger Glide: .maegz, .mae</li>
                <li>GROMACS: .pdb, .gro</li>
                <li>AutoDock: .pdbqt, .dlg</li>
                <li>General: .json, .csv</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
