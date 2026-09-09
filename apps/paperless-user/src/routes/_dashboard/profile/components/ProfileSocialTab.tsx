import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/ui/card"
import { Button } from "@workspace/ui/components/ui/button"
import { ExternalLink } from "lucide-react"
import type { StaffDetails } from "@workspace/types/user.type"

interface ProfileSocialTabProps {
  details: StaffDetails
}

export function ProfileSocialTab({ details }: ProfileSocialTabProps) {
  const socials = [
    {
      label: "Facebook",
      value: details.facebook,
      icon: "f",
      getUrl: (handle: string) => `https://facebook.com/${handle}`,
    },
    {
      label: "Twitter",
      value: details.twitter,
      icon: "𝕏",
      getUrl: (handle: string) => `https://twitter.com/${handle}`,
    },
    {
      label: "Instagram",
      value: details.instagram,
      icon: "📷",
      getUrl: (handle: string) => `https://instagram.com/${handle}`,
    },
    {
      label: "LinkedIn",
      value: details.linkedin,
      icon: "in",
      getUrl: (handle: string) => `https://linkedin.com/in/${handle}`,
    },
  ]

  const activeSocials = socials.filter((s) => s.value)

  if (activeSocials.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Media Sosial</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Belum ada media sosial yang terhubung</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Media Sosial</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {activeSocials.map((social) => (
            <div key={social.label} className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{social.label}</p>
                <p className="mt-1 text-base">{social.value}</p>
              </div>
              {social.value && (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                >
                  <a
                    href={social.getUrl(social.value)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gap-2"
                  >
                    <ExternalLink className="size-4" />
                  </a>
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
