import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchService, type GlobalSearchResult } from "@/services/search.service";
import { cn } from "@/lib/utils";

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GlobalSearchResult | null>(null);
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
          setResults(response);
          setIsOpen(true);
        } catch (err) {
          console.error("Search error:", err);
          setResults(null);
          // Don't crash on error, just clear results
        } finally {
          setLoading(false);
        }
      } else {
        setResults(null);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [query]);

  const handleResultClick = (module: string, id: string) => {
    navigate(`/${module.toLowerCase()}/${id}`);
    setQuery("");
    setIsOpen(false);
    setResults(null);
  };

  const getItemTitle = (item: any, module: string): string => {
    if (module === "leads" || module === "contacts") {
      return `${item.first_name || ""} ${item.last_name || ""}`.trim() || item.email || "Unnamed";
    }
    return item.name || item.title || item.email || "Unnamed";
  };

  const hasResults = results && (
    results.leads.length > 0 ||
    results.accounts.length > 0 ||
    results.contacts.length > 0 ||
    results.opportunities.length > 0 ||
    results.tasks.length > 0 ||
    results.events.length > 0 ||
    results.cases.length > 0 ||
    results.documents.length > 0
  );

  const renderGroup = (title: string, items: any[], module: string) => {
    if (items.length === 0) return null;

    return (
      <div key={module} className="py-2">
        <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">
          {title} ({items.length})
        </div>
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleResultClick(module, item.id)}
            className={cn(
              "w-full px-4 py-3 text-left hover:bg-accent transition-colors",
              "border-b last:border-b-0"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">
                  {getItemTitle(item, module)}
                </div>
                {item.email && (
                  <div className="text-sm text-muted-foreground truncate">
                    {item.email}
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    );
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
              setResults(null);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full mt-2 w-full rounded-md border bg-popover shadow-lg z-50 max-h-[500px] overflow-hidden">
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Searching...
            </div>
          ) : hasResults ? (
            <div className="overflow-y-auto max-h-[500px]">
              {renderGroup("Leads", results.leads, "leads")}
              {renderGroup("Accounts", results.accounts, "accounts")}
              {renderGroup("Contacts", results.contacts, "contacts")}
              {renderGroup("Opportunities", results.opportunities, "opportunities")}
              {renderGroup("Tasks", results.tasks, "tasks")}
              {renderGroup("Events", results.events, "events")}
              {renderGroup("Cases", results.cases, "cases")}
              {renderGroup("Documents", results.documents, "documents")}
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
