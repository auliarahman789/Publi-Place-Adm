import React, { useEffect, useState } from "react";
import axios from "axios";

interface GalleryItem {
  id: number;
  image_url: string;
  character: string;
  place: string;
  caption: string;
  maps_url: string;
  createdAt: string;
  updatedAt: string;
  is_active: boolean;
}

interface GalleryResponse {
  data: GalleryItem[];
  total_page: number;
  current_page: number;
  total_items: number;
}

interface GalleryPageProps {}

const GalleryPage: React.FC<GalleryPageProps> = ({}) => {
  const [galleryData, setGalleryData] = useState<GalleryItem[]>([]);
  const [selectedCharacterFilter, setSelectedCharacterFilter] =
    useState("All Character");
  const [selectedLocationFilter, setSelectedLocationFilter] =
    useState("All Place");
  const [page, setPage] = useState(1);
  const [limit] = useState(25); // Increased limit for better pagination
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Static data untuk dropdown options
  const charactersData = [
    {
      id: "content-creator",
      name: "A Content Creator",
      image: "/A Content Creator.png",
    },
    { id: "daddy", name: "A Daddy", image: "/A Daddy.png" },
    { id: "dj", name: "A DJ", image: "/A DJ.png" },
    {
      id: "sporty-person",
      name: "A Sporty Person",
      image: "/A Sporty Person.png",
    },
    { id: "artist", name: "An Artist", image: "/An Artist.png" },
    { id: "entity", name: "An Entity", image: "/An Entity.png" },
  ];

  const locationsData = [
    {
      id: "cultural-art-space",
      name: "Cultural / Art Space",
      image: "/Cultural or Art Space.png",
    },
    {
      id: "traditional-market",
      name: "Traditional Market",
      image: "/Traditional Market.png",
    },
    { id: "nature-beauty", name: "Nature Beauty", image: "/Nature Beauty.png" },
    {
      id: "public-library",
      name: "Public Library",
      image: "/Public Library.png",
    },
    { id: "public-park", name: "Public Park", image: "/Public Park.png" },
  ];

  const fetchData = async (currentPage: number) => {
    if (loading) return;

    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        limit: limit,
      };

      if (selectedCharacterFilter !== "All Character") {
        params.character = selectedCharacterFilter;
      }

      if (selectedLocationFilter !== "All Place") {
        params.place = selectedLocationFilter;
      }

      const response = await axios.get<GalleryResponse>(
        `${import.meta.env.VITE_API_BASE}/api/gallery`,
        { params }
      );

      // Ensure we have valid data structure
      const responseData = response.data;
      const items = responseData.data || [];
      const totalPages = Math.max(responseData.total_page || 1, 1);

      setGalleryData(items);
      setTotalPages(totalPages);
    } catch (err) {
      console.error("Failed to fetch gallery data:", err);
      if (axios.isAxiosError(err)) {
        console.error("Axios error:", err.response?.data || err.message);
      }
      // Reset to default values on error
      setGalleryData([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: number) => {
    if (deleting) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirmDelete) return;

    setDeleting(id);
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE}/api/gallery/${id}`);

      // Remove item from local state
      setGalleryData((prev) => prev.filter((item) => item.id !== id));

      // Update total items count

      // If current page becomes empty and it's not page 1, go to previous page
      const remainingItems = galleryData.length - 1;
      if (remainingItems === 0 && page > 1) {
        setPage(page - 1);
      } else if (remainingItems === 0) {
        // If we're on page 1 and no items left, refresh to get accurate data
        fetchData(1);
      }
    } catch (err) {
      console.error("Failed to delete item:", err);
      if (axios.isAxiosError(err)) {
        console.error("Delete error:", err.response?.data || err.message);
        alert("Failed to delete item. Please try again.");
      }
    } finally {
      setDeleting(null);
    }
  };

  const openImageZoom = (imageUrl: string) => {
    setZoomedImage(`${import.meta.env.VITE_API_BASE}/images/${imageUrl}`);
  };

  const closeImageZoom = () => {
    setZoomedImage(null);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Initial load dan reset saat filter berubah
  useEffect(() => {
    setPage(1);
    fetchData(1); // Reset data
  }, [selectedCharacterFilter, selectedLocationFilter]);

  // Load data saat page berubah
  useEffect(() => {
    fetchData(page);
  }, [page]);

  // Handle escape key to close zoom
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && zoomedImage) {
        closeImageZoom();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [zoomedImage]);

  const getCharacterDisplayName = (characterId: string) => {
    const character = charactersData.find((c) => c.id === characterId);
    return character ? character.name : characterId;
  };

  const PaginationComponent = () => {
    const pageNumbers = generatePageNumbers();

    return (
      <div className="bg-white rounded-lg shadow-sm p-4 mt-4">
        <div className="flex flex-col items-center space-y-3">
          {/* Pagination controls - only show if there are multiple pages */}
          {totalPages > 1 && (
            <div className="flex items-center space-x-1">
              {/* Previous button */}
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1 || loading}
                className="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>

              {/* Page numbers */}
              <div className="flex items-center space-x-1">
                {pageNumbers.map((pageNum, index) => (
                  <React.Fragment key={index}>
                    {pageNum === "..." ? (
                      <span className="px-2 py-1 text-xs text-gray-400">
                        ...
                      </span>
                    ) : (
                      <button
                        onClick={() => handlePageChange(pageNum as number)}
                        disabled={loading}
                        className={`px-3 py-1 text-xs border rounded-md ${
                          page === pageNum
                            ? "bg-blue-500 text-white border-blue-500"
                            : "border-gray-300 hover:bg-gray-50"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {pageNum}
                      </button>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Next button */}
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages || loading}
                className="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}

          {/* Quick jump - only show for many pages */}
          {totalPages > 10 && (
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-gray-500">Go to page:</span>
              <input
                type="number"
                min="1"
                max={totalPages}
                value={page}
                onChange={(e) => {
                  const newPage = parseInt(e.target.value);
                  if (!isNaN(newPage)) {
                    handlePageChange(newPage);
                  }
                }}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="w-full px-4 py-4">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-900 mb-1">
            Gallery Admin
          </h1>
          <p className="text-sm text-gray-600">Manage gallery items</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-3 mb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Filters</h3>

          <div className="space-y-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Character
              </label>
              <select
                value={selectedCharacterFilter}
                onChange={(e) => setSelectedCharacterFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>All Character</option>
                {charactersData.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Place
              </label>
              <select
                value={selectedLocationFilter}
                onChange={(e) => setSelectedLocationFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>All Place</option>
                {locationsData.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading && page === 1 && (
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-sm text-gray-500">Loading...</div>
          </div>
        )}

        {galleryData.length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-sm text-gray-500 mb-1">
              No active items found
            </div>
            <div className="text-xs text-gray-400">Try adjusting filters</div>
          </div>
        )}

        {/* Mobile Card List */}
        <div className="space-y-3">
          {galleryData.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Image and Basic Info */}
              <div className="flex p-3">
                <div className="flex-shrink-0 mr-3">
                  <img
                    src={`${import.meta.env.VITE_API_BASE}/images/${
                      item.image_url
                    }`}
                    alt={item.caption}
                    className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => openImageZoom(item.image_url)}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-image.png";
                    }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                    {item.caption}
                  </p>

                  <div className="text-xs text-gray-500 space-y-1">
                    <div>👤 {getCharacterDisplayName(item.character)}</div>
                    <div>📍 {item.place}</div>
                    <div>
                      📅{" "}
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="px-3 py-2 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {item.maps_url && (
                      <a
                        href={item.maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 underline"
                      >
                        📍 Maps
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => deleteItem(item.id)}
                    disabled={deleting === item.id}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleting === item.id ? "..." : "🗑️ Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Component */}
        {totalPages > 0 && <PaginationComponent />}

        {/* Bottom padding for mobile navigation */}
        <div className="h-8"></div>
      </div>

      {/* Full Screen Image Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 overflow-auto"
          onClick={closeImageZoom}
        >
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="relative max-w-full">
              <img
                src={zoomedImage}
                alt="Zoomed image"
                className="max-w-full h-auto object-contain"
                onClick={(e) => e.stopPropagation()}
                style={{ maxHeight: "none" }}
              />
              <button
                onClick={closeImageZoom}
                className="absolute top-2 right-2 text-white text-2xl hover:text-gray-300 bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
