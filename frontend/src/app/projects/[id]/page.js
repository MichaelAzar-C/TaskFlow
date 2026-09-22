import ProjectDetail from "./ProjectDetail";

export const metadata = {
  title: "Project details",
  robots: { index: false, follow: false },
};

export default async function ProjectPage({ params }) {
  const { id } = await params;
  return <ProjectDetail id={id} />;
}