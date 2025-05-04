import React from "react";
import { SavedRequest } from "./ApiTester";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Trash2 } from "lucide-react";

interface SavedRequestsProps {
  requests: SavedRequest[];
  onSelect: (request: SavedRequest) => void;
  onDelete: (id: string) => void;
}

const SavedRequests: React.FC<SavedRequestsProps> = ({
  requests,
  onSelect,
  onDelete,
}) => {
  if (requests.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No saved requests yet</p>
        <p className="text-sm mt-2">Save requests to reuse them later</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Saved Requests</h3>

      <ScrollArea className="h-[400px]">
        <div className="space-y-2 pr-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="p-3 border rounded-md hover:bg-accent group relative"
            >
              <div className="cursor-pointer" onClick={() => onSelect(request)}>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{request.method}</Badge>
                  <span className="font-medium truncate">{request.name}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate mt-1">
                  {request.url}
                </p>
                <div className="text-xs text-muted-foreground mt-2">
                  Saved{" "}
                  {formatDistanceToNow(new Date(request.createdAt), {
                    addSuffix: true,
                  })}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(request.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SavedRequests;
