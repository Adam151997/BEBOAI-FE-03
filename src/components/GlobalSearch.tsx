import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchService, type SearchResult } from "@/services/search.service";
import { cn } from "@/lib/utils";

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setLoading(true);
        try {
          const response = await searchService.search(query);
          setResults(response.results || []);
          setIsOpen(true);
        } catch (error) {
          console.error("Search error:", error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [query]);

  const handleResultClick = (result: SearchResult) => {
    const module = result.module.toLowerCase();
    navigate(`/${module}`);
    setQuery("");
    setIsOpen(false);
    setResults([]);
  };

  const getResultTitle = (result: SearchResult): string => {
    if (result.name) return result.name;
    if (result.title) return result.title;
    if (result.first_name || result.last_name) {
      return `${result.first_name || ""} ${result.last_name || ""}`.trim();
    }
    return result.email || "Unnamed";
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search leads, accounts, contacts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 pr-9"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
              setResults([]);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full mt-2 w-full rounded-md border bg-popover shadow-lg z-50">
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Searching...
            </div>
          ) : results.length > 0 ? (
            <div className="max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <button
                  key={`${result.module}-${result.id}-${index}`}
                  onClick={() => handleResultClick(result)}
                  className={cn(
                    "w-full px-4 py-3 text-left hover:bg-accent transition-colors",
                    "border-b last:border-b-0"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {getResultTitle(result)}
                      </div>
                      {result.email && (
                        <div className="text-sm text-muted-foreground truncate">
                          {result.email}
                        </div>
                      )}
                    </div>
                    <div className="ml-2 shrink-0">
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-primary/10 text-primary">
                        {result.module}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
