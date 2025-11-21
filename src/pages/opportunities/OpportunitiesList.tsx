import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { opportunitiesService } from "@/services/opportunities.service";
import type { Opportunity } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Search, Edit, Trash2, Eye, ChevronLeft, ChevronRight, DollarSign } from "lucide-react";
import OpportunityForm from "@/components/opportunities/OpportunityForm";
import OpportunityDetails from "@/components/opportunities/OpportunityDetails";

export default function OpportunitiesList() {
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

  const queryClient = useQueryClient();

  // Reset page when route changes
  useEffect(() => {
    setPage(1);
  }, [location.pathname]);

  // Cleanup dialogs on unmount
  useEffect(() => {
    return () => {
      setIsCreateOpen(false);
      setIsEditOpen(false);
      setIsDetailsOpen(false);
      setSelectedOpportunity(null);
    };
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["opportunities", location.pathname, page, limit, search],
    queryFn: () =>
      opportunitiesService.getAll({
        limit,
        offset: (page - 1) * limit,
        search,
        ordering: "-created_at",
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => opportunitiesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["opportunities"] });
    },
  });

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this opportunity?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleEdit = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setIsEditOpen(true);
  };

  const handleView = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setIsDetailsOpen(true);
  };

  // Normalize data to prevent runtime errors
  const results: Opportunity[] = Array.isArray(data?.results) ? data.results : [];
  const totalCount = typeof data?.count === "number" ? data.count : 0;
  const totalPages = totalCount > 0 && limit > 0 ? Math.ceil(totalCount / limit) : 0;

  const getStageColor = (stage: string) => {
    const colors: Record<string, "default" | "secondary" | "destructive" | "outline" | "success"> = {
      prospecting: "outline",
      qualification: "secondary",
      "needs-analysis": "secondary",
      proposal: "default",
      negotiation: "default",
      "closed-won": "success",
      "closed-lost": "destructive",
    };
    return colors[stage] || "outline";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Opportunities</h1>
          <p className="text-muted-foreground">Track your sales pipeline</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Opportunity
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search opportunities..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10"
            />
          </div>
        </div>
      </Card>

      <Card>
        {isLoading ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">Loading opportunities...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-destructive">Error loading opportunities</p>
          </div>
        ) : results.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No opportunities found</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Probability</TableHead>
                  <TableHead>Close Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((opportunity) => (
                  <TableRow key={opportunity.id}>
                    <TableCell className="font-medium">{opportunity.name}</TableCell>
                    <TableCell>
                      <Badge variant={getStageColor(opportunity.stage)}>
                        {opportunity.stage}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {opportunity.amount ? (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {opportunity.amount.toLocaleString()}
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {opportunity.probability ? `${opportunity.probability}%` : "-"}
                    </TableCell>
                    <TableCell>
                      {opportunity.close_date
                        ? new Date(opportunity.close_date).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleView(opportunity)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(opportunity)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(opportunity.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t p-4">
                <p className="text-sm text-muted-foreground">
                  Showing {(page - 1) * limit + 1} to{" "}
                  {Math.min(page * limit, totalCount)} of {totalCount} results
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent onClose={() => setIsCreateOpen(false)}>
          <DialogHeader>
            <DialogTitle>Create New Opportunity</DialogTitle>
          </DialogHeader>
          <OpportunityForm
            onSuccess={() => {
              setIsCreateOpen(false);
              queryClient.invalidateQueries({ queryKey: ["opportunities"] });
            }}
            onCancel={() => setIsCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent onClose={() => setIsEditOpen(false)}>
          <DialogHeader>
            <DialogTitle>Edit Opportunity</DialogTitle>
          </DialogHeader>
          {selectedOpportunity && (
            <OpportunityForm
              opportunity={selectedOpportunity}
              onSuccess={() => {
                setIsEditOpen(false);
                setSelectedOpportunity(null);
                queryClient.invalidateQueries({ queryKey: ["opportunities"] });
              }}
              onCancel={() => {
                setIsEditOpen(false);
                setSelectedOpportunity(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent onClose={() => setIsDetailsOpen(false)}>
          <DialogHeader>
            <DialogTitle>Opportunity Details</DialogTitle>
          </DialogHeader>
          {selectedOpportunity && (
            <OpportunityDetails
              opportunity={selectedOpportunity}
              onClose={() => {
                setIsDetailsOpen(false);
                setSelectedOpportunity(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
