import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-20 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-4 text-gray-600">That page doesn&apos;t exist.</p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-md bg-gray-900 px-6 py-3 text-white hover:bg-gray-700"
      >
        Back to home
      </Link>
    </main>
  );
}