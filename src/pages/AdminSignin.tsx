import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { adminSignin, adminSignup } from "@/services/user";
import { redirectToDashboard, saveUserSession } from "@/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; // Assuming you have tab components

const AdminAuth: React.FC = () => {
  const [tab, setTab] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("ADMIN");


  const signInMutation = useMutation({
    mutationFn: adminSignin,
    onSuccess: (data) => {
      console.log(data)
      //saveUserSession(data);
      redirectToDashboard(data)
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message || "Sign-in failed.";
      toast.error(errorMsg, { position: "top-right" });
    },
  });

  const signUpMutation = useMutation({
    mutationFn: adminSignup,
    onSuccess: (data) => {
      toast.success("Account created successfully!", { position: "top-right" });
      saveUserSession(data);
      redirectToDashboard(data)

      setTab("signin");
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message || "Sign-up failed.";
      toast.error(errorMsg, { position: "top-right" });
    },
  });

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-96">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="flex justify-around mb-6">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                onClick={() => signInMutation.mutate({ email, password })}
                disabled={signInMutation.isPending}
                className="w-full"
              >
                {signInMutation.isPending ? "Signing In..." : "Sign In"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="signup">
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="ADMIN">Admin</option>
                <option value="MANAGER">Manager</option>
              </select>
              <Button
                onClick={() =>
                  signUpMutation.mutate({ email, name, password, role })
                }
                disabled={signUpMutation.isPending}
                className="w-full"
              >
                {signUpMutation.isPending ? "Creating Account..." : "Sign Up"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminAuth;
