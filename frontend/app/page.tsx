import Link from "next/link";
import { SignedOut } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  UserGroupIcon,
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

function Feature({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof UserGroupIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center px-4">
      <Icon className="h-8 w-8 text-blue-600" />
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </div>
  );
}

export default async function Home() {
  const { userId } = await auth();
  if (userId) {
    redirect('/dashboard');
  }
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between p-4 md:p-6">
        <Link href="/" className="text-xl font-bold text-blue-600">
          CoachUp
        </Link>
        <div className="flex items-center space-x-4">
          <SignedOut>
            <Link href="/sign-in" className="px-4 py-2 rounded bg-blue-600 text-white">
              Sign in
            </Link>
          </SignedOut>
        </div>
      </header>

      <main className="flex-grow">
        <section className="flex flex-col items-center text-center py-20 px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Manage your training business
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
            CoachUp helps you organize clients, routines and schedules so you can
            focus on coaching.
          </p>
          <div className="flex space-x-4">
            <Link href="/sign-up" className="px-6 py-3 rounded-lg bg-blue-600 text-white">
              Get started
            </Link>
            <Link
              href="/sign-in"
              className="px-6 py-3 rounded-lg border border-blue-600 text-blue-600"
            >
              Sign in
            </Link>
          </div>
        </section>
        <section className="bg-gray-50 py-16">
          <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-4">
            <Feature
              icon={UserGroupIcon}
              title="Client Management"
              description="Track progress and personal details for all your clients."
            />
            <Feature
              icon={ClipboardDocumentListIcon}
              title="Workout Plans"
              description="Create and assign personalized routines."
            />
            <Feature
              icon={CalendarDaysIcon}
              title="Scheduling"
              description="Organize classes and sessions with ease."
            />
            <Feature
              icon={ChartBarIcon}
              title="Insights"
              description="Analyze performance and keep improving."
            />
          </div>
        </section>
      </main>

      <footer className="text-center py-6 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} CoachUp. All rights reserved.
      </footer>
    </div>
  );
}
