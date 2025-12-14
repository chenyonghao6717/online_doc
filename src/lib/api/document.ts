export const createDocument = async (body: {
  title?: string;
  initContent?: string;
}) => {
  const res = await fetch("/api/documents", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Failed to create a document");
  }

  return (await res.json()) as { id: string };
};
