export default function PageHeading({ title }: { title: string }) {
  return <h1 className="text-9xl text-center animate-text-flicker">{title}</h1>;
}
