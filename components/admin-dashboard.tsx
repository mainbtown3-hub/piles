'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit2, Film, Tv, Music, Image as ImageIcon, Users } from 'lucide-react'

type ContentType = 'movies' | 'series' | 'music' | 'carousel' | 'users'

interface ContentItem {
  id: string
  title: string
  description?: string
  type: ContentType
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<ContentType>('movies')
  const [items, setItems] = useState<ContentItem[]>([])
  const [formData, setFormData] = useState({ title: '', description: '' })
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleAdd = () => {
    if (formData.title.trim()) {
      const newItem: ContentItem = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        type: activeTab,
      }
      setItems([...items, newItem])
      setFormData({ title: '', description: '' })
    }
  }

  const handleEdit = (item: ContentItem) => {
    setEditingId(item.id)
    setFormData({ title: item.title, description: item.description || '' })
  }

  const handleSaveEdit = () => {
    if (editingId) {
      setItems(
        items.map((item) =>
          item.id === editingId
            ? { ...item, title: formData.title, description: formData.description }
            : item
        )
      )
      setEditingId(null)
      setFormData({ title: '', description: '' })
    }
  }

  const handleDelete = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const filteredItems = items.filter((item) => item.type === activeTab)

  const tabs: { id: ContentType; label: string; icon: React.ReactNode }[] = [
    { id: 'movies', label: 'Movies', icon: <Film className="w-5 h-5" /> },
    { id: 'series', label: 'Series', icon: <Tv className="w-5 h-5" /> },
    { id: 'music', label: 'Music', icon: <Music className="w-5 h-5" /> },
    { id: 'carousel', label: 'Carousel', icon: <ImageIcon className="w-5 h-5" /> },
    { id: 'users', label: 'Users', icon: <Users className="w-5 h-5" /> },
  ]

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Piles Admin Dashboard</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                setEditingId(null)
                setFormData({ title: '', description: '' })
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="bg-slate-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit' : 'Add'} {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 min-h-24"
            />
            <div className="flex gap-2">
              {editingId ? (
                <>
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-medium transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null)
                      setFormData({ title: '', description: '' })
                    }}
                    className="flex-1 bg-slate-600 hover:bg-slate-700 px-4 py-2 rounded font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={handleAdd}
                  className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <p className="text-slate-400 text-center py-8">
              No {activeTab} added yet. Create one to get started!
            </p>
          ) : (
            filteredItems.map((item) => (
              <div key={item.id} className="bg-slate-800 rounded-lg p-4 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  {item.description && <p className="text-slate-400 mt-1">{item.description}</p>}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-red-900 hover:bg-red-800 rounded transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
