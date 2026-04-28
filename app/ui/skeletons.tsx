export function EditSkeleton() {
  return (
    <div
      style={{
        fontFamily: "'Sora', sans-serif",
        background: "#13151c",
        border: "1px solid #2a2d3a",
        borderRadius: "20px",
        padding: "2.5rem 2rem",
        width: "100%",
        maxWidth: "480px",
      }}
    >
      {/* Title skeleton */}
      <div
        style={{
          height: "2rem",
          width: "40%",
          background: "#1a1d27",
          borderRadius: "8px",
          marginBottom: "0.6rem",
        }}
      />
      <div
        style={{
          height: "0.8rem",
          width: "65%",
          background: "#1a1d27",
          borderRadius: "6px",
          marginBottom: "1.25rem",
        }}
      />
      {/* Notice skeleton */}
      <div
        style={{
          height: "3rem",
          background: "#1a1d27",
          borderRadius: "10px",
          marginBottom: "2rem",
        }}
      />
      {/* Field skeletons */}
      {[1, 2].map((i) => (
        <div key={i} style={{ marginBottom: "1.25rem" }}>
          <div
            style={{
              height: "0.7rem",
              width: "20%",
              background: "#1a1d27",
              borderRadius: "4px",
              marginBottom: "0.5rem",
            }}
          />
          <div
            style={{
              height: i === 2 ? "120px" : "2.5rem",
              background: "#1a1d27",
              borderRadius: "10px",
            }}
          />
        </div>
      ))}
      {/* Dropdown skeleton */}
      <div style={{ marginBottom: "2rem" }}>
        <div
          style={{
            height: "0.7rem",
            width: "25%",
            background: "#1a1d27",
            borderRadius: "4px",
            marginBottom: "0.5rem",
          }}
        />
        <div
          style={{
            height: "2.5rem",
            background: "#1a1d27",
            borderRadius: "10px",
          }}
        />
      </div>
      {/* Button skeleton */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            height: "2.75rem",
            width: "160px",
            background: "#1a1d27",
            borderRadius: "10px",
          }}
        />
      </div>
    </div>
  );
}

export function CreateSkeleton() {
  return (
    <div
      style={{
        fontFamily: "'Sora', sans-serif",
        background: "#13151c",
        border: "1px solid #2a2d3a",
        borderRadius: "20px",
        padding: "2.5rem 2rem",
        width: "100%",
        maxWidth: "480px",
      }}
    >
      {/* Title */}
      <div
        style={{
          height: "2rem",
          width: "45%",
          background: "#1a1d27",
          borderRadius: "8px",
          marginBottom: "0.6rem",
        }}
      />
      <div
        style={{
          height: "0.8rem",
          width: "60%",
          background: "#1a1d27",
          borderRadius: "6px",
          marginBottom: "2rem",
        }}
      />
      {/* Fields */}
      {[1, 2].map((i) => (
        <div key={i} style={{ marginBottom: "1.25rem" }}>
          <div
            style={{
              height: "0.7rem",
              width: "20%",
              background: "#1a1d27",
              borderRadius: "4px",
              marginBottom: "0.5rem",
            }}
          />
          <div
            style={{
              height: i === 2 ? "120px" : "2.5rem",
              background: "#1a1d27",
              borderRadius: "10px",
            }}
          />
        </div>
      ))}
      {/* Dropdown */}
      <div style={{ marginBottom: "2rem" }}>
        <div
          style={{
            height: "0.7rem",
            width: "25%",
            background: "#1a1d27",
            borderRadius: "4px",
            marginBottom: "0.5rem",
          }}
        />
        <div
          style={{
            height: "2.5rem",
            background: "#1a1d27",
            borderRadius: "10px",
          }}
        />
      </div>
      {/* Button */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            height: "2.75rem",
            width: "160px",
            background: "#1a1d27",
            borderRadius: "10px",
          }}
        />
      </div>
    </div>
  );
}
