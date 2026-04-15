export default function PageHeading({ title }: { title: string }) {
  return (
    <h1 className="mb-20 text-9xl text-center animate-text-flicker">{title}</h1>
  );
}
