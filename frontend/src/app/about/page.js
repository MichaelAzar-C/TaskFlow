export const metadata = {
  title: "About",
  description:
    "What TaskFlow is, and how it was built during the Compu-Vision Full-Stack Web Development Internship.",
};


export default function About() {
  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">About TaskFlow</h1>
      <p className="mt-4 text-gray-600">
        A project and task management platform built during the Compu-Vision internship.
      </p>
    </main>
  );
}