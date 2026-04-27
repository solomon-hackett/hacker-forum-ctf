export default function PageHeading({ heading }: { heading: string }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&display=swap');

        .page-heading-wrap {
          font-family: 'Sora', sans-serif;
          padding: 2rem 1.5rem 0.5rem;
        }
        .page-heading {
          font-size: clamp(1.75rem, 4vw, 3rem);
          font-weight: 600;
          color: #e8eaf2;
          letter-spacing: -0.03em;
          line-height: 1.2;
          margin: 0 0 0.5rem;
        }
        .page-heading-line {
          height: 2px;
          width: 100%;
          border-radius: 2px;
          background: linear-gradient(90deg, #7c6dfa, #5b9cf6);
        }
      `}</style>

      <div className="page-heading-wrap">
        <h1 className="page-heading">{heading}</h1>
        <div className="page-heading-line" />
      </div>
    </>
  );
}
