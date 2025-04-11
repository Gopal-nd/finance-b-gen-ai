'use client'
import React from 'react'
import { authClient } from '@/lib/auth-client'
import { LogoutButton } from '@/components/Logout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'


const Spinner: React.FC = () => (
    <div className="flex justify-center">
      <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" />
    </div>
  )

const ProfilePage: React.FC = () => {
  const {
    data: session,
    isPending,
    error,
    refetch,
  } = authClient.useSession()

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
          {isPending && (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          )}

          {error && (
            <Alert>
              <AlertTitle>Session Error</AlertTitle>
              <AlertDescription>
                {error.message}.{' '}
                <button
                  onClick={() => refetch()}
                  className="underline hover:no-underline"
                >
                  Retry
                </button>
              </AlertDescription>
            </Alert>
          )}

          {session && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  {session.user.image ? (
                    <AvatarImage src={session.user.image} alt={session.user.name} />
                  ) : (
                    <AvatarFallback>{session.user.name.charAt(0)}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="text-lg font-semibold">{session.user.name}</p>
                  <p className="text-sm text-muted-foreground">{session.user.email}</p>
                </div>
              </div>

              <Tabs defaultValue="details" className="w-full">
                <TabsList>
                  <TabsTrigger value="details">Session Data</TabsTrigger>
                  <TabsTrigger value="raw">Raw JSON</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="mt-4">
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <dt className="font-medium">Expires At</dt>
                      <dd className="text-sm text-muted-foreground">
                        {new Date(session?.session.expiresAt).toLocaleString()}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium">User Agent</dt>
                      <dd className="text-sm text-muted-foreground">{session?.session.userAgent}</dd>
                    </div>
                    <div>
                      <dt className="font-medium">IP Address</dt>
                      <dd className="text-sm text-green-500">{session?.session.ipAddress}</dd>
                    </div>
                  </dl>
                </TabsContent>
                <TabsContent value="raw" className="mt-4">
                  <pre className="overflow-auto text-xs">
                    {JSON.stringify(session, null, 2)}
                  </pre>
                </TabsContent>
              </Tabs>

              <div className="pt-4">
                <LogoutButton  />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfilePage
