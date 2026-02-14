"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AdminNav from "@/components/admin-nav"
import AdminMobileNav from "@/components/admin-mobile-nav"
import { Card } from "@/components/ui/card"
import { database } from "@/lib/firebase"
import { ref as dbRef, get } from "firebase/database"
import { Users, Film, Tv, Star, Music, ImageIcon } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({ users: 0, movies: 0, carousel: 0, series: 0, originals: 0, music: 0 })

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/login")
    }
  }, [user, loading, isAdmin, router])

  useEffect(() => {
    if (isAdmin) {
      loadStats()
    }
  }, [isAdmin])

  const loadStats = async () => {
    try {
      const [moviesSnap, carouselSnap, seriesSnap, originalsSnap, usersSnap] = await Promise.all([
        get(dbRef(database, "movies")),
        get(dbRef(database, "carousel")),
        get(dbRef(database, "series")),
        get(dbRef(database, "originals")),
        get(dbRef(database, "users")),
      ])

      let musicCount = 0
      if (moviesSnap.exists()) {
        const moviesData = moviesSnap.val()
        musicCount = Object.values(moviesData).filter((item: any) => item.category?.toLowerCase() === "music").length
      }

      setStats({
        users: usersSnap.exists() ? Object.keys(usersSnap.val()).length : 0,
        movies: moviesSnap.exists() ? Object.keys(moviesSnap.val()).length : 0,
        carousel: carouselSnap.exists() ? Object.keys(carouselSnap.val()).length : 0,
        series: seriesSnap.exists() ? Object.keys(seriesSnap.val()).length : 0,
        originals: originalsSnap.exists() ? Object.keys(originalsSnap.val()).length : 0,
        music: musicCount,
      })
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-xl">Loading...</div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Navigation */}
      <AdminNav />
      <AdminMobileNav />

      {/* Main content with proper padding for nav */}
      <main className="pt-14 pb-20 md:pb-6 px-3 md:px-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Welcome back, {user?.email}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-6">
            <Link href="/admin/users">
              <Card className="bg-card border-border p-4 hover:border-primary/50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground">{stats.users}</div>
                <div className="text-muted-foreground text-xs mt-1">Total Users</div>
              </Card>
            </Link>

            <Link href="/admin/movies">
              <Card className="bg-card border-border p-4 hover:border-primary/50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <Film className="w-5 h-5 text-red-500" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground">{stats.movies}</div>
                <div className="text-muted-foreground text-xs mt-1">Total Movies</div>
              </Card>
            </Link>

            <Link href="/admin/series">
              <Card className="bg-card border-border p-4 hover:border-primary/50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <Tv className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground">{stats.series}</div>
                <div className="text-muted-foreground text-xs mt-1">Total Series</div>
              </Card>
            </Link>

            <Link href="/admin/originals">
              <Card className="bg-card border-border p-4 hover:border-primary/50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground">{stats.originals}</div>
                <div className="text-muted-foreground text-xs mt-1">Total Originals</div>
              </Card>
            </Link>

            <Link href="/admin/music">
              <Card className="bg-card border-border p-4 hover:border-primary/50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <Music className="w-5 h-5 text-purple-500" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground">{stats.music}</div>
                <div className="text-muted-foreground text-xs mt-1">Music Videos</div>
              </Card>
            </Link>

            <Link href="/admin/carousel">
              <Card className="bg-card border-border p-4 hover:border-primary/50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <ImageIcon className="w-5 h-5 text-cyan-500" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground">{stats.carousel}</div>
                <div className="text-muted-foreground text-xs mt-1">Carousel Items</div>
              </Card>
            </Link>


          </div>

          {/* Quick Actions */}
          <Card className="bg-card border-border p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/admin/movies" className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <Film className="w-8 h-8 text-red-500" />
                  <div>
                    <p className="font-semibold text-foreground">Manage Movies</p>
                    <p className="text-xs text-muted-foreground">Add, edit, or delete movies</p>
                  </div>
                </div>
              </Link>

              <Link href="/admin/series" className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <Tv className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="font-semibold text-foreground">Manage Series</p>
                    <p className="text-xs text-muted-foreground">Add series with episodes</p>
                  </div>
                </div>
              </Link>

              <Link href="/admin/originals" className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <Star className="w-8 h-8 text-yellow-500" />
                  <div>
                    <p className="font-semibold text-foreground">Manage Originals</p>
                    <p className="text-xs text-muted-foreground">Upload exclusive content</p>
                  </div>
                </div>
              </Link>

              <Link href="/admin/music" className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <Music className="w-8 h-8 text-purple-500" />
                  <div>
                    <p className="font-semibold text-foreground">Manage Music</p>
                    <p className="text-xs text-muted-foreground">Upload music videos</p>
                  </div>
                </div>
              </Link>

              <Link href="/admin/carousel" className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <ImageIcon className="w-8 h-8 text-cyan-500" />
                  <div>
                    <p className="font-semibold text-foreground">Manage Carousel</p>
                    <p className="text-xs text-muted-foreground">Update featured banners</p>
                  </div>
                </div>
              </Link>

              <Link href="/admin/users" className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="font-semibold text-foreground">Manage Users</p>
                    <p className="text-xs text-muted-foreground">View user activity</p>
                  </div>
                </div>
              </Link>


            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
