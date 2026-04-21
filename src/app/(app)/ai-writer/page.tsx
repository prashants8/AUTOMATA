import { Section } from "@/components/ui";

export default function AiWriterPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">AI Writer</h1>
      <Section title="Create Content">
        <p className="text-sm text-zinc-300">
          Use the command bar to generate LinkedIn posts, Instagram captions, YouTube scripts, and blogs with tone + CTA controls.
        </p>
      </Section>
    </div>
  );
}
