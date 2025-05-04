import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  User,
  Settings,
  Bell,
  Menu,
  LayoutDashboard,
  Code,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ApiTestingTab from "./ApiTestingTab";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("overview");

  const handleLogout = async () => {
    await logout();
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar>
                    <AvatarImage src={user.avatar_url} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleProfileClick}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6 flex-1 flex flex-col">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col"
        >
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="api-testing"
              className="flex items-center gap-2"
            >
              <Code className="h-4 w-4" />
              API Testing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="flex-1 space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Welcome Card */}
              <Card className="col-span-full">
                <CardHeader>
                  <CardTitle>Welcome back, {user.name}!</CardTitle>
                  <CardDescription>
                    Here's an overview of your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={user.avatar_url} alt={user.name} />
                      <AvatarFallback className="text-lg">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xl font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                      <Badge className="mt-1">{user.role || "User"}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Cards */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Status</CardTitle>
                  <CardDescription>
                    Your account is active and verified
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email verification</span>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        Verified
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Account status</span>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Last login</span>
                      <span className="text-sm text-muted-foreground">
                        Today, 10:30 AM
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your latest account activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Profile updated
                        </span>
                        <span className="text-xs text-muted-foreground">
                          2 days ago
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        You updated your profile information
                      </p>
                      <Separator />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Password changed
                        </span>
                        <span className="text-xs text-muted-foreground">
                          1 week ago
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        You changed your password
                      </p>
                      <Separator />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Account created
                        </span>
                        <span className="text-xs text-muted-foreground">
                          2 weeks ago
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        You created your account
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>Security Recommendations</CardTitle>
                  <CardDescription>
                    Enhance your account security
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <div className="rounded-full bg-yellow-100 p-1">
                        <Bell className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Enable two-factor authentication
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="rounded-full bg-green-100 p-1">
                        <Bell className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Review recent logins
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Check for any suspicious activity
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    View Security Settings
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="api-testing" className="flex-1 flex">
            <div className="w-full h-full">
              <ApiTestingTab />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
