"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Mail,
  User,
  Calendar,
  Clock,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { ProfileAvatar } from "./ProfileAvatar";

const Account = () => {
  const { user, account, login } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingDetails, setSavingDetails] = useState(false);
  const [savingLinks, setSavingLinks] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    facebookLink: "",
    instagramLink: "",
    linkedinLink: "",
    twitterLink: "",
    youtubeLink: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get("/users/current-user");
        if (response.data.success) {
          const data = response.data.data;
          setProfileData(data);

          // Pre-fill form data
          setFormData({
            name: data.name || "",
            facebookLink: data.facebook_link || "",
            instagramLink: data.instagram_link || "",
            linkedinLink: data.linkedin_link || "",
            twitterLink: data.twitter_link || "",
            youtubeLink: data.youtube_link || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile details");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleUpdateAccount = async (section) => {
    try {
      if (section === "personal") setSavingDetails(true);
      if (section === "social") setSavingLinks(true);

      const payload = {};

      // Determine what to send based on the section
      if (section === "personal") {
        payload.name = formData.name;
      } else if (section === "social") {
        payload.facebookLink = formData.facebookLink;
        payload.instagramLink = formData.instagramLink;
        payload.linkedinLink = formData.linkedinLink;
        payload.twitterLink = formData.twitterLink;
        payload.youtubeLink = formData.youtubeLink;
      }

      const response = await api.patch("/users/update-account", payload);

      if (response.data.success) {
        toast.success(
          section === "personal"
            ? "Personal details updated!"
            : "Social links updated!",
        );

        const updatedData = response.data.data;
        // Map camelCase response to snake_case state if needed
        setProfileData((prev) => ({
          ...prev,
          name: updatedData.name,
          facebook_link: updatedData.facebookLink,
          instagram_link: updatedData.instagramLink,
          linkedin_link: updatedData.linkedinLink,
          twitter_link: updatedData.twitterLink,
          youtube_link: updatedData.youtubeLink,
        }));

        // Sync name with global auth context
        if (section === "personal" && user) {
          login({ ...user, name: updatedData.name }, account);
        }
      }
    } catch (error) {
      console.error("Error updating account:", error);
      toast.error(
        `Failed to update ${section === "personal" ? "details" : "links"}.`,
      );
    } finally {
      if (section === "personal") setSavingDetails(false);
      if (section === "social") setSavingLinks(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (e) {
      return "Invalid date";
    }
  };

  return (
    <div className="animate-in fade-in zoom-in-95 container mx-auto max-w-5xl space-y-8 px-4 py-8 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Left Column - Profile Card */}
        <div className="space-y-6 md:col-span-1">
          <Card className="border shadow-sm">
            <CardContent className="flex flex-col items-center pt-6 text-center">
              <ProfileAvatar
                profileData={profileData}
                user={user}
                account={account}
                loading={loading}
                login={login}
                setProfileData={setProfileData}
              />
            </CardContent>

            <div className="px-6 pt-0 pb-6">
              <div className="mt-6 space-y-4 border-t pt-4">
                <div className="text-muted-foreground flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>
                    Joined:{" "}
                    {loading ? (
                      <Skeleton className="ml-2 inline-block h-4 w-24 align-middle" />
                    ) : (
                      formatDate(
                        profileData?.createdAt || profileData?.created_at,
                      )
                    )}
                  </span>
                </div>
                <div className="text-muted-foreground flex items-center text-sm">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>
                    Updated:{" "}
                    {loading ? (
                      <Skeleton className="ml-2 inline-block h-4 w-24 align-middle" />
                    ) : (
                      formatDate(
                        profileData?.updatedAt || profileData?.updated_at,
                      )
                    )}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Details and Socials */}
        <div className="space-y-6 md:col-span-2">
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details here.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="text-muted-foreground h-4 w-4" />
                    Full Name
                  </Label>
                  {loading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="text-muted-foreground h-4 w-4" />
                    Email Address
                  </Label>
                  {loading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Input
                      id="email"
                      value={profileData?.email || ""}
                      disabled
                      className="bg-muted/50 cursor-not-allowed"
                    />
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-6">
              <Button
                onClick={() => handleUpdateAccount("personal")}
                disabled={
                  loading ||
                  savingDetails ||
                  formData.name === profileData?.name
                }
              >
                {savingDetails ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Details"
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle>Social Profiles</CardTitle>
              <CardDescription>
                Link your social accounts to your profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="facebookLink"
                    className="flex items-center gap-2"
                  >
                    <Facebook className="h-4 w-4 text-blue-600" />
                    Facebook
                  </Label>
                  {loading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <div className="relative">
                      <Input
                        id="facebookLink"
                        value={formData.facebookLink}
                        onChange={handleChange}
                        placeholder="https://facebook.com/..."
                        className="pr-10"
                      />
                      {formData.facebookLink && (
                        <a
                          href={
                            formData.facebookLink.startsWith("http")
                              ? formData.facebookLink
                              : `https://${formData.facebookLink}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="text-muted-foreground hover:text-primary absolute top-2.5 right-3 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="instagramLink"
                    className="flex items-center gap-2"
                  >
                    <Instagram className="h-4 w-4 text-pink-600" />
                    Instagram
                  </Label>
                  {loading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <div className="relative">
                      <Input
                        id="instagramLink"
                        value={formData.instagramLink}
                        onChange={handleChange}
                        placeholder="https://instagram.com/..."
                        className="pr-10"
                      />
                      {formData.instagramLink && (
                        <a
                          href={
                            formData.instagramLink.startsWith("http")
                              ? formData.instagramLink
                              : `https://${formData.instagramLink}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="text-muted-foreground hover:text-primary absolute top-2.5 right-3 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="linkedinLink"
                    className="flex items-center gap-2"
                  >
                    <Linkedin className="h-4 w-4 text-blue-700" />
                    LinkedIn
                  </Label>
                  {loading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <div className="relative">
                      <Input
                        id="linkedinLink"
                        value={formData.linkedinLink}
                        onChange={handleChange}
                        placeholder="https://linkedin.com/in/..."
                        className="pr-10"
                      />
                      {formData.linkedinLink && (
                        <a
                          href={
                            formData.linkedinLink.startsWith("http")
                              ? formData.linkedinLink
                              : `https://${formData.linkedinLink}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="text-muted-foreground hover:text-primary absolute top-2.5 right-3 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="twitterLink"
                    className="flex items-center gap-2"
                  >
                    <Twitter className="h-4 w-4 text-sky-500" />
                    Twitter
                  </Label>
                  {loading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <div className="relative">
                      <Input
                        id="twitterLink"
                        value={formData.twitterLink}
                        onChange={handleChange}
                        placeholder="https://twitter.com/..."
                        className="pr-10"
                      />
                      {formData.twitterLink && (
                        <a
                          href={
                            formData.twitterLink.startsWith("http")
                              ? formData.twitterLink
                              : `https://${formData.twitterLink}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="text-muted-foreground hover:text-primary absolute top-2.5 right-3 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="youtubeLink"
                    className="flex items-center gap-2"
                  >
                    <Youtube className="h-4 w-4 text-red-600" />
                    YouTube
                  </Label>
                  {loading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <div className="relative">
                      <Input
                        id="youtubeLink"
                        value={formData.youtubeLink}
                        onChange={handleChange}
                        placeholder="https://youtube.com/..."
                        className="pr-10"
                      />
                      {formData.youtubeLink && (
                        <a
                          href={
                            formData.youtubeLink.startsWith("http")
                              ? formData.youtubeLink
                              : `https://${formData.youtubeLink}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="text-muted-foreground hover:text-primary absolute top-2.5 right-3 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-6">
              <Button
                onClick={() => handleUpdateAccount("social")}
                disabled={loading || savingLinks}
              >
                {savingLinks ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Links"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Account;
