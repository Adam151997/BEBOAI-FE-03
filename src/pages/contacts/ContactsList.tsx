import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { contactsService } from "@/services/contacts.service";
import type { Contact } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
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
import { Plus, Search, Edit, Trash2, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import ContactForm from "@/components/contacts/ContactForm";
import ContactDetails from "@/components/contacts/ContactDetails";

export default function ContactsList() {
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

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
      setSelectedContact(null);
    };
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["contacts", location.pathname, page, limit, search],
    queryFn: () =>
      contactsService.getAll({
        limit,
        offset: (page - 1) * limit,
        search,
        ordering: "-created_at",
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => contactsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleEdit = (contact: Contact) => {
    setSelectedContact(contact);
    setIsEditOpen(true);
  };

  const handleView = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDetailsOpen(true);
  };

  // Normalize data to prevent runtime errors
  const results: Contact[] = Array.isArray(data?.results) ? data.results : [];
  const totalCount = typeof data?.count === "number" ? data.count : 0;
  const totalPages = totalCount > 0 && limit > 0 ? Math.ceil(totalCount / limit) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contacts</h1>
          <p className="text-muted-foreground">Manage your contact relationships</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Contact
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
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
            <p className="text-muted-foreground">Loading contacts...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-destructive">Error loading contacts</p>
          </div>
        ) : results.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No contacts found</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">
                      {contact.first_name} {contact.last_name}
                    </TableCell>
                    <TableCell>{contact.email || "-"}</TableCell>
                    <TableCell>{contact.phone || "-"}</TableCell>
                    <TableCell>{contact.city || "-"}</TableCell>
                    <TableCell>{contact.country || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleView(contact)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(contact)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(contact.id)}
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
            <DialogTitle>Create New Contact</DialogTitle>
          </DialogHeader>
          <ContactForm
            onSuccess={() => {
              setIsCreateOpen(false);
              queryClient.invalidateQueries({ queryKey: ["contacts"] });
            }}
            onCancel={() => setIsCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent onClose={() => setIsEditOpen(false)}>
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <ContactForm
              contact={selectedContact}
              onSuccess={() => {
                setIsEditOpen(false);
                setSelectedContact(null);
                queryClient.invalidateQueries({ queryKey: ["contacts"] });
              }}
              onCancel={() => {
                setIsEditOpen(false);
                setSelectedContact(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent onClose={() => setIsDetailsOpen(false)}>
          <DialogHeader>
            <DialogTitle>Contact Details</DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <ContactDetails
              contact={selectedContact}
              onClose={() => {
                setIsDetailsOpen(false);
                setSelectedContact(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
