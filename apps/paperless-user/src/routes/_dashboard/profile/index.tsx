import { Suspense } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { useUser } from "@/hooks/queries/use-user"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/ui/tabs"
import { ProfilePersonalTab, ProfileContactTab, ProfileSocialTab } from "@/components/profile"

export const Route = createFileRoute("/_dashboard/profile/")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="text-muted-foreground">Memuat profil...</div>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  )
}

function ProfileContent() {
  const { data: userData } = useUser()

  if (!userData?.hris_user?.staff) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Data profil tidak ditemukan</div>
      </div>
    )
  }

  const staff = userData.hris_user.staff
  const details = staff.details

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">{details.fullname}</h1>
        <p className="text-muted-foreground">{staff.nip}</p>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Informasi Pribadi</TabsTrigger>
          <TabsTrigger value="contact">Kontak</TabsTrigger>
          <TabsTrigger value="social">Media Sosial</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <ProfilePersonalTab details={details} />
        </TabsContent>

        <TabsContent value="contact">
          <ProfileContactTab details={details} />
        </TabsContent>

        <TabsContent value="social">
          <ProfileSocialTab details={details} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
