import { Client, Databases, Query, ID } from 'appwrite'

const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID)

const databases = new Databases(client)

export const updateSearchCount = async (searchTerm, movie) => {
  try {
    const result = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.equal('searchTerm', searchTerm)])

    if (result.documents.length > 0) {
      const doc = result.documents[0]
      const updatedCount = (doc.count || 0) + 1

      await databases.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: updatedCount
      })
    } else {
      await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      })
    }
  } catch (error) {
    console.error('Error updating search count:', error)
  }
}

export const getTrendingMovies = async () => {
  try {
    const result = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.orderDesc('count')], Query.limit(5))
    return result.documents
  } catch (error) {
    console.error('Error fetching trending movies:', error)
    throw error
  }
}
