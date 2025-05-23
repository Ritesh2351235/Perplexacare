"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { User } from "lucide-react";

const profileFormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  age: z.number().min(1).max(120).optional().nullable(),
  gender: z.string().optional(),
  height: z.number().min(1).optional().nullable(),
  weight: z.number().min(1).optional().nullable(),
  occupation: z.string().optional(),
  medicalHistory: z.string(),
  currentMedications: z.string(),
  allergies: z.string(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

function ProfileContent() {
  const { userProfile, updateUserProfile, currentUser, loading, getUserProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormInitialized, setIsFormInitialized] = useState(false);

  // Initialize form with empty values
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: "",
      age: null,
      gender: "",
      height: null,
      weight: null,
      occupation: "",
      medicalHistory: "",
      currentMedications: "",
      allergies: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
    }
  });

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (currentUser) {
          await getUserProfile();
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
      }
    };
    fetchProfile();
  }, [currentUser, getUserProfile]);

  // Update form when userProfile changes (only once when profile is first loaded)
  useEffect(() => {
    if (userProfile && !isFormInitialized) {
      console.log('Initializing form with profile:', userProfile);
      const formData: ProfileFormValues = {
        fullName: userProfile.fullName || "",
        age: userProfile.age || null,
        gender: userProfile.gender || "",
        height: userProfile.height || null,
        weight: userProfile.weight || null,
        occupation: userProfile.occupation || "",
        medicalHistory: Array.isArray(userProfile.medicalHistory)
          ? userProfile.medicalHistory.join(', ')
          : '',
        currentMedications: Array.isArray(userProfile.currentMedications)
          ? userProfile.currentMedications.join(', ')
          : '',
        allergies: Array.isArray(userProfile.allergies)
          ? userProfile.allergies.join(', ')
          : '',
        emergencyContactName: userProfile.emergencyContactName || '',
        emergencyContactPhone: userProfile.emergencyContactPhone || '',
      };

      form.reset(formData);
      setIsFormInitialized(true);
    }
  }, [userProfile, form, isFormInitialized]);

  async function onSubmit(data: ProfileFormValues) {
    setIsSubmitting(true);
    try {
      if (!currentUser) {
        toast.error('You must be signed in to update your profile');
        return;
      }

      // Create a clean object without undefined values for Firebase
      const cleanData = {
        fullName: data.fullName,
        age: data.age === null ? null : data.age,
        gender: data.gender || null,
        height: data.height === null ? null : data.height,
        weight: data.weight === null ? null : data.weight,
        occupation: data.occupation || null,
        emergencyContactName: data.emergencyContactName || null,
        emergencyContactPhone: data.emergencyContactPhone || null,
      };

      // Format arrays from comma-separated strings
      const profileData = {
        ...cleanData,
        medicalHistory: data.medicalHistory
          ? data.medicalHistory.split(',').map(item => item.trim()).filter(Boolean)
          : [],
        currentMedications: data.currentMedications
          ? data.currentMedications.split(',').map(item => item.trim()).filter(Boolean)
          : [],
        allergies: data.allergies
          ? data.allergies.split(',').map(item => item.trim()).filter(Boolean)
          : [],
      };

      await updateUserProfile(profileData);
      toast.success('Profile updated successfully');

      // Refresh the profile data after successful update
      await getUserProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Not Authenticated</CardTitle>
            <CardDescription>Please sign in to view your profile.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Loading Profile</CardTitle>
            <CardDescription>Please wait while we load your profile information...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/50 px-4 bg-gradient-to-r from-blue-50 to-white">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" />
          <span className="font-semibold text-gray-900">Profile Settings</span>
          <span className="text-sm text-gray-500">{userProfile?.fullName || currentUser?.displayName}</span>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Personal Information Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Your basic information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              value={field.value || ''}
                              onChange={e => {
                                const value = e.target.value ? parseInt(e.target.value) : null;
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="occupation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Occupation</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Physical Measurements Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Physical Measurements</CardTitle>
                  <CardDescription>Your body measurements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height (cm)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            value={field.value || ''}
                            onChange={e => {
                              const value = e.target.value ? parseInt(e.target.value) : null;
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            value={field.value || ''}
                            onChange={e => {
                              const value = e.target.value ? parseInt(e.target.value) : null;
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Medical Information Card */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Medical Information</CardTitle>
                  <CardDescription>Your health information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="medicalHistory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medical History</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Enter your medical history (comma-separated)"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currentMedications"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Medications</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Enter your current medications (comma-separated)"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="allergies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Allergies</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Enter your allergies (comma-separated)"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Emergency Contact Card */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Emergency Contact</CardTitle>
                  <CardDescription>Contact information in case of emergency</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="emergencyContactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emergency Contact Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="emergencyContactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emergency Contact Phone</FormLabel>
                        <FormControl>
                          <Input {...field} type="tel" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                'Save Profile'
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <ProfileContent />
      </SidebarInset>
    </SidebarProvider>
  );
} 