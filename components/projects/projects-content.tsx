"use client"

import { useEffect } from "react"
import { FolderIcon, PlusIcon } from "@heroicons/react/24/outline"
import { useDataStore } from "@/lib/store"

export function ProjectsContent() {
  const { projects, fetchProjects } = useDataStore()

  useEffect(() => {
    fetchProjects()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="mt-2 text-sm text-gray-500">
            Organize and manage your research projects ({projects.length} active)
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500">
          <PlusIcon className="h-5 w-5" />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white shadow sm:rounded-lg hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="rounded-lg bg-purple-100 p-3">
                    <FolderIcon className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{project.description}</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="font-semibold text-gray-900">{project.targets.length}</span> protein targets
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="font-semibold text-gray-900">{project.researchers.length}</span> researchers
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        project.status === "active"
                          ? "bg-green-100 text-green-800"
                          : project.status === "completed"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">Researchers: {project.researchers.join(", ")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
