import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeals } from "@/hooks/useDeals";
import { DealFormDialog } from "./DealFormDialog";
import { Deal, DealFormData, DealStage } from "@/types/deal";
import {
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  GripVertical,
  Loader2,
} from "lucide-react";

const stages: { value: DealStage; label: string; color: string }[] = [
  { value: "lead", label: "Lead", color: "bg-slate-500" },
  { value: "analyzing", label: "Analyzing", color: "bg-blue-500" },
  { value: "offer_made", label: "Offer Made", color: "bg-yellow-500" },
  { value: "under_contract", label: "Under Contract", color: "bg-orange-500" },
  { value: "due_diligence", label: "Due Diligence", color: "bg-secondary" },
  { value: "closed", label: "Closed", color: "bg-green-500" },
  { value: "dead", label: "Dead", color: "bg-destructive" },
];

export function DealsPipelineBoard() {
  const { deals, isLoading, addDeal, updateDeal, updateDealStage, deleteDeal } =
    useDeals();
  const [formOpen, setFormOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dealToDelete, setDealToDelete] = useState<Deal | null>(null);

  const handleEdit = (deal: Deal) => {
    setSelectedDeal(deal);
    setFormOpen(true);
  };

  const handleDelete = (deal: Deal) => {
    setDealToDelete(deal);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (dealToDelete) {
      await deleteDeal(dealToDelete.id);
      setDeleteDialogOpen(false);
      setDealToDelete(null);
    }
  };

  const handleSubmit = async (data: Partial<DealFormData>) => {
    if (selectedDeal) {
      return await updateDeal(selectedDeal.id, data);
    }
    return await addDeal(data);
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStage = destination.droppableId as DealStage;
    await updateDealStage(draggableId, newStage);
  };

  const getDealsForStage = (stage: DealStage) =>
    deals.filter((d) => d.stage === stage);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => {
            setSelectedDeal(null);
            setFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Deal
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => {
            const stageDeals = getDealsForStage(stage.value);
            return (
              <div key={stage.value} className="min-w-[220px]">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                  <h3 className="font-semibold text-sm">{stage.label}</h3>
                  <Badge variant="secondary" className="ml-auto">
                    {stageDeals.length}
                  </Badge>
                </div>

                <Droppable droppableId={stage.value}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-2 min-h-[100px] p-2 rounded-lg transition-colors ${
                        snapshot.isDraggingOver
                          ? "bg-primary/10 border-2 border-dashed border-primary"
                          : "bg-muted/30"
                      }`}
                    >
                      {stageDeals.map((deal, index) => (
                        <Draggable
                          key={deal.id}
                          draggableId={deal.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`cursor-grab transition-shadow ${
                                snapshot.isDragging
                                  ? "shadow-lg ring-2 ring-primary"
                                  : "hover:shadow-md"
                              }`}
                            >
                              <CardContent className="p-3">
                                <div className="flex items-start gap-2">
                                  <div
                                    {...provided.dragHandleProps}
                                    className="mt-1 text-muted-foreground hover:text-foreground"
                                  >
                                    <GripVertical className="h-4 w-4" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-sm truncate">
                                      {deal.title}
                                    </h4>
                                    {deal.address && (
                                      <p className="text-xs text-muted-foreground truncate">
                                        {deal.address}
                                      </p>
                                    )}
                                  </div>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 shrink-0"
                                      >
                                        <MoreVertical className="h-3 w-3" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                      align="end"
                                      className="bg-popover"
                                    >
                                      <DropdownMenuItem
                                        onClick={() => handleEdit(deal)}
                                      >
                                        <Pencil className="h-3 w-3 mr-2" />
                                        Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => handleDelete(deal)}
                                        className="text-destructive"
                                      >
                                        <Trash2 className="h-3 w-3 mr-2" />
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>

                                {(deal.asking_price || deal.arv) && (
                                  <div className="flex gap-2 mt-2 text-xs ml-6">
                                    {deal.asking_price && (
                                      <span className="text-muted-foreground">
                                        Ask: $
                                        {(deal.asking_price / 1000).toFixed(0)}k
                                      </span>
                                    )}
                                    {deal.arv && (
                                      <span className="text-muted-foreground">
                                        ARV: ${(deal.arv / 1000).toFixed(0)}k
                                      </span>
                                    )}
                                  </div>
                                )}

                                {deal.expected_profit && (
                                  <div className="mt-2 ml-6">
                                    <Badge
                                      variant={
                                        deal.expected_profit > 0
                                          ? "default"
                                          : "destructive"
                                      }
                                      className="text-xs"
                                    >
                                      {deal.expected_profit > 0 ? "+" : ""}$
                                      {(deal.expected_profit / 1000).toFixed(0)}
                                      k profit
                                    </Badge>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                      {stageDeals.length === 0 && !snapshot.isDraggingOver && (
                        <div className="text-center py-4 text-xs text-muted-foreground">
                          Drop deals here
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      <DealFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        deal={selectedDeal}
        onSubmit={handleSubmit}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Deal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{dealToDelete?.title}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
