import Link from "next/link";

const features = [
  {
    title: "Organise by project",
    body: "Group related work together. Every project belongs to you and only you.",
  },
  {
    title: "Track task status",
    body: "Move work through to-do, in progress and done. See what's left at a glance.",
  },
  {
    title: "Secure by default",
    body: "JWT authentication on every endpoint, with ownership checks on every record.",
  },
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold leading-tight md:text-6xl">
            Keep every project moving.
          </h1>
          <p className="mt-6 text-lg text-gray-600 md:text-xl">
            TaskFlow is a simple way to organise your projects and track the tasks
            inside them — without the clutter of a full project suite.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="rounded-md bg-gray-900 px-6 py-3 text-center text-white hover:bg-gray-700"
            >
              Open dashboard
            </Link>
            <Link
              href="/about"
              className="rounded-md border border-gray-300 px-6 py-3 text-center hover:bg-gray-50"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-bold">What it does</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-lg border border-gray-200 bg-white p-6"
              >
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="text-3xl font-bold">Ready to get organised?</h2>
        <p className="mt-4 text-gray-600">
          Create an account to start organising your work.
        </p>
                <Link
          href="/register"
          className="mt-8 inline-block rounded-md bg-gray-900 px-8 py-3 text-white hover:bg-gray-700"
        >
          Create your account
        </Link>
      </section>
    </main>
  );
}