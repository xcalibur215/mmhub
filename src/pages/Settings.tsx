import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Camera,
  Save
} from "lucide-react";

const Settings = () => {
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe", 
    email: "john.doe@example.com",
    phone: "+66 2 123 4567",
    bio: "Looking for a comfortable place to call home in Bangkok.",
    avatar: "/placeholder.svg"
  });

  const [notifications, setNotifications] = useState({
    emailMessages: true,
    emailPropertyUpdates: true,
    emailNewListings: false,
    pushMessages: true,
    pushPropertyUpdates: false
  });

  const [privacy, setPrivacy] = useState({
    showPhoneNumber: true,
    showEmail: false,
    allowDirectContact: true
  });

  const handleProfileSave = () => {
    // In real app, this would call API to update profile
    console.log("Saving profile:", profile);
  };

  const handleNotificationsSave = () => {
    // In real app, this would call API to update notification preferences
    console.log("Saving notifications:", notifications);
  };

  const handlePrivacySave = () => {
    // In real app, this would call API to update privacy settings
    console.log("Saving privacy:", privacy);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Account Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences and profile</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Privacy
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information and profile picture
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={profile.avatar} />
                      <AvatarFallback className="text-lg">
                        {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" size="sm">
                        <Camera className="w-4 h-4 mr-2" />
                        Change Photo
                      </Button>
                      <p className="text-sm text-muted-foreground mt-1">
                        JPG, PNG or GIF. Max size 2MB.
                      </p>
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profile.firstName}
                        onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profile.lastName}
                        onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us a bit about yourself..."
                      value={profile.bio}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      rows={4}
                    />
                  </div>

                  <Button onClick={handleProfileSave} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Save Profile Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Choose how you want to be notified about important updates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-4">Email Notifications</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="emailMessages">New Messages</Label>
                          <p className="text-sm text-muted-foreground">
                            Get notified when you receive new messages
                          </p>
                        </div>
                        <Switch
                          id="emailMessages"
                          checked={notifications.emailMessages}
                          onCheckedChange={(checked) => 
                            setNotifications({...notifications, emailMessages: checked})
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="emailPropertyUpdates">Property Updates</Label>
                          <p className="text-sm text-muted-foreground">
                            Updates about properties you're interested in
                          </p>
                        </div>
                        <Switch
                          id="emailPropertyUpdates"
                          checked={notifications.emailPropertyUpdates}
                          onCheckedChange={(checked) => 
                            setNotifications({...notifications, emailPropertyUpdates: checked})
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="emailNewListings">New Listings</Label>
                          <p className="text-sm text-muted-foreground">
                            Weekly digest of new properties matching your criteria
                          </p>
                        </div>
                        <Switch
                          id="emailNewListings"
                          checked={notifications.emailNewListings}
                          onCheckedChange={(checked) => 
                            setNotifications({...notifications, emailNewListings: checked})
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-4">Push Notifications</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="pushMessages">Messages</Label>
                          <p className="text-sm text-muted-foreground">
                            Instant notifications for new messages
                          </p>
                        </div>
                        <Switch
                          id="pushMessages"
                          checked={notifications.pushMessages}
                          onCheckedChange={(checked) => 
                            setNotifications({...notifications, pushMessages: checked})
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="pushPropertyUpdates">Property Updates</Label>
                          <p className="text-sm text-muted-foreground">
                            Important updates about your favorite properties
                          </p>
                        </div>
                        <Switch
                          id="pushPropertyUpdates"
                          checked={notifications.pushPropertyUpdates}
                          onCheckedChange={(checked) => 
                            setNotifications({...notifications, pushPropertyUpdates: checked})
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleNotificationsSave} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Save Notification Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>
                    Control what information is visible to other users
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="showPhone">Show Phone Number</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow landlords and agents to see your phone number
                        </p>
                      </div>
                      <Switch
                        id="showPhone"
                        checked={privacy.showPhoneNumber}
                        onCheckedChange={(checked) => 
                          setPrivacy({...privacy, showPhoneNumber: checked})
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="showEmail">Show Email Address</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow landlords and agents to see your email address
                        </p>
                      </div>
                      <Switch
                        id="showEmail"
                        checked={privacy.showEmail}
                        onCheckedChange={(checked) => 
                          setPrivacy({...privacy, showEmail: checked})
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="allowDirectContact">Allow Direct Contact</Label>
                        <p className="text-sm text-muted-foreground">
                          Let landlords and agents contact you directly about properties
                        </p>
                      </div>
                      <Switch
                        id="allowDirectContact"
                        checked={privacy.allowDirectContact}
                        onCheckedChange={(checked) => 
                          setPrivacy({...privacy, allowDirectContact: checked})
                        }
                      />
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium mb-2 text-destructive">Danger Zone</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      These actions cannot be undone. Please be careful.
                    </p>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full">
                        Download My Data
                      </Button>
                      <Button variant="destructive" className="w-full">
                        Delete Account
                      </Button>
                    </div>
                  </div>

                  <Button onClick={handlePrivacySave} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Save Privacy Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Settings;