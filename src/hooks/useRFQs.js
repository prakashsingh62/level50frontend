return (
  <div
    style={{
      padding: 16,
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box",
    }}
  >
    <h2 style={{ marginBottom: 10 }}>RFQ Dashboard</h2>

    {/* FILTER BAR */}
    <div
      style={{
        display: "flex",
        gap: 12,
        marginBottom: 10,
        alignItems: "center",
      }}
    >
      <select
        value={status}
        onChange={(e) => {
          setStatus(e.target.value);
          setPage(1);
        }}
        style={{
          padding: "6px 10px",
          fontSize: 14,
        }}
      >
        <option value="">ALL STATUS</option>
        {Object.keys(summary || {}).map((s) => (
          <option key={s} value={s}>
            {s} ({summary[s]})
          </option>
        ))}
      </select>

      {meta?.total > 0 && (
        <span style={{ fontSize: 13, color: "#555" }}>
          Total RFQs: {meta.total}
        </span>
      )}
    </div>

    {/* STATES */}
    {loading && <div>Loading RFQs…</div>}
    {error && <div style={{ color: "red" }}>{error}</div>}

    {/* TABLE CONTAINER */}
    {!loading && !error && (
      <div
        style={{
          flex: 1,
          overflow: "auto",
          border: "1px solid #ccc",
        }}
      >
        <table
          style={{
            borderCollapse: "collapse",
            minWidth: "120%",
            fontSize: 13,
          }}
        >
          <thead
            style={{
              background: "#f3f3f3",
              position: "sticky",
              top: 0,
              zIndex: 2,
            }}
          >
            <tr>
              {headers.map((h) => (
                <th
                  key={h}
                  style={{
                    border: "1px solid #ccc",
                    padding: "6px 8px",
                    textAlign: "left",
                    whiteSpace: "nowrap",
                    fontWeight: 600,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={idx}
                style={{
                  background: idx % 2 === 0 ? "#fff" : "#fafafa",
                }}
              >
                {headers.map((h) => (
                  <td
                    key={h}
                    style={{
                      border: "1px solid #ddd",
                      padding: "6px 8px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {row[h] ?? ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    {/* PAGINATION */}
    {!loading && meta?.total > 0 && (
      <div
        style={{
          marginTop: 10,
          display: "flex",
          gap: 10,
          alignItems: "center",
          fontSize: 13,
        }}
      >
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
        >
          Prev
        </button>

        <span>
          Page {meta.page} /{" "}
          {Math.ceil(meta.total / meta.page_size || 1)}
        </span>

        <button
          onClick={() =>
            setPage((p) =>
              p * meta.page_size < meta.total ? p + 1 : p
            )
          }
          disabled={page * meta.page_size >= meta.total}
        >
          Next
        </button>
      </div>
    )}
  </div>
);
