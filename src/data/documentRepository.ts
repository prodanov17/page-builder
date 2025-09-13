import type { Builder } from "@/types/builder";

const INDEX_KEY = "builder_projects_index";

interface ProjectMetadata {
  id: string;
  name: string;
  lastModified: string;
}

// Helper to get the project index
const getIndex = (): ProjectMetadata[] => {
  const indexJson = localStorage.getItem(INDEX_KEY);
  return indexJson ? JSON.parse(indexJson) : [];
};

// Helper to save the project index
const saveIndex = (index: ProjectMetadata[]) => {
  localStorage.setItem(INDEX_KEY, JSON.stringify(index));
};

/**
 * Saves a document to localStorage.
 * @param document The full builder state to save.
 */
export const saveDocument = (document: Builder): void => {
  const documentKey = `builder_doc_${document.id}`;
  localStorage.setItem(documentKey, JSON.stringify(document));

  const index = getIndex();
  const existingEntry = index.find((p) => p.id === document.id);
  const now = new Date().toISOString();

  if (existingEntry) {
    existingEntry.name = document.name;
    existingEntry.lastModified = now;
  } else {
    index.push({ id: document.id, name: document.name, lastModified: now });
  }
  saveIndex(index);
};

/**
 * Loads a document from localStorage.
 * @param id The ID of the document to load.
 */
export const loadDocument = (id: string): Builder | null => {
  const documentKey = `builder_doc_${id}`;
  const documentJson = localStorage.getItem(documentKey);
  return documentJson ? JSON.parse(documentJson) : null;
};

/**
 * Gets metadata for all saved documents.
 */
export const getAllDocuments = (): ProjectMetadata[] => {
  return getIndex().sort(
    (a, b) =>
      new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime(),
  );
};

/**
 * Creates a new, blank document.
 */
export const createNewDocument = (name: string = "New Project"): Builder => {
  const newDoc: Builder = {
    id: `doc-${Date.now().toString(36)}`, // Generate a unique ID
    name,
    components: [],
    styles: {
      backgroundColor: "#ffffff",
      padding: "0",
      margin: "0",
      minHeight: "calc(100vh - 40px)",
      border: "1px solid #eee",
    },
  };
  saveDocument(newDoc); // Save it immediately
  return newDoc;
};

/**
 * Deletes a document and its metadata from localStorage.
 * @param id The ID of the document to delete.
 */
export const deleteDocument = (id: string): void => {
  // 1. Remove the main document data
  const documentKey = `builder_doc_${id}`;
  localStorage.removeItem(documentKey);

  // 2. Update the index by filtering out the deleted document
  const index = getIndex();
  const updatedIndex = index.filter((p) => p.id !== id);
  saveIndex(updatedIndex);
};
