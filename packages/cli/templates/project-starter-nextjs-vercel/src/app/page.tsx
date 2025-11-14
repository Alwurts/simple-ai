"use client";

import { CheckCircle, Code, Database, Shield, Users, Zap } from "lucide-react";
import Link from "next/link";
import { ContactForm } from "@/components/forms/contact-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusWidget } from "@/components/ui/status-widget";

export default function PublicPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			{/* Hero Section */}
			<div className="container mx-auto px-6 py-16">
				<div className="text-center mb-16">
					<h1 className="text-5xl font-bold text-gray-900 mb-6">
						Take Control of Your Productivity
					</h1>
					<p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
						Organize tasks, track progress, and achieve your goals with our intuitive todo
						management platform. Built for productivity with modern technology and seamless user
						experience.
					</p>
					<div className="flex gap-4 justify-center">
						<Link href="/login">
							<Button size="lg" className="px-8">
								Start Organizing
							</Button>
						</Link>
						<Link href="/signup">
							<Button size="lg" variant="outline" className="px-8">
								Create Account
							</Button>
						</Link>
					</div>
				</div>

				{/* Features Section */}
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<CheckCircle className="w-5 h-5 text-green-500" />
								Task Management
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-gray-600">
								Create, edit, and organize todos effortlessly. Mark tasks as complete, set
								priorities, and track your productivity journey.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Shield className="w-5 h-5 text-blue-500" />
								Secure Authentication
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-gray-600">
								Your tasks are private and secure with enterprise-grade authentication. Focus on
								productivity knowing your data is safe.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Zap className="w-5 h-5 text-yellow-500" />
								Fast & Modern
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-gray-600">
								Lightning-fast interface for seamless productivity. Built with cutting-edge
								technology for instant task management.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Database className="w-5 h-5 text-purple-500" />
								Database Integration
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-gray-600">
								Reliable data storage with instant sync across all your devices. Never lose a task
								with our robust database infrastructure.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Code className="w-5 h-5 text-red-500" />
								API First
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-gray-600">
								Access your todos anywhere, anytime. Sync across web, mobile, and desktop with our
								powerful API infrastructure.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Users className="w-5 h-5 text-indigo-500" />
								User Focused
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-gray-600">
								Designed for productivity with clean, intuitive UI. Focus on what matters most -
								getting things done efficiently.
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Contact Form Section */}
				<div className="mb-16">
					<div className="text-center mb-8">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
						<p className="text-gray-600">
							Have questions about TodoApp? We'd love to hear from you. Send us a message and we'll
							get back to you soon.
						</p>
					</div>

					<div className="max-w-2xl mx-auto">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Users className="w-5 h-5" />
									Contact Us
								</CardTitle>
							</CardHeader>
							<CardContent>
								<ContactForm />
							</CardContent>
						</Card>
					</div>
				</div>

				{/* CTA Section */}
				<div className="text-center mb-16">
					<h2 className="text-3xl font-bold text-gray-900 mb-4">
						Ready to Boost Your Productivity?
					</h2>
					<p className="text-gray-600 mb-8">
						Join thousands of users who trust TodoApp for their task management needs. Start
						organizing your life today.
					</p>
					<Button size="lg" className="px-8" asChild>
						<Link href="/signup">Start Managing Tasks</Link>
					</Button>
				</div>

				{/* Status Widget */}
				<div className="flex justify-center">
					<StatusWidget />
				</div>
			</div>
		</div>
	);
}
