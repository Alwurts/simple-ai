/** biome-ignore-all lint/correctness/useUniqueElementIds: Needed */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		const { error } = await authClient.signUp.email({
			name,
			email,
			password,
		});

		if (error) {
			setError(error.message ?? "An error occurred");
		} else {
			router.push("/login?signup=success");
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle>Sign Up</CardTitle>
					<CardDescription>Create your account to continue.</CardDescription>
				</CardHeader>
				<form onSubmit={handleSignUp}>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Name</Label>
							<Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
						</div>
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
						{error && <p className="text-sm text-red-500">{error}</p>}
					</CardContent>
					<CardFooter className="flex flex-col gap-4">
						<Button type="submit" className="w-full">
							Sign Up
						</Button>
						<p className="text-xs text-center text-gray-600">
							Already have an account?{" "}
							<Link href="/login" className="underline">
								Log in
							</Link>
						</p>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
